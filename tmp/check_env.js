const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', 'server', '.env');
if (!fs.existsSync(envPath)) {
    console.log('.env file not found at', envPath);
    process.exit(1);
}

const content = fs.readFileSync(envPath, 'utf8');
const lines = content.split('\n');
const env = {};
lines.forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
});

const user = env.ADMIN_USER;
const pass = env.ADMIN_PASS || '';
console.log('ADMIN_USER set:', !!user);
console.log('ADMIN_USER value (first 3):', user ? user.substring(0, 3) : 'N/A');
console.log('ADMIN_PASS length:', pass.length);
console.log('ADMIN_PASS starts with $2b$:', pass.startsWith('$2b$'));
