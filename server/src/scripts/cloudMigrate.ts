import { MongoClient } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config({ path: path.join(process.cwd(), 'server', '.env') });

// Configuración de Cloudinary (Usa variables de entorno por seguridad)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dldj1ue8b',
  api_key: process.env.CLOUDINARY_API_KEY || '863496264421868',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'vVLMhoYUUJjxeN1XIjAyg5itWD0'
});

const uri = process.env.MONGODB_URI || '';
const collectionName = process.env.MONGODB_COLLECTION || 'app_data';
const publicDir = path.join(process.cwd(), 'client/public');

async function migrateAssets() {
    console.log('🚀 Iniciando Auditoría y Migración Global de Activos (DB -> Cloudinary)...');

    if (!uri) {
        console.error('❌ Error: MONGODB_URI no encontrada');
        return;
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const dbName = uri.split('/').pop()?.split('?')[0] || 'ufaal_db';
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const langs = ['es', 'en', 'fr', 'pt'];
        let totalMigrated = 0;

        for (const lang of langs) {
            const type = `global_config_${lang}`;
            console.log(`\n🔍 Auditando idioma: ${lang.toUpperCase()}...`);
            
            const doc = await collection.findOne({ _type: type });
            if (!doc) continue;

            const { _id, ...content } = doc;
            let count = 0;

            // Función recursiva para buscar y subir archivos
            async function processDeep(obj: any): Promise<any> {
                if (typeof obj !== 'object' || obj === null) return obj;
                if (Array.isArray(obj)) return Promise.all(obj.map(item => processDeep(item)));

                for (const key in obj) {
                    const value = obj[key];
                    // Detectar rutas locales de imágenes o documentos
                    if (typeof value === 'string' && (value.includes('/images/') || value.includes('/docs_proyecto/'))) {
                        const fileName = value.split('/').pop();
                        const isDoc = value.includes('docs_proyecto');
                        const localPath = path.join(publicDir, isDoc ? 'docs_proyecto' : 'images', fileName!);

                        try {
                            await fs.access(localPath);
                            console.log(`   📤 Subiendo a la nube: ${fileName}...`);
                            const res = await cloudinary.uploader.upload(localPath, {
                                folder: `ufaal_prod/${isDoc ? 'docs' : 'images'}`,
                                resource_type: isDoc ? 'raw' : 'image'
                            });
                            obj[key] = res.secure_url;
                            count++;
                            totalMigrated++;
                            console.log(`   ✅ Sincronizado: ${res.secure_url}`);
                        } catch (e) {
                            // console.warn(`   ⚠️ Archivo local no encontrado: ${fileName}`);
                        }
                    } else if (typeof value === 'object') {
                        obj[key] = await processDeep(value);
                    }
                }
                return obj;
            }

            const updatedContent = await processDeep(content);

            if (count > 0) {
                await collection.updateOne({ _id }, { $set: { ...updatedContent, updatedAt: new Date() } });
                console.log(`   ✨ Idioma ${lang.toUpperCase()} actualizado en MongoDB (${count} cambios).`);
            } else {
                console.log(`   💎 Sin archivos locales pendientes en ${lang.toUpperCase()}.`);
            }
        }

        console.log(`\n🎉 Auditoría finalizada. Total de activos migrados: ${totalMigrated}`);
    } catch (error: any) {
        console.error('❌ Error fatal durante la migración:', error.message);
    } finally {
        await client.close();
    }
}

migrateAssets();
