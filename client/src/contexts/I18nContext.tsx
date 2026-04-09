import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type Language = 'es' | 'en' | 'fr' | 'pt';

interface I18nContextType {
  currentLang: Language;
  t: (key: string) => any;
  changeLanguage: (lang: Language) => void;
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState<Language>('es');
  const [translations, setTranslations] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadTranslations = useCallback(async (lang: Language) => {
    setIsLoading(true);
    try {
      // Intentar cargar el idioma solicitado
      const data = await import(`../locales/${lang}.json`);
      setTranslations(data.default);
      document.documentElement.lang = lang;
    } catch (error) {
      console.error(`QA Warning [I18n]: Error al cargar ${lang}.json. Recurriendo a fallback 'es'.`, error);
      
      // QA Fallback: Si no es español y falló, intentar cargar español
      if (lang !== 'es') {
          try {
              const fallbackData = await import(`../locales/es.json`);
              setTranslations(fallbackData.default);
              document.documentElement.lang = 'es';
              setCurrentLang('es');
          } catch (fallbackError) {
              console.error('QA Fatal [I18n]: No se pudo cargar ni el fallback de español.', fallbackError);
          }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Detección inicial: LocalStorage o Navegador
    const savedLang = localStorage.getItem('ufaal_lang') as Language;
    const browserLang = navigator.language.split('-')[0] as Language;
    const allowedLangs: Language[] = ['es', 'en', 'fr', 'pt'];
    
    const initialLang = savedLang || (allowedLangs.includes(browserLang) ? browserLang : 'es');
    
    if (!savedLang) {
      localStorage.setItem('ufaal_lang', initialLang);
    }
    
    setCurrentLang(initialLang);
    loadTranslations(initialLang);
  }, [loadTranslations]);

  const changeLanguage = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('ufaal_lang', lang);
    loadTranslations(lang);
  };

  /**
   * Traductor de llaves con protección contra objetos nulos y recursividad plana.
   */
  const t = useCallback((key: string): any => {
    if (!key) return "";
    
    const keys = key.split('.');
    let result = translations;
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        // En producción, si no existe, mejor ver la key que nada o un blanco
        return isLoading ? "" : key; 
      }
    }
    
    return isLoading ? "" : (result || key);
  }, [translations, isLoading]);

  return (
    <I18nContext.Provider value={{ currentLang, t, changeLanguage, isLoading }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
