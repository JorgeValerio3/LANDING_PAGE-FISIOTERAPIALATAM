const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs').promises;

// Configuración de Cloudinary (de tu .env)
cloudinary.config({
  cloud_name: 'dldj1ue8b',
  api_key: '863496264421868',
  api_secret: 'vVLMhoYUUJjxeN1XIjAyg5itWD0'
});

async function run() {
    // Apuntamos a la base de datos que usa el servidor
    const dbPath = path.join(__dirname, 'server/data/db.json');
    // Directorio donde están las imágenes locales
    const localImagesDir = path.join(__dirname, 'client/public/images');
    
    console.log('🚀 Iniciando migración de db.json a Cloudinary...');
    
    let db;
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        db = JSON.parse(data);
    } catch (e) {
        console.error('❌ Error leyendo db.json:', e.message);
        return;
    }

    let migrationCount = 0;

    async function processObject(obj) {
        if (typeof obj !== 'object' || obj === null) return obj;
        
        if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                obj[i] = await processObject(obj[i]);
            }
            return obj;
        }
        
        for (let key in obj) {
            let value = obj[key];
            // Buscamos campos que parezcan rutas de imágenes locales
            if (typeof value === 'string' && (value.includes('./images/') || value.includes('/images/')) && !value.includes('cloudinary.com')) {
                const fileName = value.split('/').pop();
                const localPath = path.join(localImagesDir, fileName);
                
                try {
                    await fs.access(localPath);
                    console.log(`📤 Subiendo a Cloudinary: ${fileName}...`);
                    const res = await cloudinary.uploader.upload(localPath, {
                        folder: 'ufaal_production',
                        use_filename: true,
                        unique_filename: false
                    });
                    obj[key] = res.secure_url;
                    migrationCount++;
                    console.log(`✅ URL Cloudinary: ${res.secure_url}`);
                } catch (e) {
                    console.warn(`⚠️ No se pudo acceder a la imagen local: ${localPath}`);
                }
            } else if (typeof value === 'object') {
                obj[key] = await processObject(value);
            }
        }
        return obj;
    }

    await processObject(db);

    if (migrationCount > 0) {
        await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
        console.log(`\n🎉 ¡Hecho! Se han migrado ${migrationCount} imágenes y se ha actualizado server/data/db.json.`);
    } else {
        console.log('\n✨ No se encontraron imágenes locales para migrar o ya son de Cloudinary.');
    }
}

run();
