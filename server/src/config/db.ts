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

// Lee db.json como fallback de último recurso
function readJsonFallback(): any {
    try {
        const jsonPath = path.join(__dirname, '../../data/db.json');
        if (fs.existsSync(jsonPath)) {
            return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        }
    } catch (e) {
        console.error('❌ No se pudo leer db.json');
    }
    return {
        navbar: { items: [] },
        hero: { titulo_principal: 'UFAAL', subtitulo: '', descripcion: '', estadisticas: [], video_id: '', cta_primario: '', cta_secundario: '' },
        quienes_somos: { titulo: '', descripcion: '', mision: '', vision: '', imagen_destacada: '', valores: { titulo: '', items: [] }, filosofia: { titulo: '', contenido: '' } },
        historia: { titulo: '', subtitulo: '', descripcion: [], imagen: '' },
        organizacion: { titulo: '', descripcion: '', estatutos_pdf: '', secciones: [] },
        paises: { titulo: '', descripcion: '', paises_lista: [] },
        actividades: { titulo: '', descripcion: '', items: [] },
        formacion: { titulo: '', descripcion: '', ejes: [] },
        investigacion: { titulo: '', descripcion: '', articulos: [], estatutos_pdf: '' },
        galeria: { titulo: '', descripcion: '', imagenes: [] },
        noticias: { titulo: '', descripcion: '', articulos: [] },
        afiliacion: { titulo: '', descripcion: '', beneficios: [], mensaje_expansion: '', email_contacto: '' },
        contacto: { titulo: '', descripcion: '', email: '', telefono: '', redes_sociales: { facebook: '', instagram: '', linkedin: '' } },
        colaboradores: { titulo: '', logos: [] },
        footer: { descripcion: '', enlaces_rapidos: [], recursos: [], copyright_text: '' },
    };
}

async function connectToDatabase(): Promise<Db> {
    if (cachedDb) return cachedDb;
    if (!uri) throw new Error('MONGODB_URI no definida');
    try {
        if (!client) {
            const newClient = new MongoClient(uri, {
                serverSelectionTimeoutMS: 5000,
                connectTimeoutMS: 5000,
            });
            await newClient.connect();
            client = newClient;
        }
        const dbName = uri.split('/').pop()?.split('?')[0] || 'ufaal_db';
        cachedDb = client.db(dbName);
        return cachedDb;
    } catch (error: any) {
        console.error('❌ Error de conexión a MongoDB:', error.message);
        client = null;
        throw error;
    }
}

export const readData = async (lang: string = 'es'): Promise<any> => {
    try {
        const db = await connectToDatabase();
        const collection: Collection = db.collection(collectionName);
        const type = `global_config_${lang}`;

        let data = await collection.findOne({ _type: type });

        // Fallback: doc legacy sin sufijo de idioma → migrar automáticamente a _es
        if (!data) {
            const legacy = await collection.findOne({ _type: 'global_config' });
            if (legacy) {
                console.warn(`⚠️ Doc legacy encontrado. Migrando a '${type}'...`);
                await collection.updateOne(
                    { _type: 'global_config' },
                    { $set: { _type: type, updatedAt: new Date() } }
                );
                data = await collection.findOne({ _type: type });
            }
        }

        if (!data) {
            console.warn(`⚠️ Sin datos en MongoDB para '${lang}'. Usando db.json.`);
            return readJsonFallback();
        }

        const { _id, _type, updatedAt, ...rest } = data as any;
        return rest;
    } catch (error: any) {
        console.error(`❌ Error crítico [readData]:`, error.message);
        console.warn('ℹ️ Fallback a db.json por error de conexión.');
        return readJsonFallback();
    }
};

export const writeData = async (data: any, lang: string = 'es'): Promise<boolean> => {
    try {
        if (!data || typeof data !== 'object') throw new Error('Datos inválidos');
        const db = await connectToDatabase();
        const collection: Collection = db.collection(collectionName);
        const type = `global_config_${lang}`;
        const result = await collection.updateOne(
            { _type: type },
            { $set: { ...data, _type: type, updatedAt: new Date() } },
            { upsert: true }
        );
        return result.acknowledged;
    } catch (error: any) {
        console.error(`❌ Error crítico [writeData]:`, error.message);
        return false;
    }
};
