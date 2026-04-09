import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import nodemailer from 'nodemailer';

// QA: Singleton para evitar recrear el transporte en cada petición
let transporterInstance: nodemailer.Transporter | null = null;

const getTransporter = async () => {
    if (transporterInstance) return transporterInstance;

    const isProd = process.env.NODE_ENV === 'production';
    
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        transporterInstance = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            connectionTimeout: 10000, // QA: Añadir timeout de 10s
        });
    } else if (!isProd) {
        // Solo permitir cuentas de prueba en desarrollo
        const testAccount = await nodemailer.createTestAccount();
        transporterInstance = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
        console.warn('QA Warning: Usando Ethereal Test Account (Desarrollo)');
    } else {
        throw new Error('Configuración SMTP faltante en entorno de producción');
    }

    return transporterInstance;
};

export const sendContactEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ error: 'Errores en la validación de los datos.', details: errors.array() });
            return;
        }

        const { nombre, email, asunto, mensaje } = req.body;
        
        // QA: Sanitización adicional para el HTML (aunque express-validator ya escapa)
        const safeNombre = String(nombre).replace(/[<>]/g, '');
        const safeEmail = String(email).replace(/[<>]/g, '');

        const transporter = await getTransporter();

        await transporter.sendMail({
            from: `"${safeNombre}" <${safeEmail}>`,
            to: process.env.CONTACT_EMAIL || "contacto@ufaal.org",
            subject: `UFAAL Web - ${asunto || 'Sin asunto'}`,
            text: `De: ${safeNombre} (${safeEmail})\n\nMensaje:\n${mensaje}`,
            html: `<h3>Mensaje desde Formulario de Contacto</h3>
                   <p><strong>De:</strong> ${safeNombre} (${safeEmail})</p>
                   <p><strong>Asunto:</strong> ${asunto || 'No especificado'}</p>
                   <hr />
                   <p><strong>Mensaje:</strong></p>
                   <p style="white-space: pre-wrap;">${mensaje}</p>`,
        });

        res.status(200).json({ success: true, message: 'Mensaje enviado correctamente.' });
    } catch (error: any) {
        console.error('QA Error [sendContactEmail]:', error.message || error);
        
        const isSmtpError = error.code === 'ECONNREFUSED' || error.command === 'CONN';
        res.status(500).json({ 
            error: 'Hubo un problema temporal con el servidor de correo.',
            details: isSmtpError ? 'Servidor SMTP no disponible' : 'Fallo interno en el envío'
        });
    }
};
