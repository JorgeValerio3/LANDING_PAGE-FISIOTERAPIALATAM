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

const SUPPORTED_LANGS = ['es', 'en', 'fr', 'pt'];

function getKeyTextField(section: string, data: any): string | null {
    const keyMap: Record<string, string[]> = {
        hero: ['titulo_principal', 'subtitulo'],
        quienes_somos: ['descripcion', 'titulo'],
        organizacion: ['descripcion', 'titulo'],
        paises: ['titulo', 'descripcion'],
        actividades: ['titulo'],
        formacion: ['titulo'],
        investigacion: ['titulo'],
        galeria: ['titulo', 'descripcion'],
        noticias: ['titulo'],
        afiliacion: ['titulo', 'descripcion'],
        contacto: ['titulo'],
        historia: ['titulo'],
        colaboradores: ['titulo'],
        footer: ['descripcion'],
        navbar: ['brand'],
    };
    const fields = keyMap[section] || ['titulo'];
    for (const field of fields) {
        const value = data[field];
        if (value && typeof value === 'string' && value.trim()) return value.trim();
    }
    return null;
}

// Propaga datos no traducibles (imágenes, IDs, coordenadas) a todos los idiomas
async function syncMediaAcrossLangs(sectionKey: string, sourceData: any, sourceLang: string): Promise<void> {
    for (const lang of SUPPORTED_LANGS) {
        if (lang === sourceLang) continue;
        try {
            const { data: langData, source } = await readData(lang);
            // Si el idioma no tiene datos en DB, no sincronizamos para evitar crear documentos incompletos
            if (source !== 'db_exact') continue;

            const targetSection = langData[sectionKey];
            if (!targetSection) {
                // Si la sección no existe en el destino, la copiamos íntegra (útil para nuevos idiomas)
                const updatedData = { ...langData, [sectionKey]: sourceData };
                await writeData(updatedData, lang);
                continue;
            }

            // Función recursiva para mezclar datos preservando textos traducidos
            const mergeMedia = (src: any, tgt: any): any => {
                if (Array.isArray(src)) {
                    if (!Array.isArray(tgt)) return src;
                    
                    // Estrategia para listas: sincronizar por 'id' o 'iso'
                    const srcMap = new Map();
                    src.forEach((item, idx) => {
                        const id = item.id || item.iso || `idx_${idx}`;
                        srcMap.set(id, item);
                    });

                    const tgtMap = new Map();
                    tgt.forEach((item, idx) => {
                        const id = item.id || item.iso || `idx_${idx}`;
                        tgtMap.set(id, item);
                    });

                    // Construimos la lista final basada en el orden del origen
                    return src.map((srcItem, idx) => {
                        const id = srcItem.id || srcItem.iso || `idx_${idx}`;
                        const tgtItem = tgtMap.get(id);
                        if (!tgtItem) return srcItem; // Elemento nuevo
                        return mergeMedia(srcItem, tgtItem);
                    });
                }

                if (src && typeof src === 'object') {
                    if (!tgt || typeof tgt !== 'object') return src;
                    const result = { ...tgt };
                    
                    for (const key in src) {
                        // Campos de texto que NO sincronizamos (estos se traducen)
                        const textFields = ['titulo', 'descripcion', 'nombre', 'subtitulo', 'contenido', 'extracto', 'cargo', 'role', 'representante', 'etiqueta', 'cta_primario', 'cta_secundario', 'texto'];
                        
                        if (textFields.includes(key)) {
                            // Preservamos el texto que ya tiene el destino, o usamos el del origen si es nuevo
                            result[key] = tgt[key] !== undefined ? tgt[key] : src[key];
                        } else {
                            // Sincronizamos recursivamente (imágenes, coordenadas, flags, IDs, etc)
                            result[key] = mergeMedia(src[key], tgt[key]);
                        }
                    }
                    return result;
                }

                return src; // Valores primitivos (URLs, números, etc) se sincronizan siempre
            };

            const mergedSection = mergeMedia(sourceData, targetSection);
            const updatedData = { ...langData, [sectionKey]: mergedSection };
            
            await writeData(updatedData, lang);
            console.log(`QA Admin [Sync]: Sección '${sectionKey}' sincronizada globalmente (${sourceLang} -> ${lang})`);
        } catch (err) {
            console.error(`QA Error [syncMediaAcrossLangs] section=${sectionKey} lang=${lang}:`, err);
        }
    }
}

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
                    secure: true,
                    sameSite: 'none',
                    maxAge: 8 * 60 * 60 * 1000
                });

                // Token también en body para clientes que no soportan cookies cross-origin (iOS Safari ITP)
                res.status(200).json({ success: true, message: 'Autenticación exitosa', token });
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
        res.clearCookie('admin_token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
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
            // Sincronización global de multimedia para CUALQUIER idioma que se guarde
            syncMediaAcrossLangs(sectionKey, sectionData, lang).catch(err =>
                console.error(`QA Error [syncMedia background] section=${sectionKey}:`, err)
            );

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

export const getContentStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const reads = await Promise.all(
            SUPPORTED_LANGS.map(lang => readData(lang).then(r => ({ lang, data: r.data, source: r.source })))
        );

        const esEntry = reads.find(r => r.lang === 'es');
        const esData = esEntry?.data ?? {};

        const status: Record<string, any> = {};

        for (const { lang, data, source } of reads) {
            if (lang === 'es') {
                status[lang] = { source, sections: {} };
                continue;
            }

            const sectionStatus: Record<string, string> = {};

            if (source !== 'db_exact') {
                for (const section of ALLOWED_SECTIONS) {
                    sectionStatus[section] = 'not_saved';
                }
            } else {
                for (const section of ALLOWED_SECTIONS) {
                    const sectionData = data[section];
                    const esSectionData = esData[section];

                    if (!sectionData) {
                        sectionStatus[section] = 'empty';
                    } else if (esSectionData) {
                        const keyField = getKeyTextField(section, sectionData);
                        const esKeyField = getKeyTextField(section, esSectionData);
                        sectionStatus[section] = (keyField && keyField === esKeyField) ? 'untranslated' : 'ok';
                    } else {
                        sectionStatus[section] = 'ok';
                    }
                }
            }

            status[lang] = { source, sections: sectionStatus };
        }

        res.status(200).json(status);
    } catch (error: any) {
        console.error('QA Error [getContentStatus]:', error);
        res.status(500).json({ error: 'Error al recuperar estado de contenidos' });
    }
};
