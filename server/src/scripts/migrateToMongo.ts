import { MongoClient } from 'mongodb';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config({ path: path.join(process.cwd(), 'server', '.env') });

const uri = process.env.MONGODB_URI || '';
const collectionName = process.env.MONGODB_COLLECTION || 'app_data';
const dbPath = path.join(__dirname, '../../data/db.json');
const localesPath = path.join(__dirname, '../../../client/src/locales');

/**
 * Función auxiliar para mezclar objetos de forma profunda.
 * QA: Protege los Arrays para que no sean sobrescritos por Objetos de traducción.
 */
function deepMerge(target: any, source: any) {
    if (!source) return target;
    const output = { ...target };
    
    Object.keys(source).forEach(key => {
        // Si el destino es un Array, NO permitimos que un Objeto lo sobrescriba.
        // Esto protege estructuras como 'secciones', 'articulos', 'imagenes', etc.
        if (Array.isArray(target[key])) {
            // Si el origen también es array, podríamos mezclar, 
            // pero para UFAAL preferimos mantener la estructura del target (DB)
            return;
        }

        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            output[key] = deepMerge(target[key] || {}, source[key]);
        } else {
            output[key] = source[key];
        }
    });
    return output;
}

async function migrate() {
    console.log('🚀 Iniciando migración de Locales + DB a MongoDB...');

    if (!uri) {
        console.error('❌ Error: MONGODB_URI no encontrada en .env');
        process.exit(1);
    }

    const client = new MongoClient(uri);

    try {
        // 1. Leer db.json estructural
        console.log(`📂 Leyendo base estructural: ${dbPath}`);
        const rawDb = await fs.readFile(dbPath, 'utf8');
        const dbBase = JSON.parse(rawDb);

        // 2. Conectar a MongoDB
        console.log('📡 Conectando a MongoDB Atlas...');
        await client.connect();
        const dbName = uri.split('/').pop()?.split('?')[0] || 'ufaal_db';
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // 3. Procesar cada idioma
        const langs = ['es', 'en', 'fr', 'pt'];
        
        for (const lang of langs) {
            const localeFile = path.join(localesPath, `${lang}.json`);
            console.log(`🔍 Procesando idioma: ${lang.toUpperCase()}...`);
            
            let localeData = {};
            try {
                const rawLocale = await fs.readFile(localeFile, 'utf8');
                localeData = JSON.parse(rawLocale);
                console.log(`   ✅ Archivo ${lang}.json leído.`);
            } catch (err) {
                console.warn(`   ⚠️ No se pudo leer ${lang}.json, se usará solo db.json.`);
            }

            // Mezclar: El locale tiene prioridad sobre el dbBase para los textos
            const finalData = deepMerge(dbBase, localeData);
            const type = `global_config_${lang}`;

            console.log(`   📤 Sincronizando en MongoDB (${type})...`);
            await collection.updateOne(
                { _type: type },
                { 
                    $set: { 
                        ...finalData, 
                        _type: type, 
                        updatedAt: new Date() 
                    } 
                },
                { upsert: true }
            );
        }

        console.log('✅ Migración completa. Todos los idiomas están en MongoDB con sus traducciones.');
    } catch (error: any) {
        console.error('❌ Error durante la migración:', error.message);
    } finally {
        await client.close();
        process.exit(0);
    }
}

migrate();
