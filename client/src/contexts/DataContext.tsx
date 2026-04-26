import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { GlobalLoader } from '../components/ui/GlobalLoader';
import { fetchClient } from '../api';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface DataContextType {
    data: any | null;
    isLoading: boolean;
    error: string | null;
    refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);
            try {
                const result = await fetchClient('/data');
                clearTimeout(timeoutId);
                setData(result);
            } catch (err: any) {
                clearTimeout(timeoutId);
                if (err.name === 'AbortError') {
                    throw new Error('El servidor tardó demasiado en responder. El plan gratuito puede estar iniciando. Intenta de nuevo en unos segundos.');
                }
                throw err;
            }
        } catch (err: any) {
            console.error('QA Error [DataContext]:', err);
            setError(err.message || 'Error al conectar con la base de datos central de UFAAL');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    if (isLoading) return <GlobalLoader />;
    
    // QA: Mejora visual del estado crítico de error
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-red-500/10">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse text-4xl font-black">
                        <AlertCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-ufaal-text mb-4 uppercase tracking-tight">Conexión Interrumpida</h2>
                    <p className="text-gray-500 mb-10 font-medium leading-relaxed">{error}</p>
                    <button 
                        onClick={() => refreshData()}
                        className="w-full bg-ufaal-blue text-white font-black py-4 rounded-2xl shadow-lg shadow-ufaal-blue/20 hover:bg-ufaal-blue-dark transition-all transform active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
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
        <DataContext.Provider value={{ data, isLoading, error, refreshData }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData debe usarse dentro de un DataProvider');
    }
    return context;
};
