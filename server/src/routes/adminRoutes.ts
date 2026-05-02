import { Router, Request, Response, NextFunction } from 'express';
import { loginAdmin, logoutAdmin, getAdminContent, updateAdminContentSection, getContentStatus } from '../controllers/adminController';
import { cloudinaryStorage } from '../config/cloudinary';
import { uploadFiles } from '../controllers/uploadController';
import { authenticateJWT } from '../middleware/authMiddleware';
import multer from 'multer';

const ALLOWED_MIMES = new Set([
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'image/heic', 'image/heif',
    'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const ALLOWED_EXT = /\.(jpeg|jpg|png|gif|webp|heic|heif|mp4|webm|ogg|mov|pdf|doc|docx)$/i;

const upload = multer({
    storage: cloudinaryStorage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Aumentado a 50MB para videos
    fileFilter: (req, file, cb) => {
        const mimeOk = ALLOWED_MIMES.has(file.mimetype);
        const extOk = ALLOWED_EXT.test(file.originalname);
        if (mimeOk && extOk) {
            return cb(null, true);
        }
        cb(new Error(`Tipo de archivo no permitido: ${file.mimetype} / ${file.originalname}`));
    },
});

const handleUpload = (req: Request, res: Response, next: NextFunction) => {
    upload.array('files', 30)(req, res, (err: any) => {
        if (err) {
            return res.status(400).json({ error: err.message || 'Error al procesar archivo' });
        }
        next();
    });
};

const router = Router();

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/content', authenticateJWT, getAdminContent);
router.get('/content-status', authenticateJWT, getContentStatus);
router.put('/content/:sectionKey', authenticateJWT, updateAdminContentSection);
router.post('/upload', authenticateJWT, handleUpload, uploadFiles);

export default router;
