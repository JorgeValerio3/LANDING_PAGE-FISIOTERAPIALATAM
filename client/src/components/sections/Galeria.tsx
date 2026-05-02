import { useState, useEffect } from 'react';
import { FadeIn } from '../ui/FadeIn';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Tag, Play, Film } from 'lucide-react';
import { getUploadUrl, isVideo } from '../../services/api';
import { useI18n } from '../../contexts/I18nContext';
import { GaleriaData, GaleriaImagen } from '../../types';

export interface MappedGaleriaImagen {
    src: string;
    alt: string;
    type: string;
    titulo?: string;
    descripcion?: string;
    categoria?: string;
}

export function Galeria({ data: _data }: { data?: GaleriaData }) {
    const { t } = useI18n();
    
    const [selectedImage, setSelectedImage] = useState<MappedGaleriaImagen | null>(null);

    // Bloquear scroll al abrir el modal (lightbox)
    useEffect(() => {
        if (selectedImage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedImage]);

    if (!_data) return null;

    const rawImages = _data.imagenes || [];
    const images = rawImages.map((img: GaleriaImagen) => ({
        src: getUploadUrl(img.url),
        alt: img.alt || img.titulo || t('galeria.fallback_alt'),
        type: img.tipo || "square",
        titulo: img.titulo,
        descripcion: img.descripcion,
        categoria: img.categoria,
    }));

    return (
        <section id="galeria" className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="text-center mb-16">
                    <FadeIn direction="up">
                        <h2 className="text-3xl md:text-5xl font-bold text-ufaal-blue mb-6 tracking-tight">{t('galeria.titulo')}</h2>
                        <div className="w-24 h-1 bg-ufaal-blue-light mx-auto rounded-full mb-6"></div>
                    </FadeIn>
                </div>

                {/* Masonry Layout Basico via Tailwind columns */}
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {images.map((img: MappedGaleriaImagen, index: number) => (
                        <FadeIn key={img.src + index} delay={0.1 + (index * 0.05)} direction="up" className="break-inside-avoid">
                            <div
                                onClick={() => setSelectedImage(img)}
                                className="group relative overflow-hidden rounded-2xl shadow-sm border border-gray-100 cursor-pointer bg-black"
                            >
                                <div className="absolute inset-0 bg-ufaal-blue/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                                    <span className="text-white text-sm font-semibold bg-ufaal-blue px-6 py-2.5 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg flex items-center gap-2">
                                        {isVideo(img.src) ? <Play className="w-4 h-4" /> : null}
                                        {isVideo(img.src) ? t('galeria.ver_video') || 'Reproducir Video' : t('galeria.ver_imagen')}
                                    </span>
                                </div>
                                {isVideo(img.src) ? (
                                    <div className="relative">
                                        <video 
                                            src={img.src} 
                                            className={`w-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 ${img.type === 'tall' ? 'h-96' : img.type === 'wide' ? 'h-64' : 'h-72'}`}
                                            muted
                                            playsInline
                                            onMouseOver={e => e.currentTarget.play()}
                                            onMouseOut={e => {
                                                e.currentTarget.pause();
                                                e.currentTarget.currentTime = 0;
                                            }}
                                        />
                                        <div className="absolute top-4 right-4 bg-black/50 p-1.5 rounded-lg z-20">
                                            <Film className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                ) : (
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        className={`w-full object-cover group-hover:scale-105 transition-transform duration-700 ${img.type === 'tall' ? 'h-96' : img.type === 'wide' ? 'h-64' : 'h-72'
                                            }`}
                                        loading="lazy"
                                    />
                                )}
                            </div>
                        </FadeIn>
                    ))}
                </div>

                {images.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">{t('galeria.sin_imagenes')}</p>
                    </div>
                )}

            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => setSelectedImage(null)}
                            className="absolute inset-0 bg-black/95 cursor-zoom-out"
                        />

                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[160] bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-md transition-all active:scale-95"
                            aria-label="Cerrar"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
                            className="relative z-10 flex flex-col items-center max-w-5xl w-full"
                        >
                            {isVideo(selectedImage.src) ? (
                                <video 
                                    src={selectedImage.src.replace('&w=800', '').replace('&w=600', '').replace('&w=500', '')} 
                                    className="max-w-full max-h-[75vh] rounded-xl shadow-2xl"
                                    controls
                                    autoPlay
                                    playsInline
                                />
                            ) : (
                                <img
                                    src={selectedImage.src.replace('&w=800', '').replace('&w=600', '').replace('&w=500', '')}
                                    alt={selectedImage.alt}
                                    className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
                                    loading="lazy"
                                />
                            )}

                            {/* Caption — título, categoría, descripción */}
                            {(selectedImage.titulo || selectedImage.descripcion || selectedImage.categoria) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="mt-5 w-full max-w-2xl text-center px-4"
                                >
                                    {selectedImage.categoria && (
                                        <span className="inline-flex items-center gap-1.5 bg-white/10 text-white/70 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                                            <Tag className="w-3 h-3" />
                                            {selectedImage.categoria}
                                        </span>
                                    )}
                                    {selectedImage.titulo && (
                                        <h3 className="text-white font-bold text-lg leading-snug mb-2">
                                            {selectedImage.titulo}
                                        </h3>
                                    )}
                                    {selectedImage.descripcion && (
                                        <p className="text-white/65 text-sm leading-relaxed">
                                            {selectedImage.descripcion}
                                        </p>
                                    )}
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
