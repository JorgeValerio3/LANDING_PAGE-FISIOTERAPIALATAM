import { MongoClient } from 'mongodb';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || '';
const collectionName = process.env.MONGODB_COLLECTION || 'app_data';
const dbPath = path.join(__dirname, '../../data/db.json');

async function performDeepCheck() {
    console.log('🔍 Iniciando comprobación profunda de integridad...');

    if (!uri) {
        console.error('❌ Error: MONGODB_URI no encontrada en .env');
        process.exit(1);
    }

    const client = new MongoClient(uri);

    try {
        // 1. Leer archivo local
        const rawData = await fs.readFile(dbPath, 'utf8');
        const localData = JSON.parse(rawData);
        const localKeys = Object.keys(localData);

        // 2. Conectar a MongoDB
        await client.connect();
        const db = client.db('ufaal_db');
        const collection = db.collection(collectionName);

        // 3. Obtener el documento de la nube
        const cloudDoc = await collection.findOne({ _type: 'global_config' });

        if (!cloudDoc) {
            console.error('❌ No se encontró el documento en la nube.');
            return;
        }

        const cloudDataKeys = Object.keys(cloudDoc).filter(k => !k.startsWith('_') && k !== 'updatedAt');

        console.log('\n--- Comparación de Secciones Principales ---');
        console.log(`Local  (${localKeys.length} secciones):`, localKeys.join(', '));
        console.log(`Nube   (${cloudDataKeys.length} secciones):`, cloudDataKeys.join(', '));

        const missingKeys = localKeys.filter(k => !cloudDataKeys.includes(k));
        if (missingKeys.length === 0) {
            console.log('✅ Todas las secciones principales están presentes en el documento de MongoDB.');
        } else {
            console.log('⚠️ Faltan las siguientes secciones:', missingKeys);
        }

        // 4. Validación profunda de secciones complejas (Ej: paises)
        console.log('\n--- Análisis de Integridad de Datos (Sección Paises) ---');
        const localPaisesCount = localData.paises.paises_lista.length;
        const cloudPaisesCount = cloudDoc.paises.paises_lista.length;

        console.log(`Local: ${localPaisesCount} países.`);
        console.log(`Nube:  ${cloudPaisesCount} países.`);

        if (localPaisesCount === cloudPaisesCount) {
             console.log('✅ El número de países coincide exactamente.');
        } else {
             console.log('❌ Discrepancia en el número de países.');
        }

        // 5. Muestra de contenido
        console.log('\n--- Cabecera de Datos en la Nube (Prueba) ---');
        console.log('Hero Title:', cloudDoc.hero.titulo_principal);
        console.log('First Nav Item:', cloudDoc.navbar.items[0]?.label);

    } catch (error: any) {
        console.error('❌ Error durante la comprobación:', error.message);
    } finally {
        await client.close();
    }
}

performDeepCheck();
