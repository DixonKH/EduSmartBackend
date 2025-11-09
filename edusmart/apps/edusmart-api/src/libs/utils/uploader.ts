import { diskStorage, Options } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { Logger } from '@nestjs/common'; 
import * as fs from 'fs';

// Logger ni yaratish
const logger = new Logger('MulterUploader');

export function getMulterUploader(address: string): Options {
  return {
    storage: diskStorage({
      destination: function (req, file, cb) {
        const uploadPath = `./uploads/${address}`;
        // Check if the directory exists; if not, create it
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        logger.log(`Uploading file to path: ${uploadPath}`); // Log yozish
        cb(null, uploadPath); // Fayllarni saqlash manzili
      },
      filename: function (req, file, cb) {
        const originalName = path.parse(file.originalname).name; // Fayl nomining asosiy qismini olish
        const extension = path.extname(file.originalname);
        const uniqueName = `${originalName}${extension}`;
        logger.log(
          `Generated unique file name: ${extension} for original file: ${file.originalname}`,
        ); // Log yozish
        cb(null, uniqueName); // Fayl nomi uchun noyob nom
      },
    }),
    limits: { fileSize: 1024 * 1024 * 1024 }, // Maksimal fayl hajmi: 1GB
    fileFilter: (req, file, cb) => {
        const allowedExtensions = /\.(jpg|jpeg|png|gif|mp4|avi|mkv)$/;
        const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
        const mimetype = file.mimetype.match(/\/(jpg|jpeg|png|gif|pdf|txt|mp4|avi|mkv)$/);
      
        if (extname && (mimetype || file.mimetype === 'application/octet-stream')) {
          return cb(null, true); // Fayl qabul qilindi
        } else {
            cb(null, false);
          return cb(new Error('Image, PDF and Video files are allowed!'));
        }
      }
  };
}
