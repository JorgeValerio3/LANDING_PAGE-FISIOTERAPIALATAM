const { MongoClient } = require('mongodb');
require('dotenv').config();

async function test() {
    const uri = process.env.MONGODB_URI;
    console.log('Probando conexión a:', uri ? uri.substring(0, 30) + '...' : 'VACÍO');
    
    if (!uri) {
        console.error('❌ MONGODB_URI no encontrada');
        return;
    }

    const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000
    });
    
    try {
        await client.connect();
        console.log('✅ Conexión exitosa a MongoDB');
        const db = client.db('ufaal_db');
        const collection = db.collection(process.env.MONGODB_COLLECTION || 'app_data');
        const count = await collection.countDocuments();
        console.log(`📊 Documentos en la colección: ${count}`);
    } catch (e) {
        console.error('❌ Error de conexión:', e.message);
    } finally {
        await client.close();
    }
}

test();
