import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useData } from './DataContext';

type Language = 'es' | 'en' | 'fr' | 'pt';

interface I18nContextType {
  currentLang: Language;
  t: (key: string) => any;
  changeLanguage: (lang: Language) => void;
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

/**
 * Función auxiliar para mezclar objetos de forma profunda
 */
function deepMerge(target: any, source: any) {
  if (!source) return target;
  const output = { ...target };
  Object.keys(source).forEach(key => {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      output[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      output[key] = source[key];
    }
  });
  return output;
}

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState<Language>('es');
  const [baseTranslations, setBaseTranslations] = useState<any>({});
  const [mergedTranslations, setMergedTranslations] = useState<any>({});
  const [isI18nLoading, setIsI18nLoading] = useState(true);
  
  // Consumimos los datos dinámicos de la DB
  const { data: dbData, isLoading: isDataLoading } = useData();

  const loadTranslations = useCallback(async (lang: Language) => {
    setIsI18nLoading(true);
    try {
      // Intentamos cargar el archivo JSON. Vite maneja esto y suele ponerlo en .default
      const data = await import(`../locales/${lang}.json`);
      const translations = data.default || data;
      
      console.log(`[I18n] Cargadas traducciones para ${lang}`, Object.keys(translations).length, "claves");
      setBaseTranslations(translations);
      document.documentElement.lang = lang;
    } catch (error) {
      console.error(`QA Warning [I18n]: Error al cargar ${lang}.json.`, error);
      if (lang !== 'es') {
        const fallbackData = await import(`../locales/es.json`);
        setBaseTranslations(fallbackData.default || fallbackData);
      }
    } finally {
      setIsI18nLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedLang = localStorage.getItem('ufaal_lang') as Language;
    const browserLang = navigator.language.split('-')[0] as Language;
    const allowedLangs: Language[] = ['es', 'en', 'fr', 'pt'];
    const initialLang = savedLang || (allowedLangs.includes(browserLang) ? browserLang : 'es');
    setCurrentLang(initialLang);
    loadTranslations(initialLang);
  }, [loadTranslations]);

  useEffect(() => {
    if (dbData && baseTranslations && Object.keys(baseTranslations).length > 0) {
      // Prioridad: DB > Archivo Local para datos, pero mantenemos estructura
      const merged = deepMerge(baseTranslations, dbData);
      setMergedTranslations(merged);
    } else if (baseTranslations) {
      setMergedTranslations(baseTranslations);
    }
  }, [baseTranslations, dbData]);

  const changeLanguage = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('ufaal_lang', lang);
    loadTranslations(lang);
    window.dispatchEvent(new CustomEvent('ufaal-lang-change', { detail: { lang } }));
  };

  /**
   * t() Blindado: 
   * 1. Busca en Merged (DB + Local).
   * 2. Si es objeto/array o undefined, busca directamente en Local (Backup).
   * 3. Retorna string o Array de strings seguro para React.
   */
  const t = useCallback((key: string): any => {
    if (!key) return '';
    const keys = key.split('.');
    
    // Función interna para navegar objetos de forma segura
    const getValue = (obj: any, pathKeys: string[]) => {
      let current = obj;
      if (!current || typeof current !== 'object') return undefined;
      
      for (const k of pathKeys) {
        if (current && typeof current === 'object' && current !== null && k in current) {
          current = current[k];
        } else {
          return undefined;
        }
      }
      return current;
    };

    // Intento 1: Merged (DB + Local)
    const result = getValue(mergedTranslations, keys);

    // Validación: ¿Es renderizable o es un Array de textos (Historia)?
    const isPrimitive = typeof result === 'string' || typeof result === 'number';
    const isTextArray = Array.isArray(result) && result.length > 0 && result.every(i => typeof i === 'string');
    
    if (isPrimitive || isTextArray) return result;

    // Intento 2: Fallback directo a baseTranslations (Local JSON original)
    // Esto repara las claves técnicas que aparecían por colisiones de arrays
    const baseResult = getValue(baseTranslations, keys);
    
    const isBasePrimitive = typeof baseResult === 'string' || typeof baseResult === 'number';
    const isBaseTextArray = Array.isArray(baseResult) && baseResult.length > 0 && baseResult.every(i => typeof i === 'string');

    if (isBasePrimitive || isBaseTextArray) return baseResult;

    // Si aún así no hay nada, mostramos vacío si está cargando, o undefined como último recurso
    // para que los componentes puedan usar sus propios fallbacks (|| 'Default')
    const loading = isI18nLoading || isDataLoading;
    if (loading) return '';

    return undefined;
  }, [mergedTranslations, baseTranslations, isI18nLoading, isDataLoading]);

  const globalLoading = isI18nLoading || isDataLoading;

  return (
    <I18nContext.Provider value={{ currentLang, t, changeLanguage, isLoading: globalLoading }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an I18nProvider');
  return context;
};
