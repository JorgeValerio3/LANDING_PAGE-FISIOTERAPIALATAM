import { FadeIn } from '../ui/FadeIn';
import { Activity, MapPin, Users, Calendar } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { getUploadUrl } from '../../services/api';

import { ActividadesData } from '../../types';

export function Actividades({ data }: { data?: ActividadesData }) {
    const { t } = useI18n();

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
                    {data.items.map((item, index) => (
                        <FadeIn key={item.id} delay={index * 0.1} direction="up">
                            <div className="bg-ufaal-gray rounded-3xl overflow-hidden border border-gray-100 group hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                                <div className="relative h-64 overflow-hidden">
                                    <img 
                                        src={getUploadUrl(item.imagen || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800")} 
                                        alt={item.titulo} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                                        <span className="text-ufaal-blue text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                            <Activity className="w-3 h-3" />
                                            {item.categoria}
                                        </span>
                                    </div>
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
                                    
                                    <p className="text-gray-600 font-light text-sm leading-relaxed mb-6 flex-grow">
                                        {item.descripcion}
                                    </p>
                                    
                                    <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-ufaal-blue">
                                            <Users className="w-5 h-5" />
                                            <span className="text-sm font-bold">{item.impacto}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
