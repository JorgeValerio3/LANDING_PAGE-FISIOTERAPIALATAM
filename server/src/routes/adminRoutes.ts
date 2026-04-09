import { Router } from 'express';
import { loginAdmin, logoutAdmin, getAdminContent, updateAdminContentSection } from '../controllers/adminController';
import { uploadFiles } from '../controllers/uploadController';
import { authenticateJWT } from '../middleware/authMiddleware';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuración de almacenamiento Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../public/uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Solo se permiten imágenes (JPG, PNG, GIF, WEBP)'));
    }
});

const router = Router();

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/content', getAdminContent);
router.put('/content/:sectionKey', authenticateJWT, updateAdminContentSection);
router.post('/upload', authenticateJWT, upload.array('files', 5), uploadFiles);

export default router;
