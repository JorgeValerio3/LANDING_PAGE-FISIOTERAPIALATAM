import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import nodemailer from 'nodemailer';

// QA: Singleton para evitar recrear el transporte en cada petición
let transporterInstance: nodemailer.Transporter | null = null;

const getTransporter = async () => {
    if (transporterInstance) return transporterInstance;

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (emailUser && emailPass) {
        transporterInstance = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: emailUser,
                pass: emailPass,
            },
            connectionTimeout: 10000,
        });
    } else if (process.env.NODE_ENV !== 'production') {
        const testAccount = await nodemailer.createTestAccount();
        transporterInstance = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: { user: testAccount.user, pass: testAccount.pass },
        });
        console.warn('QA Warning: Usando Ethereal Test Account (Desarrollo)');
    } else {
        throw new Error('EMAIL_USER y EMAIL_PASS no configurados en variables de entorno');
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
            to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER || "ufaal2020@gmail.com",
            replyTo: safeEmail,
            subject: `UFAAL WEB: ${asunto || 'Nuevo Mensaje'}`,
            html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                <div style="background-color: #0047AB; padding: 20px; text-align: center;">
                    <h2 style="color: white; margin: 0; font-size: 24px;">Unión de Fisioterapia Acuática de América Latina</h2>
                </div>
                <div style="padding: 30px; background-color: #ffffff;">
                    <p style="color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Nuevo mensaje de contacto</p>
                    <h1 style="color: #0f172a; font-size: 20px; margin-top: 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px;">${asunto || 'Sin Asunto'}</h1>
                    
                    <div style="margin: 20px 0; background-color: #f8fafc; padding: 20px; border-radius: 8px;">
                        <p style="margin: 0; color: #334155; line-height: 1.6;">${mensaje.replace(/\n/g, '<br>')}</p>
                    </div>

                    <div style="margin-top: 30px; border-top: 1px solid #f1f5f9; pt-20px;">
                        <p style="margin: 5px 0; color: #1e293b;"><strong>Remitente:</strong> ${safeNombre}</p>
                        <p style="margin: 5px 0; color: #1e293b;"><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color: #0047AB; text-decoration: none;">${safeEmail}</a></p>
                    </div>
                </div>
                <div style="background-color: #f1f5f9; padding: 15px; text-align: center; color: #94a3b8; font-size: 12px;">
                    Este es un mensaje automático enviado desde la plataforma oficial de UFAAL.
                </div>
            </div>
            `,
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
