import { FadeIn } from '../ui/FadeIn';
import { useI18n } from '../../contexts/I18nContext';
import { HistoriaData } from '../../types';

export function Historia({ data }: { data: HistoriaData }) {
    const { t } = useI18n();
    if (!data) return null;

    return (
        <section id="historia" className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    <FadeIn direction="right">
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-ufaal-blue/5 rounded-full blur-2xl"></div>
                            <h2 className="text-3xl md:text-5xl font-bold text-ufaal-blue mb-4 tracking-tight">
                                {t('navbar.historia')}
                            </h2>
                            <h3 className="text-xl font-semibold text-ufaal-blue-light mb-8">
                                {t('historia.subtitulo') || 'Uniendo voluntades por la fisioterapia acuática'}
                            </h3>
                            
                            <div className="space-y-6">
                                {Array.isArray(t('historia.descripcion')) ? (t('historia.descripcion') as unknown as string[]).map((parrafo: string, index: number) => (
                                    <p key={index} className="text-gray-600 font-light text-lg leading-relaxed">
                                        {parrafo}
                                    </p>
                                )) : (
                                    <p className="text-gray-600 font-light text-lg leading-relaxed">{t('historia.descripcion')}</p>
                                )}
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn direction="left" delay={0.2}>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-ufaal-blue rounded-3xl rotate-3 scale-105 opacity-5 group-hover:rotate-1 transition-transform duration-500"></div>
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                                <img 
                                    src={data.imagen} 
                                    alt="Historia UFAAL" 
                                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-ufaal-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                            
                            {/* Accent elements */}
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-ufaal-blue-light/10 rounded-full blur-3xl"></div>
                            <div className="absolute top-1/2 -left-8 w-1 h-24 bg-gradient-to-b from-transparent via-ufaal-blue-light/40 to-transparent"></div>
                        </div>
                    </FadeIn>

                </div>
            </div>
        </section>
    );
}
