import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import * as adminController from '../controllers/adminController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

const uploadDir = path.join(__dirname, '../../public/uploads');

// Asegurar que el directorio de subidas existe
import fs from 'fs';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de Multer para subida de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB to allow small PDFs
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Solo se permiten imágenes (JPG, PNG, WEBP) o documentos PDF'));
    }
});

// Rutas públicas
router.get('/content', adminController.getContent);
router.post('/login', adminController.login);

// Rutas protegidas
router.put('/content', authMiddleware, adminController.updateContent);
router.put('/content/:section', authMiddleware, adminController.updateSection);
router.post('/upload', authMiddleware, upload.array('files', 10), adminController.uploadFile); // Support up to 10 files

export default router;
