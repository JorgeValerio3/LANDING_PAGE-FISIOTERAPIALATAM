import { Router } from 'express';
import { loginAdmin, logoutAdmin, getAdminContent, updateAdminContentSection } from '../controllers/adminController';
import { cloudinaryStorage } from '../config/cloudinary';
import { uploadFiles } from '../controllers/uploadController';
import { authenticateJWT } from '../middleware/authMiddleware';
import multer from 'multer';

const ALLOWED_MIMES = new Set([
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const ALLOWED_EXT = /\.(jpeg|jpg|png|gif|webp|pdf|doc|docx)$/i;

const upload = multer({
    storage: cloudinaryStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const mimeOk = ALLOWED_MIMES.has(file.mimetype);
        const extOk = ALLOWED_EXT.test(file.originalname);
        if (mimeOk && extOk) {
            return cb(null, true);
        }
        cb(new Error('Solo se permiten imágenes (JPG, PNG, GIF, WEBP) y documentos (PDF, DOC, DOCX)'));
    },
});

const router = Router();

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/content', authenticateJWT, getAdminContent);
router.put('/content/:sectionKey', authenticateJWT, updateAdminContentSection);
router.post('/upload', authenticateJWT, upload.array('files', 5), uploadFiles);

export default router;
