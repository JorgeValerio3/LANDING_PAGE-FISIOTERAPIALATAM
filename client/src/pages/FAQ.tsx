import { useState } from 'react';
import { FadeIn } from '../components/ui/FadeIn';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { useI18n } from '../contexts/I18nContext';


function AccordionItem({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) {
    return (
        <div className="border-b border-gray-100 last:border-0 overflow-hidden">
            <button
                onClick={onClick}
                className="w-full py-6 flex items-center justify-between gap-4 text-left hover:text-ufaal-blue transition-colors group"
            >
                <span className={clsx("text-lg font-medium transition-colors", isOpen ? "text-ufaal-blue" : "text-ufaal-text")}>
                    {question}
                </span>
                <ChevronDown className={clsx("w-5 h-5 shrink-0 transition-transform duration-300", isOpen && "rotate-180 text-ufaal-blue")} />
            </button>
            <div 
                className={clsx(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-96 pb-6 opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <p className="text-gray-600 font-light leading-relaxed">
                    {answer}
                </p>
            </div>
        </div>
    );
}

export default function FAQ() {
    const { t } = useI18n();
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqKeys = ['p1', 'p2', 'p3', 'p4', 'p5'];

    return (
        <div className="pt-32 pb-24 bg-white">
            <div className="max-w-4xl mx-auto px-6">
                <FadeIn direction="up">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-ufaal-blue/5 rounded-2xl text-ufaal-blue">
                            <HelpCircle className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-ufaal-blue tracking-tight">{t('faq.titulo')}</h1>
                    </div>
                    <div className="w-24 h-1 bg-ufaal-blue-light rounded-full mb-12"></div>
                    <p className="text-gray-600 text-lg font-light mb-12">
                        {t('faq.descripcion')}
                    </p>
                </FadeIn>

                <FadeIn delay={0.2} direction="up" className="bg-ufaal-gray/30 rounded-3xl p-8 md:p-12 border border-gray-100">
                    <div className="divide-y divide-gray-100">
                        {faqKeys.map((key, index) => (
                            <AccordionItem
                                key={index}
                                question={t(`faq.preguntas.${key}.q`)}
                                answer={t(`faq.preguntas.${key}.a`)}
                                isOpen={openIndex === index}
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            />
                        ))}
                    </div>
                </FadeIn>

                <FadeIn delay={0.4} direction="up" className="mt-16 text-center">
                    <div className="bg-ufaal-blue p-10 rounded-3xl text-white shadow-xl">
                        <h3 className="text-2xl font-bold mb-4">{t('faq.no_encuentras')}</h3>
                        <p className="text-blue-100 font-light mb-8 max-w-lg mx-auto">
                            {t('faq.soporte_desc')}
                        </p>
                        <a 
                            href="#/contacto" 
                            className="inline-block px-10 py-4 bg-white text-ufaal-blue rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg active:scale-95"
                        >
                            {t('faq.contactar_soporte')}
                        </a>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
