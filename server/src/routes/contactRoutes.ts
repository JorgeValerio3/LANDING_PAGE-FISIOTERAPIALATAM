import { Router } from 'express';
import { body } from 'express-validator';
import { sendContactEmail } from '../controllers/contactController';

const router = Router();

router.post('/', [
    body('nombre').trim().notEmpty().withMessage('Nombre es obligatorio').escape(),
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('asunto').optional().trim().escape(),
    body('mensaje').trim().notEmpty().withMessage('El mensaje es obligatorio').escape()
], sendContactEmail);

export default router;
