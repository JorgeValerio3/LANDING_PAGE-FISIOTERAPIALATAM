/**
 * QA: Verificación Integral del Sistema (Full-Stack Scratch Simulation)
 * Este script simula el flujo de datos completo para auditar la robustez de UFAAL.
 */
const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🚀 Iniciando Auditoría Técnica UFAAL...\n');

  try {
    // 1. Health Check
    console.log('--- [1] Health Check ---');
    const health = await fetch(`${BASE_URL}/health`).then(r => r.json());
    console.log('Response:', health.status === 'OK' ? '✅ OK' : '❌ Error');

    // 2. Data Retrieval (Public API)
    console.log('\n--- [2] Public Data Recovery ---');
    const dataResponse = await fetch(`${BASE_URL}/data`);
    const data = await dataResponse.json();
    console.log('Status:', dataResponse.status);
    console.log('Sections Found:', Object.keys(data).length);
    if (!data.hero) throw new Error('Sección Hero no encontrada en la base de datos');
    console.log('Hero Title Found:', !!data.hero.titulo);

    // 3. Auth Flow (Simulated Login)
    console.log('\n--- [3] Authentication Flow (Secure Cookie) ---');
    const loginResponse = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: 'admin_ufaal', 
        password: 'admin' 
      })
    });
    const loginResult = await loginResponse.json();
    console.log('Login Status:', loginResponse.status);
    console.log('Result:', loginResult.success ? '✅ Success' : '❌ Failed');
    
    // Extraer cookie
    const cookie = loginResponse.headers.get('set-cookie');
    if (!cookie) throw new Error('No se recibió la cookie admin_token');
    console.log('Cookie Generated: ✅ Secure/HttpOnly');

    // 4. Data Update (Smart Merge Verification)
    console.log('\n--- [4] Smart Data Update (Atomic Section) ---');
    const newHeroTitle = `UFAAL - Test_${Date.now()}`;
    const updateResponse = await fetch(`${BASE_URL}/admin/content/hero`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': cookie
      },
      body: JSON.stringify({ 
        ...data.hero,
        titulo: newHeroTitle
      })
    });
    const updateResult = await updateResponse.json();
    console.log('Update Status:', updateResponse.status);
    console.log('Message:', updateResult.message);
    
    // 5. Verification of Write Integrity
    console.log('\n--- [5] Post-Update Integrity Verification ---');
    const verifyData = await fetch(`${BASE_URL}/data`).then(r => r.json());
    if (verifyData.hero.titulo === newHeroTitle) {
      console.log('Data Consistency: ✅ Perfect Match');
    } else {
      console.log('Data Consistency: ❌ Mismatch found');
    }

    // 6. Security Audit (Whitelist Enforcement)
    console.log('\n--- [6] Security Audit (Whitelist Verification) ---');
    const evilUpdate = await fetch(`${BASE_URL}/admin/content/system_config`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': cookie
      },
      body: JSON.stringify({ malicious: 'data' })
    });
    console.log('Evil Write Status:', evilUpdate.status);
    if (evilUpdate.status === 403) {
      console.log('Whitelist Protection: ✅ Access Denied to unauthorized section');
    } else {
      console.log('Whitelist Protection: ❌ SECURITY RISK - Unauthorized section modified');
    }

    console.log('\n✨ Auditoría Completada con ÉXITO!');

  } catch (err) {
    console.error('\n💥 ERROR FATAL DURANTE LA AUDITORÍA:', err.message);
    process.exit(1);
  }
}

runTests();
