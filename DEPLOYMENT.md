# Guía de Despliegue: Plataforma UFAAL 🚀

Esta guía detalla los pasos y variables necesarias para desplegar la plataforma tras la refactorización de seguridad y QA 'Production-Ready'.

## 1. Configuración del Servidor (Backend)

La carpeta `/server` usa Express y persistencia en JSON.

### Variables de Entorno (.env)
Crea un archivo `.env` en `/server` con:

| Variable | Descripción | Valor Ejemplo |
| :--- | :--- | :--- |
| `PORT` | Puerto de escucha | `5000` |
| `ADMIN_PASS` | Hash Bcrypt para el admin | `$2b$10$YourGeneratedHash...` |
| `JWT_SECRET` | Llave secreta para tokens | `Cadena_Larga_Y_Segura` |
| `NODE_ENV` | Entorno de ejecución | `production` |
| `SMTP_HOST` | Servidor de correo | `smtp.gmail.com` |
| `SMTP_USER` | Email de envío | `ufaal2020@gmail.com` |
| `SMTP_PASS` | App Password de Gmail | `xxxx xxxx xxxx xxxx` |

> [!IMPORTANT]
> **Generación de HASH**: El `ADMIN_PASS` ya no es texto plano. Debes generar un hash con Bcrypt (Rondas: 10) para tu contraseña administrativa antes de colocarla en el `.env`.

---

## 2. Configuración del Cliente (Frontend)

La carpeta `/client` usa Vite y React.

### Variables de Entorno (.env.production)
Crea un archivo `.env.production` (o configura en tu hosting) en `/client`:

| Variable | Descripción | Valor Ejemplo |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL base de tu API | `https://api.tudominio.com/api` |

> [!TIP]
> **Resolución de Recursos**: Asegúrate de que `VITE_API_URL` termine en `/api`. El sistema extraerá automáticamente la raíz para cargar imágenes desde `/uploads`.

---

## 3. Comandos de Despliegue

### Local / Servidor VPS
```bash
# Servidor
cd server
npm install
npm run build && npm start

# Cliente
cd client
npm install
npm run build
# Luego sirve /dist con Nginx o Apache
```

### Notas de Seguridad Aplicadas:
1. **Cookies**: El backend ahora configura `HttpOnly: true` y `Secure: true`. La conexión debe usar **HTTPS** en producción para que el login funcione.
2. **CORS**: El servidor solo aceptará peticiones desde el dominio configurado.
3. **Payload**: El servidor acepta hasta 5MB para subidas multimedia dinámicas.

123