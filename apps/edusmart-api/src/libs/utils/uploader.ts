import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Options } from 'multer';
import * as path from 'path';

// Cloudinary instance (agar global config qilingan bo'lsa)

export function getMulterUploader(address: string): Options {
  return {
    storage: new CloudinaryStorage({
      cloudinary: cloudinary,
      params: async (req, file) => {
        // Fayl turini aniqlash (image yoki video)
        const isVideo = file.mimetype.startsWith('video');
        const resourceType = isVideo ? 'video' : 'image';
        
        // Original nomni olish (kengizmasiz)
        const originalName = path.parse(file.originalname).name;
        // Noob nom yaratish (bir xil nomlar bir-birini ustiga yozilmasligi uchun)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const publicId = `${originalName}-${uniqueSuffix}`;

        return {
          folder: `uploads/${address}`, // Bu yerda address papka bo'ladi
          public_id: publicId,
          resource_type: resourceType, // 'image' yoki 'video'
          // Rasmlar uchun qo'shimcha sozlamalar (ixtiyoriy)
          transformation: isVideo ? [] : [{ quality: 'auto', fetch_format: 'auto' }],
        };
      },
    }) as any, // NestJS/TS tip muammolarini oldini olish uchun
    limits: { 
      fileSize: 1024 * 1024 * 1024, // 1GB
      files: 1 
    },
    fileFilter: (req, file, cb) => {
      const allowedExtensions = /\.(jpg|jpeg|png|gif|mp4|avi|mkv)$/i;
      const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
      const allowedMimes = [
        'image/jpeg', 'image/png', 'image/gif', 
        'video/mp4', 'video/avi', 'video/x-matroska', 'video/webm'
      ];
      const mimetype = allowedMimes.includes(file.mimetype);

      if (extname && mimetype) {
        return cb(null, true);
      } else {
        return cb(new Error('Faqat image va video fayllar ruxsat etilgan!'));
      }
    }
  };
}