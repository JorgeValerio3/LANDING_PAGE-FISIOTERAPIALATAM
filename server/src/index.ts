import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';

import contactRoutes from './routes/contactRoutes';
import adminRoutes from './routes/adminRoutes';
import dataRoutes from './routes/dataRoutes';
import { pingMongo } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Necesario para que express-rate-limit funcione correctamente en Render (detrás de un proxy)
app.set('trust proxy', 1);

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cookieParser());
const ALLOWED_ORIGINS = new Set([
    process.env.CORS_ORIGIN || 'http://localhost:5173',
    process.env.CORS_ORIGIN_2 || '',
    'http://localhost:5173',
    'https://ufaal-client.onrender.com',
    'https://ufaal.org',
    'https://www.ufaal.org',
].filter(Boolean));

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (ALLOWED_ORIGINS.has(origin)) {
            return callback(null, true);
        }
        callback(new Error(`CORS bloqueado: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Demasiadas peticiones desde esta IP.',
    standardHeaders: true,
    legacyHeaders: false,
});

const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: 'Demasiados intentos de acceso. Intenta en 10 minutos.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', apiLimiter);
app.use('/api/admin/login', loginLimiter);
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// QA: Servir archivos estáticos (Imágenes y Descargas)
const imagesPath = path.join(__dirname, '../../client/public/images');
app.use('/images', express.static(imagesPath));

const uploadsPath = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });
app.use('/uploads', express.static(uploadsPath));

const downloadsPath = path.join(__dirname, '../public/downloads');
if (!fs.existsSync(downloadsPath)) fs.mkdirSync(downloadsPath, { recursive: true });
app.use('/downloads', express.static(downloadsPath));

// Definición de Rutas de la API Dinámica
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/data', dataRoutes);

app.get('/api/health', async (req, res) => {
    try {
        await pingMongo();
        res.status(200).json({ status: 'OK', db: 'connected', message: 'UFAAL API Backend corriendo' });
    } catch (err: any) {
        res.status(503).json({ status: 'DEGRADED', db: 'unreachable', message: err.message || 'MongoDB no disponible' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});
 
