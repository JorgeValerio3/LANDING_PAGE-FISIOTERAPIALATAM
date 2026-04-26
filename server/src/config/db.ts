import { MongoClient, Db, Collection } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

// Cargamos el .env desde la carpeta del servidor
dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config({ path: path.join(process.cwd(), 'server', '.env') });

const uri = process.env.MONGODB_URI || '';
const collectionName = process.env.MONGODB_COLLECTION || 'app_data';

let cachedDb: Db | null = null;
let client: MongoClient | null = null;

const DEFAULT_DATA = {
    navbar: { items: [] },
    hero: { titulo_principal: "UFAAL", subtitulo: "", descripcion: "", estadisticas: [], video_id: "", cta_primario: "", cta_secundario: "" },
    quienes_somos: { titulo: "", descripcion: "", mision: "", vision: "", imagen_destacada: "", valores: { items: [] }, filosofia: { titulo: "", contenido: "" } },
    paises: { titulo: "", descripcion: "", paises_lista: [] },
    actividades: { titulo: "", descripcion: "", items: [] },
    noticias: { titulo: "", descripcion: "", articulos: [] },
    formacion: { titulo: "", descripcion: "", niveles: [], ejes: [] },
    investigacion: { titulo: "", descripcion: "", articulos: [] },
    organizacion: { titulo: "", descripcion: "", secciones: [] },
    galeria: { titulo: "", descripcion: "", imagenes: [] },
    afiliacion: { titulo: "", descripcion: "", beneficios: [] },
    contacto: { titulo: "", descripcion: "", email: "", telefono: "", redes_sociales: { facebook: "", instagram: "", linkedin: "" } },
    footer: { descripcion: "", enlaces_rapidos: [], recursos: [], copyright_text: "" }
};

async function connectToDatabase(): Promise<Db> {
    if (cachedDb) return cachedDb;

    if (!uri) {
        console.error('❌ MONGODB_URI no definida en el archivo .env');
        throw new Error('MONGODB_URI no definida');
    }

    try {
        if (!client) {
            const newClient = new MongoClient(uri, {
                serverSelectionTimeoutMS: 5000,
                connectTimeoutMS: 5000
            });
            await newClient.connect();
            client = newClient;
        }
        const dbName = uri.split('/').pop()?.split('?')[0] || 'ufaal_db';
        const db = client.db(dbName);
        cachedDb = db;
        return db;
    } catch (error: any) {
        console.error('❌ Error de conexión a MongoDB:', error.message);
        client = null; // Reset client on failure to allow retry
        throw error;
    }
}

export const readData = async (lang: string = 'es'): Promise<any> => {
    try {
        const db = await connectToDatabase();
        const collection: Collection = db.collection(collectionName);
        const type = `global_config_${lang}`;
        const data = await collection.findOne({ _type: type });
        
        if (!data) {
            console.warn(`⚠️ Sin datos en MongoDB para '${lang}'. Usando estructura base.`);
            return DEFAULT_DATA;
        }

        const { _id, _type, ...rest } = data;
        return rest as any;
    } catch (error: any) {
        console.error(`❌ Error crítico [readData]:`, error.message);
        console.log(`ℹ️ Intentando fallback a DEFAULT_DATA por error de conexión.`);
        // QA: Resiliencia - Si falla la DB, devolvemos estructura base para que el sitio no muera
        return DEFAULT_DATA;
    }
};

export const writeData = async (data: any, lang: string = 'es') => {
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