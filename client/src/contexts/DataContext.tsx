import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { GlobalLoader } from '../components/ui/GlobalLoader';
import { fetchClient } from '../api';
import { AlertCircle, RefreshCw, Languages } from 'lucide-react';

type Language = 'es' | 'en' | 'fr' | 'pt';

interface DataContextType {
    data: any | null;
    isLoading: boolean;
    isLangSwitching: boolean;
    error: string | null;
    currentLang: Language;
    refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function getStoredLang(): Language {
    const allowed: Language[] = ['es', 'en', 'fr', 'pt'];
    const stored = localStorage.getItem('ufaal_lang') as Language;
    return allowed.includes(stored) ? stored : 'es';
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLangSwitching, setIsLangSwitching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentLang, setCurrentLang] = useState<Language>(getStoredLang);
    const abortRef = useRef<AbortController | null>(null);

    const fetchData = useCallback(async (lang: Language, isSwitch = false) => {
        // Cancelar fetch anterior si existe
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        if (isSwitch) {
            setIsLangSwitching(true);
        } else {
            setIsLoading(true);
            setError(null);
        }

        try {
            const result = await fetchClient(`/data?lang=${lang}`, { signal: controller.signal });
            if (!controller.signal.aborted) {
                setData(result);
                setError(null);
            }
        } catch (err: any) {
            if (!controller.signal.aborted) {
                const msg = err.name === 'AbortError'
                    ? 'El servidor tardó demasiado. Intenta de nuevo.'
                    : (err.message || 'Error al conectar con la base de datos de UFAAL');
                if (!isSwitch) setError(msg);
                else console.error('QA Error [DataContext lang switch]:', msg);
            }
        } finally {
            if (!controller.signal.aborted) {
                setIsLoading(false);
                setIsLangSwitching(false);
            }
        }
    }, []);

    // Carga inicial usando el idioma guardado en localStorage
    useEffect(() => {
        fetchData(currentLang, false);
    }, []); // eslint-disable-line

    // Escucha cambios de idioma disparados por I18nContext
    useEffect(() => {
        const handler = (e: Event) => {
            const lang = (e as CustomEvent<{ lang: Language }>).detail.lang;
            setCurrentLang(lang);
            fetchData(lang, true);
        };
        window.addEventListener('ufaal-lang-change', handler);
        return () => window.removeEventListener('ufaal-lang-change', handler);
    }, [fetchData]);

    const refreshData = useCallback(() => fetchData(currentLang, false), [currentLang, fetchData]);

    if (isLoading) return <GlobalLoader />;

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-red-500/10">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <AlertCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-ufaal-text mb-4 uppercase tracking-tight">Conexión Interrumpida</h2>
                    <p className="text-gray-500 mb-10 font-medium leading-relaxed">{error}</p>
                    <button
                        onClick={() => refreshData()}
                        className="w-full bg-ufaal-blue text-white font-black py-4 rounded-2xl shadow-lg shadow-ufaal-blue/20 hover:bg-ufaal-blue-dark transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                    >
                        <RefreshCw className="w-5 h-5" /> Reintentar Conexión
                    </button>
                    <p className="mt-6 text-xs text-ufaal-text opacity-30 font-bold uppercase tracking-tighter">
                        Status: API_UNREACHABLE_FATAL
                    </p>
                </div>
            </div>
        );
    }

    return (
        <DataContext.Provider value={{ data, isLoading, isLangSwitching, error, currentLang, refreshData }}>
            {/* Overlay sutil durante cambio de idioma — no bloquea UI */}
            {isLangSwitching && (
                <div className="fixed top-4 right-4 z-[200] bg-white shadow-lg rounded-xl px-4 py-2.5 flex items-center gap-2 border border-gray-100 animate-in fade-in slide-in-from-top-2">
                    <Languages className="w-4 h-4 text-ufaal-blue animate-pulse" />
                    <span className="text-sm font-semibold text-gray-700">Cambiando idioma...</span>
                    <div className="w-4 h-4 border-2 border-ufaal-blue border-t-transparent rounded-full animate-spin" />
                </div>
            )}
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData debe usarse dentro de un DataProvider');
    return context;
};
