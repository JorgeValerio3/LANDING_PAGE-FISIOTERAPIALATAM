// QA: Definición Centralizada de URLs del Ecosistema UFAAL
export const SERVER_URL = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') 
    : 'http://localhost:5000';

const BASE_URL = `${SERVER_URL}/api`;

interface RequestOptions extends RequestInit {
    body?: any;
}

export const fetchClient = async (endpoint: string, options: RequestOptions = {}) => {
    // Configurar headers por defecto
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const config: RequestInit = {
        ...options,
        headers,
        credentials: 'include', // Importante para cookies HTTP-Only en ambiente JWT
    };

    if (options.body && typeof options.body === 'object') {
        config.body = JSON.stringify(options.body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // QA: Manejo de errores de autorización centralizado
    if (response.status === 401 || response.status === 403) {
        if (!window.location.hash.includes('/admin')) {
             // Silenciosamente fallar si es público, Dashboard ya maneja su propio estado
        }
    }

    // QA: Parseo Resiliente de JSON (Evita quiebres por errores HTML/Text del servidor)
    let data;
    try {
        data = await response.json();
    } catch (e) {
        console.error('QA Parsing Error [fetchClient]: No se pudo parsear la respuesta del servidor como JSON.', e);
        throw new Error(`El servidor respondió con un formato de datos inesperado (${response.status})`);
    }

    if (!response.ok) {
        const error = data.error || `Error del sistema (${response.status}): ${response.statusText}`;
        throw new Error(error);
    }

    return data;
};
