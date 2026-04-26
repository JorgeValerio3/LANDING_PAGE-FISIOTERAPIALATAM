const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs').promises;

// Configuración manual (desde tus datos anteriores)
cloudinary.config({
  cloud_name: 'dldj1ue8b',
  api_key: '863496264421868',
  api_secret: 'vVLMhoYUUJjxeN1XIjAyg5itWD0'
});

async function run() {
    const contentPath = path.join(__dirname, '../client/src/data/content.json');
    const publicImagesDir = path.join(__dirname, '../client/public/images');
    
    console.log('🚀 Iniciando subida de imágenes críticas a Cloudinary...');
    
    let content;
    try {
        content = JSON.parse(await fs.readFile(contentPath, 'utf-8'));
    } catch (e) {
        console.error('❌ Error leyendo content.json:', e.message);
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
            if (typeof value === 'string' && (value.includes('./images/') || value.includes('/images/'))) {
                const fileName = value.split('/').pop();
                const localPath = path.join(publicImagesDir, fileName);
                
                try {
                    await fs.access(localPath);
                    console.log(`📤 Subiendo: ${fileName}...`);
                    const res = await cloudinary.uploader.upload(localPath, {
                        folder: 'ufaal_production_v2',
                        public_id: `img_${Date.now()}_${fileName.split('.')[0]}`
                    });
                    obj[key] = res.secure_url;
                    migrationCount++;
                    console.log(`✅ Éxito: ${res.secure_url}`);
                } catch (e) {
                    // console.warn(`⚠️ Omitiendo ${fileName}: ${e.message}`);
                }
            } else if (typeof value === 'object') {
                obj[key] = await processObject(value);
            }
        }
        return obj;
    }

    await processObject(content);

    if (migrationCount > 0) {
        await fs.writeFile(contentPath, JSON.stringify(content, null, 2));
        console.log(`\n🎉 ¡Hecho! Se han migrado ${migrationCount} imágenes y se ha actualizado content.json.`);
    } else {
        console.log('\n✨ No se encontraron imágenes para migrar.');
    }
}

run();
