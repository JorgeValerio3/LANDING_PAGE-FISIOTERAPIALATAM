import { FadeIn } from '../ui/FadeIn';
import { Target, Eye, Heart, Globe, TestTube, Users, ShieldCheck, Lightbulb, HandHeart } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { QuienesSomosData } from '../../types';

const iconMap: Record<string, React.ReactNode> = {
    Globe: <Globe className="w-6 h-6 text-ufaal-blue" />,
    TestTube: <TestTube className="w-6 h-6 text-ufaal-blue" />,
    ShieldCheck: <ShieldCheck className="w-6 h-6 text-ufaal-blue" />,
    Lightbulb: <Lightbulb className="w-6 h-6 text-ufaal-blue" />,
    HandHeart: <HandHeart className="w-6 h-6 text-ufaal-blue" />,
    Users: <Users className="w-6 h-6 text-ufaal-blue" />,
};

export function QuienesSomos({ data: _data }: { data?: QuienesSomosData }) {
    const { t } = useI18n();
    if (!_data) return null;

    return (
        <section id="quienes-somos" className="py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">

                {/* Main Intro: Quiénes Somos */}
                <div className="mb-24 relative">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
                    <FadeIn direction="up">
                        <div className="text-center max-w-4xl mx-auto">
                            <span className="text-ufaal-blue font-semibold tracking-widest uppercase text-sm mb-4 block">{t('quienes_somos.institucional')}</span>
                            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-10">
                                {t('quienes_somos.titulo')}
                            </h2>
                            <div className="space-y-6 text-lg md:text-xl text-slate-600 font-light leading-relaxed whitespace-pre-line">
                                {t('quienes_somos.descripcion')}
                            </div>
                        </div>
                    </FadeIn>
                </div>

                {/* Filosofía Section */}
                {_data.filosofia && (
                    <div className="mb-32">
                        <FadeIn direction="up" delay={0.2}>
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-ufaal-blue to-blue-600 rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative bg-white p-10 md:p-16 rounded-[3rem] shadow-sm border border-slate-100 max-w-5xl mx-auto">
                                    <div className="flex flex-col items-center mb-12">
                                        <div className="bg-blue-50 p-4 rounded-2xl mb-6">
                                            <Heart className="w-8 h-8 text-ufaal-blue" />
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight text-center">
                                            {t('quienes_somos.filosofia.titulo')}
                                        </h3>
                                    </div>
                                    <div className="space-y-8 text-slate-600 font-light text-lg leading-relaxed columns-1 md:columns-2 gap-12">
                                        {(t('quienes_somos.filosofia.contenido') || '').split('\n\n').map((paragraph: string, i: number) => (
                                            <p key={i} className={i === 4 ? "font-medium text-ufaal-blue break-inside-avoid" : ""}>
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                )}

                {/* Misión y Visión Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32 max-w-5xl mx-auto">
                    <FadeIn direction="left" delay={0.3} className="h-full">
                        <div className="group relative h-full">
                            <div className="absolute -inset-1 bg-gradient-to-br from-ufaal-blue to-blue-800 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-gradient-to-br from-ufaal-blue to-blue-900 p-10 rounded-[2.5rem] h-full text-white shadow-xl flex flex-col">
                                <div className="bg-white/10 p-4 rounded-2xl w-fit mb-8 backdrop-blur-md border border-white/10">
                                    <Target className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold mb-6 tracking-tight">{t('common.mision') || 'Misión'}</h3>
                                <p className="text-blue-50/90 leading-relaxed font-light text-lg flex-grow">
                                    {t('quienes_somos.mision')}
                                </p>
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn direction="right" delay={0.4} className="h-full">
                        <div className="bg-white p-10 rounded-[2.5rem] h-full shadow-sm border border-slate-100 hover:border-blue-100 transition-colors duration-500 flex flex-col">
                            <div className="bg-blue-50 p-4 rounded-2xl w-fit mb-8">
                                <Eye className="w-10 h-10 text-ufaal-blue" />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">{t('common.vision') || 'Visión'}</h3>
                            <p className="text-slate-600 leading-relaxed font-light text-lg flex-grow">
                                {t('quienes_somos.vision')}
                            </p>
                        </div>
                    </FadeIn>
                </div>

                {/* Valores */}
                {_data.valores && (
                    <div className="max-w-6xl mx-auto">
                        <FadeIn direction="up">
                            <div className="text-center mb-20">
                                <span className="inline-block px-4 py-1.5 bg-blue-50 text-ufaal-blue text-xs font-bold tracking-widest uppercase rounded-full mb-4">{t('quienes_somos.valores.tag')}</span>
                                <h3 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
                                    {t('quienes_somos.valores.titulo')}
                                </h3>
                            </div>
                        </FadeIn>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                             {[
                                 { key: 'colaboracion_intercultural', icono: 'Globe' },
                                 { key: 'excelencia_academica', icono: 'Lightbulb' },
                                 { key: 'compromiso_bioetico', icono: 'ShieldCheck' },
                                 { key: 'innovacion_terapeutica', icono: 'TestTube' },
                                 { key: 'respeto_dignidad', icono: 'HandHeart' },
                                 { key: 'transparencia_responsabilidad', icono: 'Users' }
                             ].map((item: { key: string; icono: string }, index: number) => (
                                <FadeIn key={item.key} delay={0.1 + (index * 0.1)} direction="up" className="h-full">
                                    <div className="bg-white p-8 rounded-[2rem] h-full border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-500 group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                                        <div className="relative">
                                            <div className="p-4 bg-slate-50 rounded-2xl inline-block mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                                {iconMap[item.icono] || <Heart className="w-6 h-6" />}
                                            </div>
                                            <h4 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-ufaal-blue transition-colors">
                                                {t(`quienes_somos.valores.items.${item.key}.titulo`)}
                                            </h4>
                                            <p className="text-slate-600 font-light leading-relaxed text-base">
                                                {t(`quienes_somos.valores.items.${item.key}.descripcion`)}
                                            </p>
                                        </div>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}

