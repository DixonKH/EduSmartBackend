import { diskStorage, Options } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { Logger } from '@nestjs/common';

// Logger instance creation
const logger = new Logger('MulterVideoUploader');

export function getVideoUploader(address: string): Options {
  return {
    storage: diskStorage({
      destination: function (req, file, cb) {
        const uploadPath = `./uploads/${address}`;
        logger.log(`Uploading video to path: ${uploadPath}`); // Log the upload path
        cb(null, uploadPath); // Set the upload path
      },
      filename: function (req, file, cb) {
        const originalName = path.parse(file.originalname).name; // Extract the base name of the file
        const extension = path.extname(file.originalname);
        const uniqueName = `${originalName}-${uuidv4()}${extension}`; // Generate a unique file name
        logger.log(
          `Generated unique file name: ${uniqueName} for original file: ${file.originalname}`
        ); // Log the generated file name
        cb(null, uniqueName); // Set the unique file name
      },
    }),
    limits: { fileSize: 1000 * 1024 * 1024 }, // Maximum file size: 1GB
    fileFilter: (req, file, cb) => {
      const allowedExtensions = /\.(mp4|avi|mkv|mov)$/; // Allowed video extensions
      const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
      const mimetype = /(video\/mp4|video\/avi|video\/mkv|video\/mov|video\/quicktime)/.test(file.mimetype); // Check for correct MIME types

      if (extname && mimetype) {
        logger.log(`File accepted: ${file.originalname}, MIME type: ${file.mimetype}`); // Log accepted file
        return cb(null, true); // Accept the file
      } else {
        logger.error(
          `Invalid file type: ${file.originalname}, MIME type: ${file.mimetype}`
        ); // Log invalid file type
        return cb(
          new Error('Only video files (MP4, AVI, MKV, MOV) are allowed!')
        );
      }
    },
  };
}
