import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    admin?: any;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const cookieToken = req.cookies.admin_token;
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const token = cookieToken || bearerToken;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET || 'secret_key_ufaalsuperadmin', (err: any, user: any) => {
            if (err) {
                res.status(403).json({ error: 'Sesión inválida o expirada' });
                return;
            }
            req.admin = user;
            next();
        });
    } else {
        res.status(401).json({ error: 'Acceso denegado. No hay una sesión activa.' });
    }
};
