import { useState } from 'react';
import { FadeIn } from '../ui/FadeIn';
import { Calendar, MapPin, TrendingUp, Award, Users, BookOpen, Presentation, Video, Globe } from 'lucide-react';
import { getUploadUrl } from '../../services/api';

export function Actividades({ data }: { data: any }) {
    if (!data) return null;

    const [activeTab, setActiveTab] = useState("Todos");

    const items = data.items || [];
    
    // Generar categorías únicas a partir de los items dinámicos
    const uniqueCategories = Array.from(new Set(items.map((item: any) => item.categoria).filter(Boolean))) as string[];
    const categoriesList = ["Todos", ...uniqueCategories];

    const filteredActivities = activeTab === "Todos"
        ? items
        : items.filter((item: any) => item.categoria === activeTab);

    const getCategoryIcon = (category: string) => {
        const c = String(category).toLowerCase();
        if (c.includes('congreso')) return <Presentation className="w-5 h-5" />;
        if (c.includes('certifica')) return <Award className="w-5 h-5" />;
        if (c.includes('taller')) return <Users className="w-5 h-5" />;
        if (c.includes('web')) return <Video className="w-5 h-5" />;
        if (c.includes('red') || c.includes('comunidad')) return <Globe className="w-5 h-5" />;
        if (c.includes('ciencia') || c.includes('investiga')) return <BookOpen className="w-5 h-5" />;
        return <Award className="w-5 h-5" />;
    };

    return (
        <section id="actividades" className="py-24 bg-ufaal-gray/50">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-16">
                    <FadeIn direction="up">
                        <h2 className="text-3xl md:text-5xl font-bold text-ufaal-blue mb-6 tracking-tight">{data.titulo}</h2>
                        <div className="w-24 h-1 bg-ufaal-blue-light mx-auto rounded-full mb-6"></div>
                        <p className="text-gray-600 font-light max-w-2xl mx-auto text-lg">
                            {data.descripcion}
                        </p>
                    </FadeIn>
                </div>

                {/* Tabs Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {categoriesList.map((category, index) => (
                        <FadeIn key={category} delay={0.1 + (index * 0.05)} direction="down">
                            <button
                                onClick={() => setActiveTab(category)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${activeTab === category
                                    ? 'bg-ufaal-blue text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-ufaal-blue'
                                    }`}
                            >
                                {category !== "Todos" && getCategoryIcon(category)}
                                {category}
                            </button>
                        </FadeIn>
                    ))}
                </div>

                {/* Activity Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredActivities.map((activity: any, index: number) => (
                        <FadeIn key={activity.id || index} delay={0.2 + (index * 0.1)} direction="up">
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group h-full flex flex-col">
                                <div className="relative h-56 overflow-hidden bg-ufaal-blue">
                                    <div className="absolute inset-0 bg-ufaal-blue/20 group-hover:bg-transparent transition-colors z-10"></div>
                                    <img 
                                        src={activity.imagen ? getUploadUrl(activity.imagen) : `https://images.unsplash.com/photo-1540317580384-e5d43867caa6?auto=format&fit=crop&q=80&w=800&seed=${activity.id || index}`} 
                                        alt={activity.titulo} 
                                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" 
                                        loading="lazy" 
                                    />
                                    {activity.categoria && (
                                        <span className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm text-ufaal-blue font-bold px-4 py-1.5 rounded-full text-xs shadow-sm flex items-center gap-1.5">
                                            {getCategoryIcon(activity.categoria)}
                                            {activity.categoria}
                                        </span>
                                    )}
                                </div>

                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex items-center justify-between gap-4 mb-4 text-xs font-medium text-gray-400">
                                        {activity.fecha && (
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4 text-ufaal-blue-light" />
                                                {activity.fecha}
                                            </span>
                                        )}
                                        {activity.pais && (
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4 text-ufaal-blue-light" />
                                                {activity.pais}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold text-ufaal-text mb-4 leading-snug line-clamp-2 title-min-h">
                                        {activity.titulo}
                                    </h3>

                                    <p className="text-gray-600 font-light text-sm leading-relaxed mb-6 flex-grow">
                                        {activity.descripcion}
                                    </p>

                                    {activity.impacto && (
                                        <div className="pt-4 border-t border-gray-100 flex items-start gap-3 mt-auto">
                                            <TrendingUp className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                            <p className="text-sm font-medium text-gray-800">
                                                <span className="text-gray-500 font-normal block mb-0.5">Impacto generado:</span>
                                                {activity.impacto}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>

                {filteredActivities.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No se encontraron actividades en esta categoría.</p>
                    </div>
                )}

            </div>
        </section>
    );
}
