/**
 * patchActividades.ts
 *
 * Patch quirúrgico — agrega el campo `actividades` a los documentos
 * global_config_XX en MongoDB SOLO si no existe.
 * No modifica ningún otro campo ni sección existente.
 *
 * Uso: npm run patch:actividades (ejecutar desde /server)
 */

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config({ path: path.join(process.cwd(), 'server', '.env') });

const uri = process.env.MONGODB_URI || '';
const collectionName = process.env.MONGODB_COLLECTION || 'app_data';

const DEFAULT_ACTIVIDADES: Record<string, object> = {
    es: {
        titulo: 'Actividades y Eventos',
        descripcion: 'Mantente al tanto de nuestros próximos congresos, talleres y seminarios.',
        items: [],
    },
    en: {
        titulo: 'Activities and Events',
        descripcion: 'Stay up to date with our upcoming congresses, workshops and seminars.',
        items: [],
    },
    fr: {
        titulo: 'Activités et Événements',
        descripcion: 'Restez informé de nos prochains congrès, ateliers et séminaires.',
        items: [],
    },
    pt: {
        titulo: 'Atividades e Eventos',
        descripcion: 'Fique por dentro de nossos próximos congressos, workshops e seminários.',
        items: [],
    },
};

async function patch() {
    console.log('🔧 Patch: actividades → MongoDB');
    console.log('   Estrategia: $set condicional — solo actúa si el campo no existe\n');

    if (!uri) {
        console.error('❌ MONGODB_URI no encontrada en .env');
        process.exit(1);
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('📡 Conexión establecida.');

        const dbName = uri.split('/').pop()?.split('?')[0] || 'ufaal_db';
        const db = client.db(dbName);
        const col = db.collection(collectionName);

        const langs = ['es', 'en', 'fr', 'pt'];

        for (const lang of langs) {
            const type = `global_config_${lang}`;

            // Leer estado actual
            const doc = await col.findOne({ _type: type });

            if (!doc) {
                // Documento no existe — crearlo con solo actividades + _type
                const result = await col.updateOne(
                    { _type: type },
                    {
                        $set: {
                            actividades: DEFAULT_ACTIVIDADES[lang],
                            _type: type,
                            updatedAt: new Date(),
                        },
                    },
                    { upsert: true }
                );
                console.log(`   ✅ [${lang.toUpperCase()}] Documento creado con actividades. (upsert)`);
                continue;
            }

            if (doc.actividades !== undefined && doc.actividades !== null) {
                const itemCount = Array.isArray(doc.actividades?.items) ? doc.actividades.items.length : '?';
                console.log(`   ⏭  [${lang.toUpperCase()}] Ya tiene actividades (${itemCount} items). Sin cambios.`);
                continue;
            }

            // Campo ausente — agregarlo sin tocar nada más
            const result = await col.updateOne(
                { _type: type },
                {
                    $set: {
                        actividades: DEFAULT_ACTIVIDADES[lang],
                        updatedAt: new Date(),
                    },
                }
            );

            if (result.modifiedCount === 1) {
                console.log(`   ✅ [${lang.toUpperCase()}] Campo actividades agregado. Items existentes: ninguno aún.`);
            } else {
                console.warn(`   ⚠️  [${lang.toUpperCase()}] No se modificó ningún documento.`);
            }
        }

        console.log('\n✅ Patch completado. Datos existentes intactos.');
    } catch (err: any) {
        console.error('❌ Error durante el patch:', err.message);
        process.exit(1);
    } finally {
        await client.close();
        process.exit(0);
    }
}

patch();
