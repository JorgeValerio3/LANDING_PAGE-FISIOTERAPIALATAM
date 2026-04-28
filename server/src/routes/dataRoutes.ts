import { Router } from 'express';
import { getAppData, updateAppData } from '../controllers/dataController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getAppData);
router.put('/', authenticateJWT, updateAppData);

export default router;
