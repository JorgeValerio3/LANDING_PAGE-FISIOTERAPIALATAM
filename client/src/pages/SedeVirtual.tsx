import { useState, useRef, useEffect } from 'react';
import { FadeIn } from '../components/ui/FadeIn';
import { ExternalLink, RefreshCw, AlertCircle, Monitor, ShieldCheck, Globe } from 'lucide-react';

export default function SedeVirtual() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const targetUrl = "https://ufaal.org/";

    const handleLoad = () => {
        setLoading(false);
        try {
            // Intento de acceso para verificar si el origen es accesible
            // Si el iframe cargó chrome-error://, esto lanzará una excepción inmediatamente
            if (iframeRef.current && iframeRef.current.contentWindow) {
                // Solo probamos el acceso a la propiedad origin para verificar seguridad
                void iframeRef.current.contentWindow.origin;
                setError(false);
            }
        } catch {
            console.error("Error de Same-Origin detectado. El iframe probablemente falló al cargar y redirigió a una página de error local.");
            setError(true);
        }
    };

    const handleRetry = () => {
        setLoading(true);
        setError(false);
        if (iframeRef.current) {
            iframeRef.current.src = targetUrl;
        }
    };

    // Timeout de seguridad si el evento onload no se dispara
    useEffect(() => {
        const timer = setTimeout(() => {
            if (loading) {
                // Si después de 10 segundos sigue cargando, algo anda mal
                // No forzamos el error aquí, pero podríamos si quisiéramos
            }
        }, 10000);
        return () => clearTimeout(timer);
    }, [loading]);

    return (
        <div className="pt-32 pb-24 bg-white min-h-screen relative overflow-hidden">
            {/* Decoración de fondo */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ufaal-blue/5 rounded-full blur-3xl -mt-40 -mr-40 pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <FadeIn direction="up">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-2 text-ufaal-blue font-bold text-sm uppercase tracking-widest mb-4">
                                <Monitor className="w-4 h-4" /> Ecosistema Digital
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-ufaal-text tracking-tight">
                                Sede <span className="text-ufaal-blue">Virtual</span>
                            </h1>
                            <div className="w-24 h-1 bg-ufaal-blue-light rounded-full mt-4"></div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={handleRetry}
                                className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-ufaal-blue transition-colors bg-gray-50 px-4 py-2 rounded-xl border border-gray-100"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Recargar
                            </button>
                            <a 
                                href={targetUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm font-bold bg-ufaal-blue text-white px-6 py-2.5 rounded-xl hover:bg-ufaal-blue-light transition-all shadow-md active:scale-95"
                            >
                                <ExternalLink className="w-4 h-4" /> Abrir en Nueva Ventana
                            </a>
                        </div>
                    </div>
                </FadeIn>

                <div className="relative w-full aspect-[16/10] md:aspect-[16/9] lg:aspect-[21/9] bg-gray-50 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
                    {/* Mensaje de Error / Fallback */}
                    {error && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center p-8 text-center bg-white/90 backdrop-blur-md">
                            <FadeIn direction="up">
                                <div className="max-w-md mx-auto">
                                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
                                        <AlertCircle className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-ufaal-text mb-4">Conexión Limitada</h3>
                                    <p className="text-gray-500 font-light leading-relaxed mb-8">
                                        No hemos podido cargar la Sede Virtual directamente en esta ventana. 
                                        Esto puede deberse a políticas de seguridad del navegador o a que el sitio está en mantenimiento.
                                    </p>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                        <button 
                                            onClick={handleRetry}
                                            className="w-full sm:w-auto px-8 py-3 bg-ufaal-blue text-white font-bold rounded-xl hover:bg-ufaal-blue-light transition-all"
                                        >
                                            Reintentar Carga
                                        </button>
                                        <a 
                                            href={targetUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full sm:w-auto px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                                        >
                                            <ExternalLink className="w-4 h-4" /> Abrir Directamente
                                        </a>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>
                    )}

                    {/* Loader */}
                    {loading && !error && (
                        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white">
                            <div className="relative mb-8">
                                <div className="w-24 h-24 border-4 border-ufaal-blue/10 border-t-ufaal-blue rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Globe className="w-8 h-8 text-ufaal-blue animate-pulse" />
                                </div>
                            </div>
                            <p className="text-ufaal-blue font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Conectando con Servidor UFAAL...</p>
                        </div>
                    )}

                    {/* Iframe Real */}
                    <iframe 
                        ref={iframeRef}
                        src={targetUrl}
                        className={`w-full h-full border-none transition-opacity duration-1000 ${loading || error ? 'opacity-0' : 'opacity-100'}`}
                        onLoad={handleLoad}
                        title="UFAAL Sede Virtual"
                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                    />
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FadeIn delay={0.2} direction="up" className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
                        <div className="w-12 h-12 bg-ufaal-blue/10 text-ufaal-blue rounded-xl flex items-center justify-center mb-6">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-ufaal-text mb-2">Conexión Segura</h4>
                        <p className="text-sm text-gray-500 font-light">
                            Toda la interacción con nuestra sede virtual está protegida por protocolos de encriptación estándar de la industria.
                        </p>
                    </FadeIn>
                    
                    <FadeIn delay={0.4} direction="up" className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
                        <div className="w-12 h-12 bg-ufaal-blue/10 text-ufaal-blue rounded-xl flex items-center justify-center mb-6">
                            <Monitor className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-ufaal-text mb-2">Acceso Remoto</h4>
                        <p className="text-sm text-gray-500 font-light">
                            Diseñado para funcionar perfectamente desde cualquier dispositivo, permitiendo la gestión institucional desde cualquier lugar.
                        </p>
                    </FadeIn>
                    
                    <FadeIn delay={0.6} direction="up" className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
                        <div className="w-12 h-12 bg-ufaal-blue/10 text-ufaal-blue rounded-xl flex items-center justify-center mb-6">
                            <RefreshCw className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-ufaal-text mb-2">Sincronización Real</h4>
                        <p className="text-sm text-gray-500 font-light">
                            Los datos y trámites realizados aquí se reflejan instantáneamente en nuestros sistemas centrales regionales.
                        </p>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}
