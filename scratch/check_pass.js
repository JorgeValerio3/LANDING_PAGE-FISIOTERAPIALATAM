const bcrypt = require('bcrypt');
const hash = '$2b$10$vW9U5O9w.xZkS/6Ym6hI9.Y0iH5kU0/ZzLhW8jKzYV1yM7GvR0O3.';
const pass = 'Edgar78';

bcrypt.compare(pass, hash).then(res => {
    console.log('Match:', res);
}).catch(err => console.error(err));
