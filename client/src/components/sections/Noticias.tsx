import { useState, useEffect } from 'react';
import { FadeIn } from '../ui/FadeIn';
import { ArrowRight, Bell, Calendar, X, ChevronRight, LinkIcon, User, FileText, Download, Paperclip, BookOpen } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useI18n } from '../../contexts/I18nContext';
import { NoticiasData, Articulo, ArchivoAdjunto } from '../../types';
import { getUploadUrl } from '../../services/api';

export interface NewsItem {
    id: string | number;
    type: string;
    typeIcon: React.ReactNode;
    title: string;
    date?: string;
    autor?: string;
    excerpt?: string;
    contenido?: string;
    image: string;
    link?: string;
    archivos_adjuntos?: ArchivoAdjunto[];
}

export function Noticias({ data: _data }: { data?: NoticiasData }) {
    const { t } = useI18n();

    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
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

    if (!_data) return null;

    
    const getTypeIcon = (category: string) => {
        const c = String(category).toLowerCase();
        if (c.includes('evento')) return <Calendar className="w-4 h-4" />;
        return <Bell className="w-4 h-4" />;
    };

    const news = (_data.articulos || []).map((item: Articulo, index: number) => ({
        id: item.id || index,
        type: item.categoria || t('noticias.categoria_noticia'),
        typeIcon: getTypeIcon(item.categoria || ''),
        title: item.titulo,
        date: item.fecha,
        autor: item.autor || item.autores,
        excerpt: item.extracto,
        contenido: item.contenido,
        image: getUploadUrl(item.imagen || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800"),
        link: item.url_externa || item.enlace,
        archivos_adjuntos: item.archivos_adjuntos || [],
    }));

    return (
        <section id="noticias" className="py-24 bg-ufaal-gray/50 relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl text-center md:text-left mx-auto md:mx-0">
                        <FadeIn direction="up">
                            <h2 className="text-3xl md:text-5xl font-bold text-ufaal-blue mb-6 tracking-tight">{t('noticias.titulo')}</h2>
                            <div className="w-24 h-1 bg-ufaal-blue-light rounded-full mb-6 mx-auto md:mx-0"></div>
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
                    {news.slice(0, 3).map((item: typeof news[0], index: number) => (
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
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 md:p-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => setSelectedNews(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96, y: 20 }}
                            transition={{ type: "spring", duration: 0.55, bounce: 0.12 }}
                            className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col relative z-10"
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setSelectedNews(null)}
                                className="absolute top-4 right-4 z-30 bg-black/25 hover:bg-black/50 text-white rounded-full p-2.5 backdrop-blur-md transition-colors"
                                aria-label="Cerrar"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Hero image */}
                            <div className="relative h-48 sm:h-64 md:h-80 shrink-0">
                                <img
                                    src={selectedNews.image}
                                    alt={selectedNews.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5 sm:p-8 md:p-10">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <span className="bg-ufaal-blue text-white font-bold px-2.5 py-1 rounded-lg text-[10px] sm:text-xs shadow flex items-center gap-1.5 whitespace-nowrap">
                                            {selectedNews.typeIcon}
                                            {selectedNews.type}
                                        </span>
                                        {selectedNews.date && (
                                            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white/90 text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-lg whitespace-nowrap">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {selectedNews.date}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-lg sm:text-xl md:text-3xl font-bold text-white leading-tight line-clamp-3">
                                        {selectedNews.title}
                                    </h2>
                                </div>
                            </div>

                            {/* Body — scrollable */}
                            <div className="overflow-y-auto flex-1 bg-white overscroll-contain">
                                <div className="max-w-3xl mx-auto px-5 sm:px-8 md:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8">

                                    {/* Meta row: autor */}
                                    {selectedNews.autor && (
                                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 border-b border-gray-100 pb-5">
                                            <User className="w-4 h-4 text-ufaal-blue-light shrink-0" />
                                            <span className="font-medium text-ufaal-text">{selectedNews.autor}</span>
                                        </div>
                                    )}

                                    {/* Extracto */}
                                    {selectedNews.excerpt && (
                                        <div className="bg-ufaal-gray rounded-xl p-4 sm:p-5 border-l-4 border-ufaal-blue-light">
                                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium italic">
                                                {selectedNews.excerpt}
                                            </p>
                                        </div>
                                    )}

                                    {/* Contenido completo */}
                                    {selectedNews.contenido && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <BookOpen className="w-4 h-4 text-ufaal-blue-light" />
                                                <h3 className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest">Contenido</h3>
                                            </div>
                                            <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed text-[14px] sm:text-[15px] whitespace-pre-line">
                                                {selectedNews.contenido}
                                            </div>
                                        </div>
                                    )}

                                    {/* Archivos adjuntos */}
                                    {selectedNews.archivos_adjuntos && selectedNews.archivos_adjuntos.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <Paperclip className="w-4 h-4 text-ufaal-blue-light" />
                                                <h3 className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest">
                                                    Archivos Adjuntos
                                                    <span className="ml-2 bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                                        {selectedNews.archivos_adjuntos.length}
                                                    </span>
                                                </h3>
                                            </div>
                                            <div className="space-y-2.5">
                                                {selectedNews.archivos_adjuntos.map((adj, i) => {
                                                    const ext = adj.url?.split('.').pop()?.toLowerCase() ?? '';
                                                    const isPdf = ext === 'pdf';
                                                    const isDoc = ext === 'doc' || ext === 'docx';
                                                    const fileUrl = getUploadUrl(adj.url);
                                                    return (
                                                        <a
                                                            key={adj.id ?? i}
                                                            href={fileUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            download
                                                            className="flex items-center gap-4 p-3 sm:p-4 bg-gray-50 hover:bg-ufaal-gray border border-gray-100 hover:border-ufaal-blue-light/30 rounded-xl transition-all group"
                                                        >
                                                            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                                                isPdf  ? 'bg-red-50 text-red-500' :
                                                                isDoc  ? 'bg-blue-50 text-blue-500' :
                                                                         'bg-gray-100 text-gray-500'
                                                            }`}>
                                                                <FileText className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-semibold text-ufaal-text truncate group-hover:text-ufaal-blue transition-colors">
                                                                    {adj.nombre || `Archivo ${i + 1}`}
                                                                </p>
                                                                <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider mt-0.5">
                                                                    {ext || 'archivo'}
                                                                </p>
                                                            </div>
                                                            <Download className="w-4 h-4 text-gray-400 group-hover:text-ufaal-blue shrink-0 transition-colors" />
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Enlace externo */}
                                    {selectedNews.link && (
                                        <div className="pt-2">
                                            <a
                                                href={selectedNews.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 bg-ufaal-blue text-white px-6 py-3 rounded-xl hover:bg-ufaal-blue-light transition-colors font-semibold text-sm shadow-lg shadow-ufaal-blue/20"
                                            >
                                                <LinkIcon className="w-4 h-4" />
                                                {t('noticias.leer_articulo_externo')}
                                            </a>
                                        </div>
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
                        <div className="bg-white py-4 sm:py-6 px-4 sm:px-12 shadow-sm sticky top-0 z-20 flex justify-between items-center border-b border-gray-100">
                            <h2 className="text-xl sm:text-2xl font-bold text-ufaal-blue">{t('noticias.archivo_titulo')}</h2>
                            <button
                                onClick={() => setShowAllNews(false)}
                                className="text-gray-500 hover:text-ufaal-blue hover:bg-gray-100 p-2 rounded-full transition-colors flex items-center gap-2"
                            >
                                <span className="font-semibold text-sm hidden sm:block">{t('common.volver')}</span>
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
                            <div className="space-y-6 sm:space-y-8">
                                {news.map((item: typeof news[0], index: number) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.5 }}
                                        className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 sm:gap-8 hover:shadow-md transition-shadow cursor-pointer group"
                                        onClick={() => {
                                            setSelectedNews(item);
                                        }}
                                    >
                                        <div className="md:w-1/3 shrink-0 rounded-xl overflow-hidden relative h-40 sm:h-48 md:h-auto">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                                            <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-sm text-ufaal-blue font-bold px-2 py-1 rounded-md text-[10px] shadow-sm flex items-center gap-1">
                                                {item.typeIcon}
                                                {item.type}
                                            </div>
                                        </div>

                                        <div className="flex flex-col flex-grow justify-center">
                                            <p className="text-xs sm:text-sm font-medium text-gray-400 mb-2">{item.date}</p>
                                            <h3 className="text-xl sm:text-2xl font-bold text-ufaal-text mb-3 group-hover:text-ufaal-blue transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 line-clamp-3 md:line-clamp-none">
                                                {item.excerpt}
                                            </p>
                                            <div className="mt-auto flex justify-end">
                                                <span className="text-ufaal-blue-light font-semibold flex items-center gap-1.5 group-hover:underline text-sm">
                                                    {t('noticias.leer_articulo_completo')}
                                                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-16 text-center">
                                <p className="text-gray-400 text-sm">{t('noticias.fin_archivo')}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    );
}
