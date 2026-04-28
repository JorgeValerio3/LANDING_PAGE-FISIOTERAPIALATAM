import { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Hero } from './components/sections/Hero';
import { QuienesSomos } from './components/sections/QuienesSomos';
import { Historia } from './components/sections/Historia';
import { Organizacion } from './components/sections/Organizacion';
import { Paises } from './components/sections/Paises';
import { Formacion } from './components/sections/Formacion';
import { Investigacion } from './components/sections/Investigacion';
import { Galeria } from './components/sections/Galeria';
import { Noticias } from './components/sections/Noticias';
import { Actividades } from './components/sections/Actividades';
import { Contacto } from './components/sections/Contacto';

// CMS Admin
import { Login } from './components/admin/Login';
import { Dashboard } from './components/admin/Dashboard';

// Contextos
import { DataProvider, useData } from './contexts/DataContext';
import { I18nProvider, useI18n } from './contexts/I18nContext';
import { GlobalLoader } from './components/ui/GlobalLoader';
import { fetchClient, getAdminToken, clearAdminToken } from './api';

import Privacidad from './pages/Privacidad';
import Terminos from './pages/Terminos';
import FAQ from './pages/FAQ';
import ContactoPage from './pages/ContactoPage';
import SedeVirtual from './pages/SedeVirtual';

function ScrollToHash() {
  const { pathname } = useLocation();

  useEffect(() => {
    const id = pathname.replace('/', '');
    if (id && !['privacidad', 'terminos', 'faq', 'contacto', 'sede-virtual', 'admin'].includes(id)) {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [pathname]);

  return null;
}

/**
 * Gate que decide si mostrar Login o Dashboard basado en la sesión (HTTP-Only Cookie).
 * QA: Implementa "Silent Verification" para persistir la sesión al recargar la página.
 */
function AdminArea() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            // Fast path: token en localStorage (funciona en iOS Safari que bloquea cookies cross-origin)
            if (getAdminToken()) {
                try {
                    await fetchClient('/admin/content');
                    setIsLoggedIn(true);
                } catch {
                    clearAdminToken();
                    setIsLoggedIn(false);
                }
                return;
            }
            // Fallback: cookie HTTP-Only (desktop browsers)
            try {
                await fetchClient('/admin/content');
                setIsLoggedIn(true);
            } catch {
                setIsLoggedIn(false);
            }
        };
        checkAuth();
    }, []);

    if (isLoggedIn === null) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-ufaal-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return isLoggedIn 
        ? <Dashboard /> 
        : <Login onLogin={() => setIsLoggedIn(true)} />;
}

import { ErrorBoundary } from './components/ui/ErrorBoundary';

function LandingPage() {
  const { data: contentData } = useData();
  if (!contentData) return null;

  return (
    <>
      <ScrollToHash />
      <ErrorBoundary name="Hero"><Hero data={contentData.hero} /></ErrorBoundary>
      <ErrorBoundary name="QuienesSomos"><QuienesSomos data={contentData.quienes_somos} /></ErrorBoundary>
      <ErrorBoundary name="Historia"><Historia data={contentData.historia} /></ErrorBoundary>
      <ErrorBoundary name="Organizacion"><Organizacion data={contentData.organizacion} /></ErrorBoundary>
      <ErrorBoundary name="Paises"><Paises data={contentData.paises} /></ErrorBoundary>
      <ErrorBoundary name="Actividades"><Actividades data={contentData.actividades} /></ErrorBoundary>
      <ErrorBoundary name="Formacion"><Formacion data={contentData.formacion} /></ErrorBoundary>
      <ErrorBoundary name="Investigacion"><Investigacion data={contentData.investigacion} /></ErrorBoundary>
      <ErrorBoundary name="Galeria"><Galeria data={contentData.galeria} /></ErrorBoundary>
      <ErrorBoundary name="Noticias"><Noticias data={contentData.noticias} /></ErrorBoundary>
      <ErrorBoundary name="Contacto"><Contacto data={contentData.contacto} /></ErrorBoundary>
    </>
  );
}

function MainContent() {
  const { isLoading } = useI18n();

  return (
    <>
      {isLoading && <GlobalLoader />}
      <Routes>
        {/* El Admin CMS NO usa el Layout público (es una aplicación aparte en realidad) */}
        <Route path="/admin" element={<AdminArea />} />
        
        {/* Rutas Públicas con Layout */}
        <Route path="*" element={
          <Layout>
            <Routes>
              <Route path="/privacidad" element={<Privacidad />} />
              <Route path="/terminos" element={<Terminos />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contacto" element={<ContactoPage />} />
              <Route path="/sede-virtual" element={<SedeVirtual />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <DataProvider>
      <Router>
        <I18nProvider>
          <MainContent />
        </I18nProvider>
      </Router>
    </DataProvider>
  );
}

export default App;
