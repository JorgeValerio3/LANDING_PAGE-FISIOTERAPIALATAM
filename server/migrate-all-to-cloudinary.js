const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

// Configuración de Cloudinary (de tu .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function processObject(obj, localImagesDir, folder) {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            obj[i] = await processObject(obj[i], localImagesDir, folder);
        }
        return obj;
    }
    
    for (let key in obj) {
        let value = obj[key];
        // Buscamos campos que parezcan rutas de imágenes locales
        if (typeof value === 'string' && (value.includes('/images/') || value.includes('./images/')) && !value.includes('cloudinary.com')) {
            const fileName = value.split('/').pop();
            const localPath = path.join(localImagesDir, fileName);
            
            try {
                await fs.access(localPath);
                console.log(`📤 Subiendo a Cloudinary: ${fileName}...`);
                const res = await cloudinary.uploader.upload(localPath, {
                    folder: folder,
                    use_filename: true,
                    unique_filename: false
                });
                obj[key] = res.secure_url;
                console.log(`✅ URL Cloudinary: ${res.secure_url}`);
            } catch (e) {
                // console.warn(`⚠️ No se pudo acceder a la imagen local: ${localPath}`);
            }
        } else if (typeof value === 'object') {
            obj[key] = await processObject(value, localImagesDir, folder);
        }
    }
    return obj;
}

async function run() {
    const dbPath = path.join(__dirname, 'data/db.json');
    const localesDir = path.join(__dirname, '../client/src/locales');
    const localImagesDir = path.join(__dirname, '../client/public/images');
    const folder = 'ufaal_production';
    
    console.log('🚀 Iniciando migración masiva a Cloudinary...');

    // 1. Migrar db.json
    try {
        console.log('\n--- Migrando server/data/db.json ---');
        const dbData = JSON.parse(await fs.readFile(dbPath, 'utf-8'));
        await processObject(dbData, localImagesDir, folder);
        await fs.writeFile(dbPath, JSON.stringify(dbData, null, 2));
        console.log('✅ server/data/db.json actualizado.');
    } catch (e) {
        console.error('❌ Error en db.json:', e.message);
    }

    // 2. Migrar archivos de idiomas
    const langs = ['es', 'en', 'pt', 'fr'];
    for (const lang of langs) {
        try {
            const langPath = path.join(localesDir, `${lang}.json`);
            console.log(`\n--- Migrando client/src/locales/${lang}.json ---`);
            const langData = JSON.parse(await fs.readFile(langPath, 'utf-8'));
            await processObject(langData, localImagesDir, folder);
            await fs.writeFile(langPath, JSON.stringify(langData, null, 2));
            console.log(`✅ client/src/locales/${lang}.json actualizado.`);
        } catch (e) {
            console.error(`❌ Error en ${lang}.json:`, e.message);
        }
    }

    console.log('\n🎉 ¡Migración finalizada!');
}

run();
