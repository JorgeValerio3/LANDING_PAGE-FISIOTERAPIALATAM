import { useState, useEffect } from 'react';
import { FadeIn } from '../ui/FadeIn';
import { ArrowRight, Bell, Calendar, X, ChevronRight, LinkIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { useI18n } from '../../contexts/I18nContext';

export function Noticias({ data: _data }: { data?: any }) {
    const { t } = useI18n();
    if (!_data) return null;

    
    const getTypeIcon = (category: string) => {
        const c = String(category).toLowerCase();
        if (c.includes('evento')) return <Calendar className="w-4 h-4" />;
        return <Bell className="w-4 h-4" />;
    };

    const getImageUrl = (url: string) => {
        if (!url) return "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800";
        return url.startsWith('http') || url.startsWith('/') ? url : `/${url}`;
    };

    const news = (_data.articulos || []).map((item: any, index: number) => ({
        id: item.id || index,
        type: item.categoria || t('noticias.categoria_noticia'),
        typeIcon: getTypeIcon(item.categoria),
        title: item.titulo,
        date: item.fecha,
        excerpt: item.extracto,
        image: getImageUrl(item.imagen),
        link: item.url_externa || item.enlace
    }));

    const [selectedNews, setSelectedNews] = useState<any>(null);
    const [showAllNews, setShowAllNews] = useState(false);

    // Bloquear scroll al abrir modales
    useEffect(() => {
        if (selectedNews || showAllNews) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedNews, showAllNews]);

    return (
        <section id="noticias" className="py-24 bg-ufaal-gray/50 relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <FadeIn direction="up">
                            <h2 className="text-3xl md:text-5xl font-bold text-ufaal-blue mb-6 tracking-tight">{t('noticias.titulo')}</h2>
                            <div className="w-24 h-1 bg-ufaal-blue-light rounded-full mb-6"></div>
                            <p className="text-gray-600 font-light text-lg leading-relaxed">
                                {t('noticias.descripcion')}
                            </p>
                        </FadeIn>
                    </div>
                    {news.length > 3 && (
                        <FadeIn delay={0.2} direction="left" className="shrink-0 hidden md:block">
                            <button
                                onClick={() => setShowAllNews(true)}
                                className="text-ufaal-blue font-semibold flex items-center gap-2 hover:text-ufaal-blue-light transition-colors group"
                            >
                                {t('noticias.ver_todas')}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </FadeIn>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.slice(0, 3).map((item: any, index: number) => (
                        <FadeIn key={item.id} delay={0.3 + (index * 0.1)} direction="up" className="h-full">
                            <div
                                onClick={() => setSelectedNews(item)}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group h-full flex flex-col cursor-pointer"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                                    <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-sm text-ufaal-blue font-bold px-3 py-1.5 rounded-md text-xs shadow-sm flex items-center gap-1.5">
                                        {item.typeIcon}
                                        {item.type}
                                    </div>
                                    <div className="absolute inset-0 bg-ufaal-blue/0 group-hover:bg-ufaal-blue/20 transition-colors duration-300 z-10" />
                                </div>

                                <div className="p-8 flex flex-col flex-grow">
                                    <p className="text-sm font-medium text-gray-400 mb-3">{item.date}</p>

                                    <h3 className="text-xl font-bold text-ufaal-text mb-4 leading-snug group-hover:text-ufaal-blue transition-colors title-min-h-small">
                                        {item.title}
                                    </h3>

                                    <p className="text-gray-600 font-light text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                                        {item.excerpt}
                                    </p>

                                    <div className="mt-auto">
                                        <span className="text-ufaal-blue-light text-sm font-semibold flex items-center gap-1.5 group/link">
                                            {t('noticias.leer_mas')}
                                            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>

                {news.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">{t('noticias.sin_noticias')}</p>
                    </div>
                )}

                {/* Botón para pantallas pequeñas */}
                {news.length > 3 && (
                    <div className="mt-12 flex justify-center md:hidden">
                        <button
                            onClick={() => setShowAllNews(true)}
                            className="bg-white border border-gray-200 text-ufaal-blue px-6 py-3 rounded-full shadow-sm font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors group"
                        >
                            {t('noticias.ver_todas')}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}

            </div>

            {/* Modal de Detalle de Noticia */}
            <AnimatePresence>
                {selectedNews && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 md:p-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setSelectedNews(null)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", duration: 0.6, bounce: 0.15 }}
                            className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative z-10"
                        >
                            <button
                                onClick={() => setSelectedNews(null)}
                                className="absolute top-4 right-4 z-30 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 backdrop-blur-md transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="relative h-56 sm:h-72 shrink-0">
                                <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" loading="lazy" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="bg-ufaal-blue text-white font-bold px-3 py-1.5 rounded-md text-xs shadow-sm flex items-center gap-1.5">
                                            {selectedNews.typeIcon}
                                            {selectedNews.type}
                                        </span>
                                        <span className="text-white/90 text-sm font-medium">{selectedNews.date}</span>
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                                        {selectedNews.title}
                                    </h2>
                                </div>
                            </div>

                            <div className="p-6 sm:p-10 overflow-y-auto bg-gray-50/50 flex-1">
                                <div className="max-w-3xl mx-auto">
                                    <p className="text-lg text-gray-700 leading-relaxed mb-8">
                                        {selectedNews.excerpt}
                                    </p>
                                    
                                    {selectedNews.link && (
                                        <a href={selectedNews.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-ufaal-blue text-white px-6 py-3 rounded-full hover:bg-ufaal-blue-light transition-colors font-medium">
                                            <LinkIcon className="w-4 h-4" />
                                            {t('noticias.leer_articulo_externo')}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal de Todas las Noticias (Pantalla Completa) */}
            <AnimatePresence>
                {showAllNews && (
                    <motion.div
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        transition={{ type: "spring", bounce: 0, duration: 0.7 }}
                        className="fixed inset-0 z-[100] bg-ufaal-gray overflow-y-auto w-full h-full"
                    >
                        <div className="bg-white py-6 px-6 sm:px-12 shadow-sm sticky top-0 z-20 flex justify-between items-center border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-ufaal-blue">{t('noticias.archivo_titulo')}</h2>
                            <button
                                onClick={() => setShowAllNews(false)}
                                className="text-gray-500 hover:text-ufaal-blue hover:bg-gray-100 p-2 rounded-full transition-colors flex items-center gap-2"
                            >
                                <span className="font-semibold text-sm hidden sm:block">{t('common.volver')}</span>
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="max-w-5xl mx-auto py-12 px-6">
                            <div className="space-y-8">
                                {news.map((item: any, index: number) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.5 }}
                                        className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 hover:shadow-md transition-shadow cursor-pointer group"
                                        onClick={() => {
                                            setSelectedNews(item);
                                        }}
                                    >
                                        <div className="md:w-1/3 shrink-0 rounded-xl overflow-hidden relative h-48 md:h-auto">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                                            <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-sm text-ufaal-blue font-bold px-2 py-1 rounded-md text-[10px] shadow-sm flex items-center gap-1">
                                                {item.typeIcon}
                                                {item.type}
                                            </div>
                                        </div>

                                        <div className="flex flex-col flex-grow justify-center">
                                            <p className="text-sm font-medium text-gray-400 mb-2">{item.date}</p>
                                            <h3 className="text-2xl font-bold text-ufaal-text mb-4 group-hover:text-ufaal-blue transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed mb-6">
                                                {item.excerpt}
                                            </p>
                                            <div className="mt-auto flex justify-end">
                                                <span className="text-ufaal-blue-light font-semibold flex items-center gap-1.5 group-hover:underline">
                                                    {t('noticias.leer_articulo_completo')}
                                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-16 text-center">
                                <p className="text-gray-400">{t('noticias.fin_archivo')}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    );
}
