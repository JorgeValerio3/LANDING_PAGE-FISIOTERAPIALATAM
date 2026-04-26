import { useState, useEffect } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import { FadeIn } from '../ui/FadeIn';
import { ArrowDown } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';
import { getUploadUrl } from '../../services/api';
import { HeroData } from '../../types';

export function Hero({ data: _data }: { data?: HeroData }) {
    const { t, isLoading } = useI18n();
    const [scrollPos, setScrollPos] = useState(0);

    useEffect(() => {
        // QA: Optimización de rendimiento. Solo escuchamos scroll en desktop
        if (window.innerWidth < 1024) return;

        const handleScroll = () => requestAnimationFrame(() => setScrollPos(window.scrollY));
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Cálculo dinámico de efectos (solo aplican si hay scroll activo)
    const logoOpacity = Math.max(0, 1 - scrollPos / 250);
    const logoScale = Math.max(0.75, 1 - scrollPos / 600);
    const logoTranslate = scrollPos * 0.25;
    const blurAmount = Math.min(8, scrollPos / 40);

    // Prioridad de datos: CMS > Traducciones > Hardcoded
    const titulo = _data?.titulo_principal || t('hero.titulo');
    const subtitulo = _data?.subtitulo || t('hero.subtitulo');
    const descripcion = _data?.descripcion || t('hero.descripcion');
    const imagenUrl = _data?.imagen ? getUploadUrl(_data.imagen) : './images/home2.jpg';
    const logoUrl = _data?.logo ? getUploadUrl(_data.logo) : './images/logo_sin_fondo.png';

    return (
        <section id="inicio" className="relative min-h-screen flex items-center justify-center bg-ufaal-blue overflow-hidden">
            {/* Background Image Dynamics */}
            <div className="absolute inset-0 z-0">
                <img
                    src={imagenUrl}
                    alt="UFAAL Hero Background"
                    className="w-full h-full object-cover hero-bg-image transition-opacity duration-1000"
                    onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                />
                {/* QA: Gradiente reforzado para legibilidad sobre imágenes dinámicas claras */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-ufaal-blue/20"></div>
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-12 md:mt-48">
                <FadeIn delay={0.1} direction="down">
                    <div 
                        className="flex justify-center mb-10 drop-shadow-[0_25px_25px_rgba(0,0,0,0.5)] transition-transform will-change-transform"
                        style={{ 
                            opacity: logoOpacity,
                            transform: `scale(${logoScale}) translateY(${logoTranslate}px)`,
                            filter: `blur(${blurAmount}px)`
                        }}
                    >
                        <img 
                            src={logoUrl} 
                            alt="Logo UFAAL Principal" 
                            className="h-56 md:h-72 lg:h-80 w-auto object-contain brightness-110"
                        />
                    </div>
                </FadeIn>

                <div className="space-y-6">
                    <FadeIn delay={0.2} direction="up">
                        <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white tracking-tighter mb-6 leading-[0.9] drop-shadow-lg">
                            {isLoading ? (
                                <Skeleton className="h-12 md:h-20 w-3/4 mx-auto bg-white/10 rounded-full" />
                            ) : (
                                titulo
                            )}
                        </h1>
                    </FadeIn>

                    <FadeIn delay={0.4} direction="up">
                        <div className="space-y-5 mb-12">
                            {isLoading ? (
                                <>
                                    <Skeleton className="h-6 w-1/2 mx-auto bg-white/10 rounded-full" />
                                    <Skeleton className="h-4 w-2/3 mx-auto bg-white/10 rounded-full" />
                                </>
                            ) : (
                                <>
                                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed tracking-tight">
                                        {subtitulo}
                                    </p>
                                    <p className="text-base text-gray-300 max-w-2xl mx-auto font-light antialiased">
                                        {descripcion}
                                    </p>
                                </>
                            )}
                        </div>
                    </FadeIn>
                </div>

                <FadeIn delay={0.6} direction="up">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
                        <button
                            onClick={() => document.getElementById('quienes-somos')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-10 py-4 rounded-2xl bg-white text-ufaal-blue font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-2xl hover:shadow-ufaal-blue/40 w-full sm:w-auto active:scale-95"
                        >
                            {t('hero.cta_primario')}
                        </button>
                    </div>
                </FadeIn>
            </div>

            {/* Scroll indicator - Refined accessibility */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 animate-bounce group">
                <button 
                    onClick={() => document.getElementById('quienes-somos')?.scrollIntoView({ behavior: 'smooth' })}
                    title="Desplazarse hacia abajo"
                    className="p-4 bg-white/5 rounded-full backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all opacity-60 hover:opacity-100 ring-2 ring-transparent hover:ring-white/20"
                >
                    <ArrowDown className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
            </div>
        </section>
    );
}
