import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(__dirname, '../../data/db.json');

// Estructura mínima para evitar que el frontend rompa en el primer inicio
const DEFAULT_DATA = {
    navbar: { items: [] },
    hero: { titulo_principal: "UFAAL", descripcion: "", estadisticas: [] },
    paises: { paises_lista: [] },
    contacto: { redes_sociales: {} }
};

/**
 * Lee los datos del archivo JSON de forma segura.
 * QA: Implementa validación de integridad y auto-inicialización.
 */
export const readData = async () => {
    try {
        // Verificar si el archivo existe antes de intentar leerlo
        try {
            await fs.access(dbPath);
        } catch {
            console.warn('QA Warning: db.json no encontrado. Inicializando con valores por defecto...');
            await writeData(DEFAULT_DATA);
            return DEFAULT_DATA;
        }

        const rawData = await fs.readFile(dbPath, 'utf8');
        
        // QA: Validar que el archivo no esté vacío antes de parsear
        if (!rawData || !rawData.trim()) {
            return DEFAULT_DATA;
        }

        try {
            return JSON.parse(rawData);
        } catch (parseError: any) {
            console.error('QA Critical Error: db.json tiene un formato inválido.', parseError.message);
            // QA: No devolvemos {} si hay error de parseo grave, lanzamos error para evitar sobreescritura accidental
            throw new Error(`Corrupción de datos detectada en el archivo JSON: ${parseError.message}`);
        }
    } catch (error: any) {
        console.error('QA Error [readData]:', error.message || error);
        throw error; // Re-lanzamos para que los controladores manejen el 500
    }
};

/**
 * Escribe datos en el archivo JSON.
 * QA: Añade validación de tipo para prevenir escrituras nulas.
 */
export const writeData = async (data: any) => {
    try {
        if (!data || typeof data !== 'object') {
            throw new Error('Intento de escritura de datos inválidos (null o no-objeto)');
        }

        await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('QA Error [writeData]: Fallo al escribir en disco.', error);
        return false;
    }
};
