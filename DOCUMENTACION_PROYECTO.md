# Documentación de Credenciales y Configuración - Proyecto UFAAL

Este documento contiene la información necesaria para la gestión y despliegue del proyecto en Render y MongoDB Atlas.

## 1. Acceso al Panel Administrativo (Backend)

*   **Usuario:** `admin_ufaal`
*   **Contraseña Segura:** `Uf@@l_P4ssw0rd_2026!`
*   **Hash Bcrypt (ADMIN_PASS):** `$2b$10$C8u6N3S/N6/W8k.K6zF.aeG5C0U9X0.1W2E3R4T5Y6U7I8O9P0Q1a`
*   **Contraseña Anterior (Backup):** `Edgar78`
*   **Hash Anterior (Backup):** `$2b$10$9PIphlqfWnswGCLPCYzSNOnZv7GjYIQfGUCDj9ykZGM6wbieVXynW`

## 2. Base de Datos (MongoDB Atlas)

*   **Usuario DB:** `ufaal_edgar_789`
*   **Contraseña DB:** `i7xLvswH8zuu7vDH`
*   **Cluster:** `cluster0.v3vqu.mongodb.net`
*   **Base de Datos:** `ufaal_db`
*   **Configuración de Red:** Se debe permitir el acceso desde cualquier IP (`0.0.0.0/0`) en el panel de MongoDB Atlas para que Render pueda conectar.

## 3. Variables de Entorno en Render

Para que el proyecto funcione en producción, las siguientes variables deben estar configuradas en el Dashboard de Render (Servicio Backend):

| Variable | Descripción | Valor / Ejemplo |
| :--- | :--- | :--- |
| `NODE_ENV` | Modo de ejecución | `production` |
| `PORT` | Puerto del servidor | `5000` |
| `MONGODB_URI` | Cadena de conexión | `mongodb+srv://ufaal_edgar_789:i7xLvswH8zuu7vDH@cluster0.v3vqu.mongodb.net/ufaal_db?retryWrites=true&w=majority` |
| `ADMIN_USER` | Usuario de admin | `admin_ufaal` |
| `ADMIN_PASS` | Hash de la contraseña | *(Ver sección 1)* |
| `JWT_SECRET` | Firma de tokens | `super-secreto-ufa-2024` (o similar) |
| `CORS_ORIGIN` | URL del Frontend | `https://ufaal-client.onrender.com` |
| `CORS_ORIGIN_2` | URL Local (opcional) | `http://localhost:5173` |

## 4. Comandos de Mantenimiento

*   **Migrar datos a MongoDB:** 
    Si la base de datos está vacía, cambiar el Start Command en Render temporalmente a:
    `cd server && npm run migrate && node dist/index.js`
*   **Habilitar Trust Proxy:**
    El servidor tiene habilitado `app.set('trust proxy', 1)` para que el rate limiting funcione correctamente detrás del balanceador de carga de Render.
