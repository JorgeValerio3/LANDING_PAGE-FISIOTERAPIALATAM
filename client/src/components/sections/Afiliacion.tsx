import { FadeIn } from '../ui/FadeIn';
import { ShieldCheck, Mail, Send, ArrowRight, ClipboardCheck } from 'lucide-react';
import { useState } from 'react';

export function Afiliacion() {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText('ufaal2020@gmail.com');
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <section id="afiliacion" className="py-24 bg-white relative overflow-hidden">
            {/* Elementos decorativos de fondo */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
                <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-ufaal-blue/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-[-5%] w-[400px] h-[400px] bg-ufaal-blue-light/5 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <FadeIn direction="up">
                        <div className="flex justify-center mb-4">
                            <span className="bg-ufaal-blue/10 text-ufaal-blue font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Vinculación Institucional
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-ufaal-text mb-6 tracking-tight">
                            Alianzas <span className="text-ufaal-blue">Estratégicas</span>
                        </h2>
                        <div className="w-24 h-1 bg-ufaal-blue-light mx-auto rounded-full mb-6"></div>
                        <p className="text-gray-600 font-light text-lg leading-relaxed">
                            Consolidamos un ecosistema de excelencia regional. Actualmente gestionamos nuestra expansión a través de vínculos directos con líderes e instituciones del sector.
                        </p>
                    </FadeIn>
                </div>

                <div className="max-w-5xl mx-auto">
                    <FadeIn delay={0.2} direction="up">
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden group">
                            <div className="flex flex-col lg:flex-row items-stretch">
                                {/* Lado Izquierdo: Información y Valor */}
                                <div className="p-8 md:p-12 lg:w-3/5">
                                    <div className="mb-8">
                                        <h3 className="text-2xl font-bold text-ufaal-text mb-4">Fase de Expansión Tecnológica</h3>
                                        <p className="text-gray-600 leading-relaxed font-light mb-6">
                                            Estamos optimizando nuestros procesos institucionales para ofrecer una plataforma de membresía de estándar global. Buscamos organizaciones pioneras que deseen liderar la integración de la fisiatría y la acupuntura en Latinoamérica.
                                        </p>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                                            <div className="flex items-center gap-3 p-4 bg-ufaal-gray rounded-2xl border border-gray-100 group-hover:bg-white transition-colors">
                                                <div className="w-10 h-10 bg-ufaal-blue/10 rounded-xl flex items-center justify-center shrink-0">
                                                    <ArrowRight className="w-5 h-5 text-ufaal-blue" />
                                                </div>
                                                <span className="text-sm font-semibold text-ufaal-text">Reconocimiento Regional</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 bg-ufaal-gray rounded-2xl border border-gray-100 group-hover:bg-white transition-colors">
                                                <div className="w-10 h-10 bg-ufaal-blue/10 rounded-xl flex items-center justify-center shrink-0">
                                                    <ArrowRight className="w-5 h-5 text-ufaal-blue" />
                                                </div>
                                                <span className="text-sm font-semibold text-ufaal-text">Networking B2B</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 bg-ufaal-gray rounded-2xl border border-gray-100 group-hover:bg-white transition-colors">
                                                <div className="w-10 h-10 bg-ufaal-blue/10 rounded-xl flex items-center justify-center shrink-0">
                                                    <ArrowRight className="w-5 h-5 text-ufaal-blue" />
                                                </div>
                                                <span className="text-sm font-semibold text-ufaal-text">Propuesta de Valor</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 bg-ufaal-gray rounded-2xl border border-gray-100 group-hover:bg-white transition-colors">
                                                <div className="w-10 h-10 bg-ufaal-blue/10 rounded-xl flex items-center justify-center shrink-0">
                                                    <ArrowRight className="w-5 h-5 text-ufaal-blue" />
                                                </div>
                                                <span className="text-sm font-semibold text-ufaal-text">Optimización Clínica</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Lado Derecho: Call to Action Directo */}
                                <div className="bg-ufaal-blue p-8 md:p-12 lg:w-2/5 flex flex-col justify-center text-white relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mt-10 -mr-10"></div>
                                    
                                    <div className="relative z-10">
                                        <h4 className="text-xl font-bold mb-2">Solicitar Propuesta</h4>
                                        <p className="text-white/80 font-light text-sm mb-8">
                                            Reciba una propuesta personalizada para usted o su institución.
                                        </p>

                                        <div className="space-y-4">
                                            <a 
                                                href="mailto:ufaal2020@gmail.com"
                                                className="flex items-center justify-between bg-white text-ufaal-blue p-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg active:scale-95"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Mail className="w-5 h-5" />
                                                    <span>Enviar Correo</span>
                                                </div>
                                                <Send className="w-4 h-4" />
                                            </a>

                                            <button 
                                                onClick={copyToClipboard}
                                                className="w-full flex items-center justify-center gap-3 bg-ufaal-blue-dark/50 hover:bg-ufaal-blue-dark text-white/90 border border-white/20 p-4 rounded-xl font-medium transition-all text-sm"
                                            >
                                                {copied ? (
                                                    <>
                                                        <ClipboardCheck className="w-4 h-4 text-green-400" />
                                                        ¡Copiado al portapapeles!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Mail className="w-4 h-4 opacity-70" />
                                                        ufaal2020@gmail.com
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        <p className="mt-8 text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold text-center">
                                            Atención Prioritaria B2B
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>

                <div className="mt-16 text-center">
                    <FadeIn delay={0.4} direction="up">
                        <p className="text-gray-400 text-sm font-medium italic">
                            "Hacia la excelencia en la salud integral de Latinoamérica."
                        </p>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
