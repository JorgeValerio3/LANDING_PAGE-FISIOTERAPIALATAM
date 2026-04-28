import { MongoClient, Db, Collection } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config({ path: path.join(process.cwd(), 'server', '.env') });

const uri = process.env.MONGODB_URI || '';
const collectionName = process.env.MONGODB_COLLECTION || 'app_data';

let cachedDb: Db | null = null;
let client: MongoClient | null = null;

function resetConnection() {
    cachedDb = null;
    client = null;
}

export type DataSource = 'db_exact' | 'db_fallback_es' | 'file_fallback';

export interface ReadResult {
    data: any;
    source: DataSource;
}

async function connectToDatabase(): Promise<Db> {
    if (cachedDb) return cachedDb;
    if (!uri) throw new Error('MONGODB_URI no definida en el entorno');
    
    try {
        if (!client) {
            client = new MongoClient(uri, {
                serverSelectionTimeoutMS: 5000,
                connectTimeoutMS: 5000,
            });
            await client.connect();
            
            client.on('close', () => {
                console.warn('⚠️ Conexión a MongoDB cerrada.');
                resetConnection();
            });
        }
        const dbName = uri.split('/').pop()?.split('?')[0] || 'ufaal_db';
        cachedDb = client.db(dbName);
        return cachedDb;
    } catch (error: any) {
        console.error('❌ Error de conexión a MongoDB:', error.message);
        resetConnection();
        throw error;
    }
}

// Sanitización de idioma
const ALLOWED_LANGS = new Set(['es', 'en', 'fr', 'pt']);
function sanitizeLang(lang: any): string {
    return ALLOWED_LANGS.has(String(lang)) ? String(lang) : 'es';
}

function readJsonFallback(): any {
    try {
        const possiblePaths = [
            path.join(process.cwd(), 'data', 'db.json'),
            path.join(process.cwd(), 'server', 'data', 'db.json'),
            path.join(__dirname, '../../data/db.json')
        ];
        
        for (const jsonPath of possiblePaths) {
            if (fs.existsSync(jsonPath)) {
                return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            }
        }
    } catch (e) {
        console.error('❌ Error fatal: No se pudo leer db.json');
    }
    return { hero: {}, quienes_somos: {}, paises: { paises_lista: [] } };
}

export const readData = async (langInput: string = 'es'): Promise<ReadResult> => {
    const lang = sanitizeLang(langInput);
    try {
        const db = await connectToDatabase();
        const collection: Collection = db.collection(collectionName);
        const type = `global_config_${lang}`;

        let doc = await collection.findOne({ _type: type });

        if (doc) {
            const { _id, _type, updatedAt, ...rest } = doc as any;
            return { data: rest, source: 'db_exact' };
        }

        if (lang !== 'es') {
            const esDoc = await collection.findOne({ _type: 'global_config_es' });
            if (esDoc) {
                const { _id, _type, updatedAt, ...rest } = esDoc as any;
                return { data: rest, source: 'db_fallback_es' };
            }
        }

        return { data: readJsonFallback(), source: 'file_fallback' };
    } catch (error: any) {
        console.error(`❌ Error en readData (${lang}):`, error.message);
        return { data: readJsonFallback(), source: 'file_fallback' };
    }
};

export const pingMongo = async (): Promise<void> => {
    const db = await connectToDatabase();
    await db.command({ ping: 1 });
};

export const writeData = async (data: any, langInput: string = 'es'): Promise<boolean> => {
    const lang = sanitizeLang(langInput);
    try {
        if (!data || typeof data !== 'object') throw new Error('Datos inválidos');
        const db = await connectToDatabase();
        const collection: Collection = db.collection(collectionName);
        const type = `global_config_${lang}`;
        
        const cleanData = { ...data };
        delete cleanData._id;
        delete cleanData._type;

        const result = await collection.updateOne(
            { _type: type },
            { $set: { ...cleanData, _type: type, updatedAt: new Date() } },
            { upsert: true }
        );
        return result.acknowledged;
    } catch (error: any) {
        console.error(`❌ Error en writeData (${lang}):`, error.message);
        return false;
    }
};
