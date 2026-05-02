import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de Cloudinary SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración del almacenamiento para Multer
const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const VIDEO_MIMES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isImage = IMAGE_MIMES.includes(file.mimetype);
    const isVideo = VIDEO_MIMES.includes(file.mimetype);
    
    return {
      folder: 'ufaal_uploads',
      ...(isImage && { format: 'webp' }),
      resource_type: (isImage || isVideo) ? (isImage ? 'image' : 'video') : 'raw',
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

export default cloudinary;
