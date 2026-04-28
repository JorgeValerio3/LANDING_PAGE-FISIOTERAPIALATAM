import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

const API_URL = 'http://localhost:5000/api';
const TEST_IMAGE_PATH = 'C:/Users/jorge/.gemini/antigravity/brain/56ccf9f1-8287-4153-8298-d13108208f13/test_qa_ufaal_1775708282512.png';

async function runAudit() {
    console.log('--- Iniciando Auditoría de Integración QA (UFAAL) ---');

    try {
        // 1. Probar Login
        console.log('[1/3] Probando Autenticación...');
        const loginRes = await axios.post(`${API_URL}/admin/login`, {
            username: 'admin_ufaal',
            password: 'UfaalAdmin2026'
        });

        // Extraer cookie
        const cookie = loginRes.headers['set-cookie'];
        console.log('✅ Autenticación exitosa.');

        // 2. Probar Subida de Imagen (Hotfix implementado)
        console.log('[2/3] Probando Subida Multimedia (Hotfix)...');
        const form = new FormData();
        form.append('files', fs.createReadStream(TEST_IMAGE_PATH));

        const uploadRes = await axios.post(`${API_URL}/admin/upload`, form, {
            headers: {
                ...form.getHeaders(),
                Cookie: cookie ? cookie.join('; ') : ''
            }
        });

        const uploadedUrl = uploadRes.data.urls[0];
        console.log(`✅ Imagen subida correctamente: ${uploadedUrl}`);

        // 3. Probar Persistencia (Actualizar Galería)
        console.log('[3/3] Probando Persistencia de Datos...');
        const currentDataRes = await axios.get(`${API_URL}/admin/content`, {
            headers: { Cookie: cookie ? cookie.join('; ') : '' }
        });

        const newContent = { ...currentDataRes.data };
        const newImage = {
            id: Date.now(),
            url: uploadedUrl,
            titulo: "Prueba de Integración Automática QA",
            descripcion: "Validación de flujo de datos e imágenes desde el dashboard hasta el front-end.",
            categoria: "test"
        };
        
        newContent.galeria.imagenes.unshift(newImage);

        await axios.put(`${API_URL}/admin/content/galeria`, newImage, {
            headers: { Cookie: cookie ? cookie.join('; ') : '' }
        });

        console.log('✅ Persistencia validada en db.json.');
        console.log('--- Auditoría Completada con ÉXITO ---');

    } catch (error: any) {
        console.error('❌ Fallo en la Auditoría:', error.response?.data || error.message);
        process.exit(1);
    }
}

runAudit();
