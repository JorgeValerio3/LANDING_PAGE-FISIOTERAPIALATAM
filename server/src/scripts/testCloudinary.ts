import cloudinary from '../config/cloudinary';
import path from 'path';
import fs from 'fs/promises';

async function testUpload() {
  console.log('🚀 Probando conexión con Cloudinary...');
  
  try {
    // 1. Verificar configuración
    console.log('--- Configuración Actual ---');
    console.log('Cloud Name:', cloudinary.config().cloud_name);
    console.log('API Key:', cloudinary.config().api_key ? '✅ Presente' : '❌ Falta');
    
    // 2. Intentar una subida de prueba (usando una imagen local si existe, o un buffer remoto)
    console.log('\n📤 Intentando subir imagen de prueba...');
    
    // Usaremos una imagen de ejemplo más estable
    const sampleImageUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
    
    const result = await cloudinary.uploader.upload(sampleImageUrl, {
      folder: 'ufaal_tests',
      public_id: 'test_connection_' + Date.now(),
    });

    console.log('✅ ¡Éxito! Imagen subida correctamente.');
    console.log('URL Segura:', result.secure_url);
    console.log('Public ID:', result.public_id);
    
  } catch (error: any) {
    console.error('❌ Error en la prueba de Cloudinary:', error.message || error);
  }
}

testUpload();
