import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Capa B: Pre-calentamiento del backend. Se dispara antes que React monte,
// para que el servidor Render se despierte mientras el usuario lee el Hero.
const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api$/, '')
  : 'http://localhost:5000';

fetch(`${API_BASE}/api/health`, { method: 'GET' }).catch(() => {
  // Silencioso — solo despertar el servidor, no bloquear la UI
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
