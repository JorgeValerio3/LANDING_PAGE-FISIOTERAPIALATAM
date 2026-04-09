import { SERVER_URL } from '../api';

/**
 * QA: Resolución de Imágenes Dinámicas
 * Asegura que las imágenes subidas al backend (en /uploads/) sean accesibles
 * desde el frontend, independientemente del dominio de despliegue.
 */
export const getUploadUrl = (path: string) => {
    if (!path) return '';
    
    // Si ya es una URL completa (ej: banderas externas), devolver tal cual
    if (path.startsWith('http')) return path;
    
    // QA: Normalización de ruta para producción
    // El backend sirve las imágenes desde la raíz /uploads
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    return `${SERVER_URL}${cleanPath}`;
};

/**
 * @deprecated Use useData() hook from DataContext instead of getContent()
 */
export const getContent = () => {
    console.warn('QA Warning: getContent() is deprecated. Data flow should come from DataProvider.');
    return {};
};
