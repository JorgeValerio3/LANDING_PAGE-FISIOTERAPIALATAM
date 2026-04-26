import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { readData, writeData } from '../config/db';

// Lista blanca de secciones permitidas para edición
const ALLOWED_SECTIONS = [
    'hero', 'quienes_somos', 'historia', 'organizacion',
    'paises', 'actividades', 'formacion', 'investigacion',
    'galeria', 'noticias', 'afiliacion', 'contacto',
    'colaboradores', 'footer', 'navbar'
];

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        // Validación defensiva de tipos
        if (typeof username !== 'string' || typeof password !== 'string') {
            res.status(400).json({ error: 'Formato de credenciales inválido' });
            return;
        }
        
        const adminUser = (process.env.ADMIN_USER || 'admin_ufaal').trim();
        const adminPassHash = (process.env.ADMIN_PASS || '').trim();

        if (username === adminUser && adminPassHash) {
            // QA: Uso de versión asíncrona para no bloquear el event loop
            const isMatch = await bcrypt.compare(password, adminPassHash);

            if (isMatch) {
                const token = jwt.sign(
                    { username }, 
                    process.env.JWT_SECRET || 'secret_key_ufaalsuperadmin', 
                    { expiresIn: '8h' }
                );

                res.cookie('admin_token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 8 * 60 * 60 * 1000 
                });

                res.status(200).json({ success: true, message: 'Autenticación exitosa' });
                return;
            }
        }
        
        res.status(401).json({ error: 'Credenciales de acceso incorrectas' });
    } catch (error) {
        console.error('QA Error [loginAdmin]:', error);
        res.status(500).json({ error: 'Error interno en el proceso de autenticación' });
    }
};

export const logoutAdmin = (req: Request, res: Response): void => {
    try {
        res.clearCookie('admin_token');
        res.status(200).json({ success: true, message: 'Sesión cerrada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al cerrar sesión' });
    }
};

export const getAdminContent = async (req: Request, res: Response): Promise<void> => {
    try {
        const lang = (req.query.lang as string) || 'es';
        const { data, source } = await readData(lang);
        res.status(200).json({ ...data, _meta: { source, lang } });
    } catch (error) {
        console.error('QA Error [getAdminContent]:', error);
        res.status(500).json({ error: 'Error al recuperar contenidos' });
    }
};

export const updateAdminContentSection = async (req: Request, res: Response): Promise<void> => {
    try {
        const { sectionKey } = req.params;
        const sectionData = req.body;
        const lang = (req.query.lang as string) || 'es';
        
        // 1. Validación de existencia y tipo
        if (!sectionKey || typeof sectionKey !== 'string' || !sectionData || typeof sectionData !== 'object') {
            res.status(400).json({ error: 'Datos de sección inválidos' });
            return;
        }

        // 2. Defensa contra Prototype Pollution y claves no permitidas
        if (sectionKey.startsWith('__') || sectionKey === 'constructor' || !ALLOWED_SECTIONS.includes(sectionKey)) {
            res.status(403).json({ error: `La sección '${sectionKey}' no está permitida o es inválida` });
            return;
        }

        const { data: currentData } = await readData(lang);

        if (!currentData || typeof currentData !== 'object') {
            res.status(500).json({ error: 'Error de integridad en la base de datos' });
            return;
        }

        // 3. Actualización atómica de sección
        const updatedData = { ...currentData };
        updatedData[sectionKey] = sectionData;
        
        console.log(`QA Admin [Update]: Intentando actualizar sección '${sectionKey}' en idioma '${lang}' en MongoDB...`);
        const success = await writeData(updatedData, lang);
        
        if (success) {
            res.status(200).json({ 
                message: `Sección '${sectionKey}' actualizada correctamente (${lang})`,
                section: sectionData
            });
        } else {
            console.error(`QA Error: Falló la escritura en MongoDB para la sección '${sectionKey}' (${lang})`);
            res.status(500).json({ error: 'Error de persistencia: No se pudo guardar en la base de datos MongoDB' });
        }
    } catch (error: any) {
        console.error('QA Error [updateAdminContentSection]:', error);
        res.status(500).json({ 
            error: 'Error crítico interno',
            details: error.message || 'Error desconocido'
        });
    }
};
