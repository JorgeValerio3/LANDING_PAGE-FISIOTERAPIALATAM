import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Colaboradores } from '../sections/Colaboradores';
import { useData } from '../../contexts/DataContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // If it's a new path (not just a hash change within the same path)
    if (!window.location.hash || pathname !== '/') {
        window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { data: contentData } = useData();
  
  if (!contentData) return null;

  return (
    <div className="min-h-screen bg-ufaal-gray font-sans selection:bg-ufaal-blue selection:text-white flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow overflow-x-hidden">
        {children}
      </main>
      <Colaboradores data={contentData.colaboradores} />
      <Footer data={contentData.footer} contactData={contentData.contacto} />
    </div>
  );
}
