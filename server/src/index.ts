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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cookieParser());
app.use(cors({ 
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
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

app.use('/api/', apiLimiter);
app.use(express.json({ limit: '5mb' })); 
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// QA: Servir archivos estáticos (Imágenes y Descargas)
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

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'UFAAL API Backend corriendo' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});
 
