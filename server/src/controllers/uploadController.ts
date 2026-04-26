import { Request, Response } from 'express';
import path from 'path';

export const uploadFiles = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.files || !(req.files instanceof Array) || req.files.length === 0) {
            res.status(400).json({ error: 'No se subieron archivos' });
            return;
        }

        // Cloudinary devuelve la URL completa en file.path cuando se usa multer-storage-cloudinary
        const urls = (req.files as any[]).map(file => {
            return file.path; 
        });

        res.status(200).json({ 
            success: true, 
            message: 'Archivos subidos a la nube correctamente',
            urls 
        });
    } catch (error) {
        console.error('QA Error [uploadFiles]:', error);
        res.status(500).json({ error: 'Error interno al procesar los archivos' });
    }
};
