import { useState, useEffect } from 'react';
import { FadeIn } from '../ui/FadeIn';
import { Activity, MapPin, Users, Calendar, X, LinkIcon, Paperclip, FileText, Download, ChevronRight, Play } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useI18n } from '../../contexts/I18nContext';
import { getUploadUrl, isVideo } from '../../services/api';
import { ActividadesData, ActividadItem, ArchivoAdjunto } from '../../types';

const ESTADO_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
    'programada':  { bg: 'bg-blue-50',   text: 'text-blue-700',  dot: 'bg-blue-400' },
    'en curso':    { bg: 'bg-green-50',  text: 'text-green-700', dot: 'bg-green-400' },
    'finalizada':  { bg: 'bg-gray-100',  text: 'text-gray-600',  dot: 'bg-gray-400' },
    'cancelada':   { bg: 'bg-red-50',    text: 'text-red-600',   dot: 'bg-red-400' },
};

export function Actividades({ data }: { data?: ActividadesData }) {
    const { t } = useI18n();
    const [selected, setSelected] = useState<ActividadItem | null>(null);

    useEffect(() => {
        document.body.style.overflow = selected ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [selected]);

    if (!data || !data.items || data.items.length === 0) return null;

    return (
        <section id="actividades" className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="text-center mb-16">
                    <FadeIn direction="up">
                        <h2 className="text-3xl md:text-5xl font-bold text-ufaal-blue mb-6 tracking-tight">
                            {data.titulo || t('actividades.titulo')}
                        </h2>
                        <div className="w-24 h-1 bg-ufaal-blue-light mx-auto rounded-full mb-6"></div>
                        <p className="text-gray-600 font-light max-w-2xl mx-auto text-lg leading-relaxed">
                            {data.descripcion || t('actividades.descripcion')}
                        </p>
                    </FadeIn>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.items.map((item, index) => {
                        const estadoStyle = ESTADO_STYLES[item.estado?.toLowerCase() ?? ''] ?? ESTADO_STYLES['programada'];
                        const mediaUrl = getUploadUrl(item.imagen || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800");
                        
                        return (
                            <FadeIn key={item.id} delay={index * 0.1} direction="up">
                                <div
                                    onClick={() => setSelected(item)}
                                    className="bg-ufaal-gray rounded-3xl overflow-hidden border border-gray-100 group hover:shadow-2xl transition-all duration-500 h-full flex flex-col cursor-pointer"
                                >
                                    <div className="relative h-64 overflow-hidden bg-black">
                                        {isVideo(mediaUrl) ? (
                                            <video 
                                                src={mediaUrl} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                                muted
                                                playsInline
                                                onMouseOver={e => e.currentTarget.play()}
                                                onMouseOut={e => e.currentTarget.pause()}
                                            />
                                        ) : (
                                            <img
                                                src={mediaUrl}
                                                alt={item.titulo}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        )}
                                        
                                        {isVideo(mediaUrl) && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <Play className="w-12 h-12 text-white/50 group-hover:text-white/80 transition-colors" />
                                            </div>
                                        )}

                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                                            <span className="text-ufaal-blue text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                                <Activity className="w-3 h-3" />
                                                {item.categoria}
                                            </span>
                                        </div>
                                        {item.estado && (
                                            <div className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold ${estadoStyle.bg} ${estadoStyle.text} shadow-sm`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${estadoStyle.dot}`} />
                                                {item.estado.charAt(0).toUpperCase() + item.estado.slice(1)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex items-center gap-4 text-gray-400 text-xs font-bold uppercase tracking-tighter mb-4">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {item.fecha}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {item.pais}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-ufaal-text mb-4 group-hover:text-ufaal-blue transition-colors">
                                            {item.titulo}
                                        </h3>

                                        <p className="text-gray-600 font-light text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                                            {item.descripcion}
                                        </p>

                                        <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-ufaal-blue">
                                                <Users className="w-5 h-5" />
                                                <span className="text-sm font-bold">{item.impacto}</span>
                                            </div>
                                            <span className="text-ufaal-blue-light text-xs font-semibold flex items-center gap-1">
                                                Ver más <ChevronRight className="w-3.5 h-3.5" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        );
                    })}
                </div>
            </div>

            {/* Modal de detalle */}
            <AnimatePresence>
                {selected && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 md:p-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => setSelected(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96, y: 20 }}
                            transition={{ type: "spring", duration: 0.55, bounce: 0.12 }}
                            className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col relative z-10 min-w-0"
                        >
                            <button
                                onClick={() => setSelected(null)}
                                className="absolute top-4 right-4 z-30 bg-black/25 hover:bg-black/50 text-white rounded-full p-2.5 backdrop-blur-md transition-colors"
                                aria-label="Cerrar"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="relative h-60 sm:h-80 shrink-0 bg-black">
                                {isVideo(getUploadUrl(selected.imagen || '')) ? (
                                    <video 
                                        src={getUploadUrl(selected.imagen || '')} 
                                        className="w-full h-full object-cover"
                                        controls
                                        autoPlay
                                        playsInline
                                    />
                                ) : (
                                    <img
                                        src={getUploadUrl(selected.imagen || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800")}
                                        alt={selected.titulo}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-10 pointer-events-none">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <span className="bg-ufaal-blue text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow flex items-center gap-1.5">
                                            <Activity className="w-3 h-3" />
                                            {selected.categoria}
                                        </span>
                                        {selected.estado && (() => {
                                            const s = ESTADO_STYLES[selected.estado.toLowerCase()] ?? ESTADO_STYLES['programada'];
                                            return (
                                                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${s.bg} ${s.text}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                                    {selected.estado.charAt(0).toUpperCase() + selected.estado.slice(1)}
                                                </span>
                                            );
                                        })()}
                                    </div>
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-snug">
                                        {selected.titulo}
                                    </h2>
                                </div>
                            </div>

                            <div className="overflow-y-auto flex-1 bg-white min-h-0">
                                <div className="max-w-3xl mx-auto px-6 sm:px-10 py-8 space-y-8 break-words overflow-wrap-anywhere">

                                    <div className="flex flex-wrap gap-4 pb-5 border-b border-gray-100">
                                        {selected.fecha && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 text-ufaal-blue-light shrink-0" />
                                                <span className="font-medium">{selected.fecha}</span>
                                            </div>
                                        )}
                                        {selected.pais && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin className="w-4 h-4 text-ufaal-blue-light shrink-0" />
                                                <span className="font-medium">{selected.pais}</span>
                                            </div>
                                        )}
                                        {selected.impacto && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Users className="w-4 h-4 text-ufaal-blue-light shrink-0" />
                                                <span className="font-medium">{selected.impacto}</span>
                                            </div>
                                        )}
                                    </div>

                                    {selected.descripcion && (
                                        <div className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-line break-words">
                                            {selected.descripcion}
                                        </div>
                                    )}

                                    {selected.archivos_adjuntos && selected.archivos_adjuntos.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <Paperclip className="w-4 h-4 text-ufaal-blue-light" />
                                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                                    Documentos
                                                    <span className="ml-2 bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                                        {selected.archivos_adjuntos.length}
                                                    </span>
                                                </h3>
                                            </div>
                                            <div className="space-y-2.5">
                                                {selected.archivos_adjuntos.map((adj: ArchivoAdjunto, i: number) => {
                                                    const ext = adj.url?.split('.').pop()?.toLowerCase() ?? '';
                                                    const isPdf = ext === 'pdf';
                                                    const isDoc = ext === 'doc' || ext === 'docx';
                                                    return (
                                                        <a
                                                            key={adj.id ?? i}
                                                            href={getUploadUrl(adj.url)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            download
                                                            className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-ufaal-gray border border-gray-100 hover:border-ufaal-blue-light/30 rounded-xl transition-all group"
                                                        >
                                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isPdf ? 'bg-red-50 text-red-500' : isDoc ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-500'}`}>
                                                                <FileText className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-semibold text-ufaal-text truncate group-hover:text-ufaal-blue transition-colors">
                                                                    {adj.nombre || `Documento ${i + 1}`}
                                                                </p>
                                                                <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">{ext || 'archivo'}</p>
                                                            </div>
                                                            <Download className="w-4 h-4 text-gray-400 group-hover:text-ufaal-blue shrink-0 transition-colors" />
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {selected.url_registro && (
                                        <div className="pt-2">
                                            <a
                                                href={selected.url_registro}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 bg-ufaal-blue text-white px-6 py-3 rounded-xl hover:bg-ufaal-blue-light transition-colors font-semibold text-sm shadow-lg shadow-ufaal-blue/20"
                                            >
                                                <LinkIcon className="w-4 h-4" />
                                                Registro / Más Información
                                            </a>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
