import { FadeIn } from '../components/ui/FadeIn';
import { useI18n } from '../contexts/I18nContext';

export default function Privacidad() {
    const { t } = useI18n();

    return (
        <div className="pt-32 pb-24 bg-white">
            <div className="max-w-4xl mx-auto px-6">
                <FadeIn direction="up">
                    <h1 className="text-4xl md:text-5xl font-bold text-ufaal-blue mb-8 tracking-tight">{t('privacidad.titulo')}</h1>
                    <div className="w-24 h-1 bg-ufaal-blue-light rounded-full mb-12"></div>
                </FadeIn>

                <div className="prose prose-lg max-w-none text-gray-600 font-light space-y-8">
                    {['s1', 's2', 's3', 's4', 's5'].map((key, index) => (
                        <FadeIn key={key} delay={0.1 * (index + 1)} direction="up">
                            <section>
                                <h2 className="text-2xl font-bold text-ufaal-text mb-4 border-b border-gray-100 pb-2">
                                    {t(`privacidad.secciones.${key}.titulo`)}
                                </h2>
                                <p>
                                    {t(`privacidad.secciones.${key}.p`)}
                                    {key === 's5' && <span className="text-ufaal-blue font-medium"> ufaal2020@gmail.com</span>}
                                </p>
                                {t(`privacidad.secciones.${key}.items`) && Array.isArray(t(`privacidad.secciones.${key}.items`)) && (
                                    <ul className="list-disc pl-6 space-y-2 mt-4">
                                        {(t(`privacidad.secciones.${key}.items`) as unknown as string[]).map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </section>
                        </FadeIn>
                    ))}

                    <FadeIn delay={0.6} direction="up">
                        <p className="pt-8 text-sm text-gray-400 italic">
                            {t('privacidad.ultima_actualizacion')}
                        </p>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}
