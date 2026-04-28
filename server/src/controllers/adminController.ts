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

// Propaga imágenes de países (imagen perfil + galería) de ES → otros langs sin sobreescribir texto traducido
async function syncPaisesToAllLangs(esPaisesData: any): Promise<void> {
    const esPaises: any[] = esPaisesData.paises_lista || [];
    for (const lang of SUPPORTED_LANGS) {
        if (lang === 'es') continue;
        try {
            const { data: langData, source } = await readData(lang);
            if (source !== 'db_exact') continue;

            const langPaises: any[] = langData.paises?.paises_lista || [];
            const langPaisesMap = new Map(langPaises.map((p: any) => [p.id, p]));

            const mergedPaises = esPaises.map((esPais: any) => {
                const existing = langPaisesMap.get(esPais.id);
                if (existing) {
                    return {
                        ...existing,
                        latitud: esPais.latitud,
                        longitud: esPais.longitud,
                        imagen: esPais.imagen,
                        galeria: esPais.galeria,
                    };
                }
                return { ...esPais };
            });

            const updatedData = {
                ...langData,
                paises: { ...(langData.paises || {}), paises_lista: mergedPaises }
            };
            await writeData(updatedData, lang);
            console.log(`QA Admin [syncPaises]: Países sincronizados → ${lang}`);
        } catch (err) {
            console.error(`QA Error [syncPaisesToAllLangs] lang=${lang}:`, err);
        }
    }
}

// Propaga URLs de imágenes de galería ES → otros langs sin sobreescribir traducciones existentes
async function syncGaleriaToAllLangs(esGaleriaData: any): Promise<void> {
    const esImages: any[] = esGaleriaData.imagenes || [];
    for (const lang of SUPPORTED_LANGS) {
        if (lang === 'es') continue;
        try {
            const { data: langData, source } = await readData(lang);
            if (source !== 'db_exact') continue; // Solo sincroniza langs que ya existen

            const langImages: any[] = langData.galeria?.imagenes || [];
            const langImageMap = new Map(langImages.map((img: any) => [img.id, img]));

            const mergedImages = esImages.map((esImg: any) => {
                const existing = langImageMap.get(esImg.id);
                if (existing) {
                    // Preserva traducciones del idioma pero actualiza url y categoria desde ES
                    return {
                        ...esImg,
                        titulo: existing.titulo || esImg.titulo,
                        descripcion: existing.descripcion || esImg.descripcion,
                        alt: existing.alt || esImg.alt,
                    };
                }
                return { ...esImg };
            });

            const updatedData = {
                ...langData,
                galeria: { ...(langData.galeria || {}), imagenes: mergedImages }
            };
            await writeData(updatedData, lang);
            console.log(`QA Admin [syncGaleria]: Galería sincronizada → ${lang} (${mergedImages.length} fotos)`);
        } catch (err) {
            console.error(`QA Error [syncGaleriaToAllLangs] lang=${lang}:`, err);
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
            if (lang === 'es') {
                if (sectionKey === 'galeria') {
                    syncGaleriaToAllLangs(sectionData).catch(err =>
                        console.error('QA Error [syncGaleria background]:', err)
                    );
                }
                if (sectionKey === 'paises') {
                    syncPaisesToAllLangs(sectionData).catch(err =>
                        console.error('QA Error [syncPaises background]:', err)
                    );
                }
            }
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
