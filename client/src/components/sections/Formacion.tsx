import { FadeIn } from '../ui/FadeIn';
import { BookOpen, Laptop, Landmark, Award, Clock, ChevronRight, Play } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { FormacionData } from '../../types';
import { getUploadUrl, isVideo } from '../../services/api';

export function Formacion({ data: _data }: { data?: FormacionData }) {
    const { t } = useI18n();
    if (!_data) return null;

    const getIcon = (iconName: string) => {
        const i = String(iconName).toLowerCase();
        if (i.includes('laptop')) return <Laptop className="w-8 h-8 text-ufaal-blue" />;
        if (i.includes('award')) return <Award className="w-8 h-8 text-ufaal-blue" />;
        if (i.includes('book')) return <BookOpen className="w-8 h-8 text-ufaal-blue" />;
        if (i.includes('landmark')) return <Landmark className="w-8 h-8 text-ufaal-blue" />;
        return <BookOpen className="w-8 h-8 text-ufaal-blue" />;
    };

    const niveles = _data.niveles || [];

    return (
        <section id="formacion" className="py-24 bg-white relative overflow-hidden">
            {/* Elemento de diseño de fondo */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-ufaal-gray z-0 hidden lg:block rounded-bl-[150px]"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="text-left mb-16 max-w-2xl">
                    <FadeIn direction="right">
                        <h2 className="text-3xl md:text-5xl font-bold text-ufaal-blue mb-6 tracking-tight">{t('formacion.titulo')}</h2>
                        <div className="w-24 h-1 bg-ufaal-blue-light rounded-full mb-6"></div>
                        <p className="text-gray-600 font-light text-lg leading-relaxed">
                            {t('formacion.descripcion')}
                        </p>
                    </FadeIn>
                </div>

                {/* Ejes de Formación (Estáticos de Traducción) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {['eje1', 'eje2', 'eje3'].map((key, index) => (
                        <FadeIn key={key} delay={0.2 + (index * 0.1)} direction="up">
                            <div className="flex gap-6 items-start p-8 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md hover:border-ufaal-blue-light/30 transition-all group h-full">
                                <div className="p-4 bg-ufaal-gray rounded-xl group-hover:bg-ufaal-blue/5 transition-colors shrink-0">
                                    {getIcon(key)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-ufaal-text mb-3">{t(`formacion.ejes.${key}.titulo`)}</h3>
                                    <p className="text-gray-600 font-light leading-relaxed">
                                        {t(`formacion.ejes.${key}.descripcion`)}
                                    </p>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>

                {/* Niveles de Formación (Dinámicos de la DB) */}
                {niveles.length > 0 && (
                    <div className="space-y-12">
                        <FadeIn direction="up">
                            <h3 className="text-2xl font-bold text-ufaal-text mb-8 flex items-center gap-3">
                                <Award className="w-6 h-6 text-ufaal-blue-light" />
                                Programas Académicos Disponibles
                            </h3>
                        </FadeIn>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {niveles.map((nivel, idx) => {
                                const mediaUrl = getUploadUrl(nivel.imagen || "https://images.unsplash.com/photo-1576091160550-2173be9997a2?auto=format&fit=crop&q=80&w=800");
                                return (
                                    <FadeIn key={nivel.id || idx} delay={idx * 0.1} direction="up">
                                        <div className="bg-ufaal-gray rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-ufaal-blue-light/10 flex flex-col md:flex-row h-full">
                                            <div className="w-full md:w-1/3 h-48 md:h-auto overflow-hidden bg-black relative">
                                                {isVideo(mediaUrl) ? (
                                                    <div className="w-full h-full">
                                                        <video 
                                                            src={mediaUrl} 
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                                            muted
                                                            playsInline
                                                            onMouseOver={e => e.currentTarget.play()}
                                                            onMouseOut={e => e.currentTarget.pause()}
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                            <Play className="w-10 h-10 text-white/50 group-hover:text-white/80 transition-colors" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <img 
                                                        src={mediaUrl} 
                                                        alt={nivel.titulo} 
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                )}
                                            </div>
                                            <div className="p-8 flex-1 flex flex-col">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="p-2 bg-white rounded-lg text-ufaal-blue shadow-sm">
                                                        {getIcon(nivel.icono)}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-ufaal-blue font-bold text-xs uppercase tracking-tighter">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {nivel.duracion}
                                                    </div>
                                                </div>
                                                
                                                <h4 className="text-xl font-bold text-ufaal-text mb-3">{nivel.titulo}</h4>
                                                <p className="text-gray-500 font-light text-sm leading-relaxed mb-6 flex-grow">
                                                    {nivel.descripcion}
                                                </p>
                                                
                                                <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Requisitos: {nivel.requisitos}</span>
                                                    <button className="text-ufaal-blue p-2 bg-white rounded-full shadow-sm hover:bg-ufaal-blue hover:text-white transition-all">
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </FadeIn>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}


