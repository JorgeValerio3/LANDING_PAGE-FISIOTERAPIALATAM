# UFAAL — Unión de Fisioterapia Acuática de América Latina

Plataforma web institucional con CMS integrado para gestión de contenidos, noticias, actividades, galería y más.

**Sitio en producción:** https://ufaal.org

---

## Stack Tecnológico

| Capa | Tecnología | Hosting |
|------|-----------|---------|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS | Vercel (gratis) |
| Backend | Express + TypeScript | Render.com (gratis) |
| Base de datos | MongoDB Atlas | Atlas M0 Free (512MB) |
| Imágenes/Archivos | Cloudinary | Free tier (25GB) |
| Email | Gmail SMTP + Nodemailer | Gratis |
| Keep-alive | Cron-job.org ping cada 14 min | Gratis |

---

## Estructura del Proyecto

```
PROYECTOFISIOTERAPIA/
├── client/                  # Frontend React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/       # Panel CMS (Dashboard, forms, uploads)
│   │   │   ├── sections/    # Secciones públicas del sitio
│   │   │   └── ui/          # Componentes reutilizables
│   │   ├── contexts/        # DataContext, I18nContext
│   │   ├── api/             # fetchClient centralizado
│   │   └── locales/         # Traducciones (es, en, fr, pt)
│   └── vercel.json          # SPA routing para Vercel
├── server/                  # Backend Express
│   ├── src/
│   │   ├── controllers/     # dataController, adminController, uploadController
│   │   ├── routes/          # adminRoutes, dataRoutes, contactRoutes
│   │   ├── middleware/      # authMiddleware (JWT cookie + Bearer)
│   │   └── config/          # db.ts (MongoDB), cloudinary.ts
│   ├── data/db.json         # Fallback local si MongoDB no disponible
│   └── .env.example         # Plantilla de variables de entorno
├── render.yaml              # Config de deploy para Render.com
├── .gitignore               # Excluye .env y SECRETS.md
└── README.md                # Este archivo
```

---

## Módulos del CMS (Panel Admin)

Acceso: `https://ufaal.org/#/admin`

| Módulo | Descripción |
|--------|-------------|
| Hero | Título, subtítulo, video YouTube, estadísticas |
| Quiénes Somos | Misión, visión, valores, filosofía |
| Organización | Estructura con 3 ejes y miembros |
| Países Miembros | 16+ países con representantes e imágenes |
| Actividades | CRUD completo con fotos + archivos adjuntos PDF |
| Formación | Ejes y niveles de capacitación |
| Investigación | Artículos científicos con DOI y PDF |
| Galería | Fotos categorizadas (upload directo a Cloudinary) |
| Noticias | CRUD completo con fotos + archivos adjuntos PDF |
| Afiliación | Beneficios y mensaje de expansión |
| Contacto | Email, teléfono, redes sociales |

---

## API Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/data` | No | Todos los contenidos del sitio |
| POST | `/api/admin/login` | No | Autenticación admin |
| POST | `/api/admin/logout` | No | Cerrar sesión |
| GET | `/api/admin/content` | JWT | Contenido editable |
| PUT | `/api/admin/content/:section` | JWT | Actualizar sección |
| POST | `/api/admin/upload` | JWT | Subir imagen/archivo a Cloudinary |
| POST | `/api/contact` | No | Enviar formulario de contacto |
| GET | `/api/health` | No | Health check (usado por cron keep-alive) |

---

## Deploy — Requisitos

### Variables de entorno necesarias

Ver `SECRETS.md` (archivo local, no está en el repo).

**Render (backend):**
```
PORT, NODE_ENV, MONGODB_URI, MONGODB_COLLECTION,
JWT_SECRET, ADMIN_USER, ADMIN_PASS,
CORS_ORIGIN, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY,
CLOUDINARY_API_SECRET, EMAIL_USER, EMAIL_PASS
```

**Vercel (frontend):**
```
VITE_API_URL=https://ufaal-api.onrender.com/api
```

---

## Deploy — Pasos

### Backend (Render.com)
1. Ir a render.com → New → Web Service
2. Conectar repo GitHub (funciona con repos privados)
3. Root directory: dejar vacío (usa render.yaml automáticamente)
4. Render detecta el `render.yaml` y configura todo
5. En Environment: agregar manualmente las variables secretas de `SECRETS.md`
6. Deploy

### Frontend (Vercel)
1. Ir a vercel.com → New Project
2. Conectar repo GitHub (funciona con repos privados)
3. Root directory: `client`
4. Framework: Vite (autodetectado)
5. En Environment Variables: agregar `VITE_API_URL`
6. Deploy

### Repositorio privado — funciona en Render y Vercel
Sí. Ambos se conectan a GitHub con OAuth y acceden repos privados sin problema.

---

## Keep-Alive (Render free tier)

Render free tier pone el servidor a dormir tras 15 min sin tráfico.
Solución: ping automático cada 14 min desde cron-job.org.

**Setup:**
1. Crear cuenta en https://cron-job.org (gratis)
2. New cronjob → URL: `https://ufaal-api.onrender.com/api/health`
3. Intervalo: cada 14 minutos, Método: GET → Guardar

**Monitoreo:**
1. Crear cuenta en https://uptimerobot.com (gratis)
2. New monitor → URL del health check, Interval: 5 minutos
3. Agrega email para alertas de caídas

---

## Idiomas Soportados

- Español (es) — idioma por defecto
- English (en)
- Français (fr)
- Português (pt)

Archivos: `client/src/locales/{es,en,fr,pt}.json`

---

## Seguridad

- JWT en HTTP-Only cookies (8h expiración)
- Bcrypt (12 rounds) para contraseña admin
- Helmet.js para headers HTTP
- Rate limiting: 100 req / 15 min
- CORS whitelist configurable
- Prototype pollution protection en adminController
- Bearer token + cookie aceptados en authMiddleware
