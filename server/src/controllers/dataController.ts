import { Request, Response } from 'express';
import { readData, writeData } from '../config/db';

export const getAppData = async (req: Request, res: Response): Promise<void> => {
    try {
        const lang = (req.query.lang as string) || 'es';
        const { data } = await readData(lang);
        if (!data) {
            res.status(404).json({ error: `No se encontraron datos para el idioma '${lang}'` });
            return;
        }
        res.status(200).json(data);
    } catch (error: any) {
        console.error('QA Error [getAppData]:', error);
        res.status(500).json({
            error: 'Error al obtener los datos globales',
            details: error.message || 'Error desconocido del sistema'
        });
    }
};

export const updateAppData = async (req: Request, res: Response): Promise<void> => {
    try {
        const newData = req.body;
        const lang = (req.query.lang as string) || 'es';
        
        // 1. Validación de esquema básico
        if (!newData || typeof newData !== 'object' || Array.isArray(newData) || Object.keys(newData).length === 0) {
            res.status(400).json({ error: 'Proporciona un objeto JSON válido para actualizar' });
            return;
        }

        // 2. Lectura para Smart Merge
        const { data: currentData } = await readData(lang);
        const mergedData = {
            ...(typeof currentData === 'object' ? currentData : {}),
            ...newData
        };

        const success = await writeData(mergedData, lang);
        
        if (success) {
            res.status(200).json({ 
                message: `Datos actualizados (${lang}) correctamente`,
                updatedKeys: Object.keys(newData)
            });
        } else {
            throw new Error(`Falló el guardado en MongoDB (${lang})`);
        }
    } catch (error: any) {
        console.error('QA Error [updateAppData]:', error);
        res.status(500).json({ 
            error: 'Error crítico al intentar actualizar la base de datos',
            details: error.message || 'Error desconocido del motor de base de datos'
        });
    }
};
