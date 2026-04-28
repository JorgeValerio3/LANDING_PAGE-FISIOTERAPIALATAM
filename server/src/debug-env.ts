import dotenv from 'dotenv';
import path from 'path';

console.log('CWD:', process.cwd());
dotenv.config({ path: path.join(process.cwd(), '.env') });
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
if (process.env.MONGODB_URI) {
    console.log('MONGODB_URI length:', process.env.MONGODB_URI.length);
    console.log('MONGODB_URI start:', process.env.MONGODB_URI.substring(0, 20));
}
