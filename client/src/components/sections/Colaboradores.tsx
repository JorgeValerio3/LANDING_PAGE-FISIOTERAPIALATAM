import { FadeIn } from '../ui/FadeIn';
import { useI18n } from '../../contexts/I18nContext';

export function Colaboradores({ data }: { data: any }) {
    const { t } = useI18n();
    if (!data) return null;

    const colaboradores = data.logos || [];

    return (
        <section className="py-24 bg-gray-50 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6 text-center">

                <FadeIn direction="up">
                    <h2 className="text-3xl md:text-5xl font-bold text-ufaal-blue mb-4 tracking-tight">
                        {t('colaboradores.titulo')}
                    </h2>
                    <div className="w-24 h-1 bg-ufaal-blue-light mx-auto rounded-full mb-16"></div>
                </FadeIn>

                <FadeIn delay={0.2} direction="up" className="flex flex-wrap items-center justify-center gap-12 md:gap-20 lg:gap-32">
                    {colaboradores.map((colab: any, index: number) => (
                        <div key={index} className="flex items-center justify-center p-4 hover:-translate-y-2 transition-transform duration-300">
                            <img
                                src={colab.url}
                                alt={colab.nombre}
                                className="h-20 md:h-24 object-contain opacity-80 hover:opacity-100 transition-opacity"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </FadeIn>

            </div>
        </section>
    );
}
