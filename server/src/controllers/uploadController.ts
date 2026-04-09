import { Request, Response } from 'express';
import path from 'path';

export const uploadFiles = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.files || !(req.files instanceof Array) || req.files.length === 0) {
            res.status(400).json({ error: 'No se subieron archivos' });
            return;
        }

        // QA: Retornar las URLs relativas (asumiendo que /uploads se sirve estáticamente)
        const urls = (req.files as Express.Multer.File[]).map(file => {
            // El nombre del archivo ya viene procesado por el middleware de multer en adminRoutes
            return `/uploads/${file.filename}`;
        });

        res.status(200).json({ 
            success: true, 
            message: 'Archivos subidos correctamente',
            urls 
        });
    } catch (error) {
        console.error('QA Error [uploadFiles]:', error);
        res.status(500).json({ error: 'Error interno al procesar los archivos' });
    }
};
