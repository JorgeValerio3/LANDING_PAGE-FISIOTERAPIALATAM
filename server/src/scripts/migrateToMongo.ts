import { MongoClient } from 'mongodb';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || '';
const collectionName = process.env.MONGODB_COLLECTION || 'app_data';
const dbPath = path.join(__dirname, '../../data/db.json');

async function migrate() {
    console.log('🚀 Iniciando migración de db.json a MongoDB...');

    if (!uri) {
        console.error('❌ Error: MONGODB_URI no encontrada en .env');
        process.exit(1);
    }

    const client = new MongoClient(uri);

    try {
        // 1. Leer archivo local
        console.log(`📂 Leyendo archivo: ${dbPath}`);
        const rawData = await fs.readFile(dbPath, 'utf8');
        const data = JSON.parse(rawData);

        // 2. Conectar a MongoDB
        console.log('📡 Conectando a MongoDB Atlas...');
        await client.connect();
        const db = client.db('ufaal_db');
        const collection = db.collection(collectionName);

        // 3. Subir datos (Upsert)
        console.log('📤 Subiendo datos a la colección:', collectionName);
        await collection.updateOne(
            { _type: 'global_config' },
            { $set: { ...data, _type: 'global_config', updatedAt: new Date() } },
            { upsert: true }
        );

        console.log('✅ Migración completada con éxito.');
    } catch (error: any) {
        console.error('❌ Error durante la migración:', error.message);
    } finally {
        await client.close();
        process.exit(0);
    }
}

migrate();
