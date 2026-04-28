import { MongoClient } from 'mongodb';
import cloudinary from '../config/cloudinary';
import path from 'path';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || '';
const collectionName = process.env.MONGODB_COLLECTION || 'app_data';
const uploadsDir = path.join(__dirname, '../../../client/public/uploads');
const publicImagesDir = path.join(__dirname, '../../../client/public/images');

async function migrateImages() {
    console.log('🚀 Iniciando migración de imágenes locales (/uploads y /images) a Cloudinary...');

    if (!uri) {
        console.error('❌ MONGODB_URI no encontrada.');
        return;
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('ufaal_db');
        const collection = db.collection(collectionName);

        // 1. Obtener el documento actual
        const cloudDoc = await collection.findOne({ _type: 'global_config' });

        if (!cloudDoc) {
            console.error('❌ No se encontró el documento de configuración en MongoDB.');
            return;
        }

        let updated = false;
        let migrationCount = 0;

        // Función recursiva para buscar y reemplazar rutas locales
        const processObject = async (obj: any): Promise<any> => {
            if (typeof obj !== 'object' || obj === null) return obj;

            if (Array.isArray(obj)) {
                const newArr = [];
                for (const item of obj) {
                    newArr.push(await processObject(item));
                }
                return newArr;
            }

            const newObj: any = {};
            for (let [key, value] of Object.entries(obj)) {
                // Caso 1: Rutas de /uploads/ o /images/
                if (typeof value === 'string' && (value.startsWith('/uploads/') || value.startsWith('/images/'))) {
                    let fileName = '';
                    let localPath = '';
                    
                    if (value.startsWith('/uploads/')) {
                        fileName = value.replace('/uploads/', '');
                        localPath = path.join(uploadsDir, fileName);
                    } else {
                        fileName = value.replace('/images/', '');
                        localPath = path.join(publicImagesDir, fileName);
                    }

                    try {
                        // Verificar si el archivo existe localmente
                        await fs.access(localPath);
                        
                        console.log(`📤 Subiendo a Cloudinary: ${fileName}...`);
                        const result = await cloudinary.uploader.upload(localPath, {
                            folder: 'ufaal_production',
                            public_id: `${Date.now()}-${fileName.split('.')[0]}`
                        });

                        console.log(`✅ ¡Éxito! Nueva URL: ${result.secure_url}`);
                        newObj[key] = result.secure_url;
                        updated = true;
                        migrationCount++;
                    } catch (err) {
                        console.warn(`⚠️ No se pudo migrar ${value}: El archivo no existe o error en subida.`);
                        newObj[key] = value;
                    }
                } else if (typeof value === 'object' && value !== null) {
                    newObj[key] = await processObject(value);
                } else {
                    newObj[key] = value;
                }
            }
            return newObj;
        };

        const migratedDoc = await processObject(cloudDoc);

        if (updated) {
            // Guardar cambios en MongoDB
            const { _id, ...cleanDoc } = migratedDoc;
            await collection.updateOne(
                { _type: 'global_config' },
                { $set: cleanDoc },
                { upsert: true }
            );
            console.log(`\n🎉 Migración completada. Se actualizaron ${migrationCount} imágenes.`);
        } else {
            console.log('\n✨ No se encontraron imágenes locales (/uploads/) para migrar.');
        }

    } catch (error: any) {
        console.error('❌ Error durante la migración:', error.message);
    } finally {
        await client.close();
    }
}

migrateImages();
