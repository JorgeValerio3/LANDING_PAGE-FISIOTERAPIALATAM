import { Request, Response } from 'express';
import { readData, writeData } from '../config/db';

export const getAppData = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await readData();
        if (!data) {
            res.status(404).json({ error: 'No se encontraron datos en la base de datos' });
            return;
        }
        res.status(200).json(data);
    } catch (error) {
        console.error('QA Error [getAppData]:', error);
        res.status(500).json({ error: 'Error al obtener los datos globales' });
    }
};

export const updateAppData = async (req: Request, res: Response): Promise<void> => {
    try {
        const newData = req.body;
        
        // 1. Validación de esquema básico
        if (!newData || typeof newData !== 'object' || Array.isArray(newData) || Object.keys(newData).length === 0) {
            res.status(400).json({ error: 'Proporciona un objeto JSON válido para actualizar' });
            return;
        }

        // 2. Lectura para Smart Merge (Evitar borrados accidentales de secciones omitidas)
        const currentData = await readData();
        const mergedData = { 
            ...(typeof currentData === 'object' ? currentData : {}), 
            ...newData 
        };

        const success = await writeData(mergedData);
        
        if (success) {
            res.status(200).json({ 
                message: 'Datos actualizados (fusionados) correctamente en la base de datos',
                updatedKeys: Object.keys(newData)
            });
        } else {
            throw new Error('Falló el guardado en el archivo JSON');
        }
    } catch (error) {
        console.error('QA Error [updateAppData]:', error);
        res.status(500).json({ error: 'Error crítico al intentar actualizar la base de datos' });
    }
};
