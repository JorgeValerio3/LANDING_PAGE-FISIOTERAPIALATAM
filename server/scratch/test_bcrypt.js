const bcrypt = require('bcrypt');
const pass = 'Edgar78';
const notAHash = 'Edgar78';

try {
    bcrypt.compare(pass, notAHash).then(res => {
        console.log('Result:', res);
    }).catch(err => {
        console.log('Caught in promise:', err.message);
    });
} catch (e) {
    console.log('Caught in try/catch:', e.message);
}
