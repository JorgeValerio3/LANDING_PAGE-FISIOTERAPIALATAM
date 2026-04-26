import { Router } from 'express';
import { loginAdmin, logoutAdmin, getAdminContent, updateAdminContentSection } from '../controllers/adminController';
import { cloudinaryStorage } from '../config/cloudinary';
import { uploadFiles } from '../controllers/uploadController';
import { authenticateJWT } from '../middleware/authMiddleware';
import multer from 'multer';

const upload = multer({ 
    storage: cloudinaryStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Aumentamos a 10MB ya que Cloudinary lo soporta bien
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx/;
        const isMimeTypeOk = allowedTypes.test(file.mimetype);
        const isExtensionOk = allowedTypes.test(file.originalname.toLowerCase());
        
        if (isMimeTypeOk || isExtensionOk) {
            return cb(null, true);
        }
        cb(new Error('Solo se permiten imágenes (JPG, PNG, GIF, WEBP) y documentos (PDF, DOC)'));
    }
});

const router = Router();

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/content', authenticateJWT, getAdminContent);
router.put('/content/:sectionKey', authenticateJWT, updateAdminContentSection);
router.post('/upload', authenticateJWT, upload.array('files', 5), uploadFiles);

export default router;
