import { useState, useEffect } from 'react';
import { FadeIn } from '../ui/FadeIn';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { getUploadUrl } from '../../services/api';

export function Galeria({ data }: { data: any }) {
    if (!data) return null;

    const rawImages = data.imagenes || [];
    const images = rawImages.map((img: any) => ({
        src: getUploadUrl(img.url),
        alt: img.alt || img.titulo || "Imagen de galería",
        type: img.tipo || "square"
    }));

    const [selectedImage, setSelectedImage] = useState<any>(null);

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

    return (
        <section id="galeria" className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="text-center mb-16">
                    <FadeIn direction="up">
                        <h2 className="text-3xl md:text-5xl font-bold text-ufaal-blue mb-6 tracking-tight">{data.titulo}</h2>
                        <div className="w-24 h-1 bg-ufaal-blue-light mx-auto rounded-full mb-6"></div>
                    </FadeIn>
                </div>

                {/* Masonry Layout Basico via Tailwind columns */}
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {images.map((img: any, index: number) => (
                        <FadeIn key={img.src + index} delay={0.1 + (index * 0.05)} direction="up" className="break-inside-avoid">
                            <div
                                onClick={() => setSelectedImage(img)}
                                className="group relative overflow-hidden rounded-2xl shadow-sm border border-gray-100 cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-ufaal-blue/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                                    <span className="text-white text-sm font-semibold bg-ufaal-blue px-6 py-2.5 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                                        Ver Imagen
                                    </span>
                                </div>
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    className={`w-full object-cover group-hover:scale-105 transition-transform duration-700 ${img.type === 'tall' ? 'h-96' : img.type === 'wide' ? 'h-64' : 'h-72'
                                        }`}
                                    loading="lazy"
                                />
                            </div>
                        </FadeIn>
                    ))}
                </div>

                {images.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No hay imágenes en la galería actualmente.</p>
                    </div>
                )}

            </div>

            {/* Lightbox / Modal de Imagen a pantalla completa */}
            <AnimatePresence>
                {selectedImage && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setSelectedImage(null)}
                            className="absolute inset-0 bg-black/95 cursor-zoom-out"
                        />

                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[160] bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-md transition-all active:scale-95"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                            className="relative z-10 max-w-7xl max-h-[90vh] w-full flex items-center justify-center pointer-events-none"
                        >
                            <img
                                src={selectedImage.src.replace('&w=800', '').replace('&w=600', '').replace('&w=500', '')} // Remove resize params for full resolution if possible in unsplash
                                alt={selectedImage.alt}
                                className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl pointer-events-auto"
                                loading="lazy"
                            />

                            {/* Opcional: Mostrar el alt text como caption */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-center transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden md:block z-20">
                                <span className="text-white/90 text-sm font-medium tracking-wide drop-shadow-md">
                                    {selectedImage.alt}
                                </span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
