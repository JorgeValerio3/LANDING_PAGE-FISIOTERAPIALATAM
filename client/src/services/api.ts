import { SERVER_URL } from '../api';

/**
 * QA: Resolución de Imágenes Dinámicas
 * Asegura que las imágenes subidas al backend (en /uploads/) sean accesibles
 * desde el frontend, independientemente del dominio de despliegue.
 */
export const getUploadUrl = (path: string) => {
    if (!path) return '';
    
    // Si ya es una URL completa (ej: Cloudinary o externas), devolver tal cual
    if (path.startsWith('http')) return path;
    
    // QA: Normalización de ruta para imágenes locales (/images/)
    if (path.startsWith('/images/') || path.startsWith('images/')) {
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        // En desarrollo local están en /public/images, en producción deben estar disponibles
        return cleanPath;
    }
    
    // QA: Normalización de ruta para subidas de /uploads/
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${SERVER_URL}${cleanPath}`;
};

/**
 * Detecta si una URL corresponde a un archivo de video
 */
export const isVideo = (url: string) => {
    if (!url) return false;
    // Soporte para extensiones comunes y URLs de Cloudinary con /video/
    return url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) || url.includes('/video/upload/');
};

/**
 * @deprecated Use useData() hook from DataContext instead of getContent()
 */
export const getContent = () => {
    console.warn('QA Warning: getContent() is deprecated. Data flow should come from DataProvider.');
    return {};
};

/**
 * Asegura que una URL externa tenga el protocolo http/https
 */
export const formatExternalUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('#') || url.startsWith('/')) return url;
    return `https://${url}`;
};
