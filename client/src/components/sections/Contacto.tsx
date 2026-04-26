import { useState, useEffect } from 'react';
import { FadeIn } from '../ui/FadeIn';
import { Mail, Send, Facebook, Instagram, Linkedin, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { fetchClient } from '../../api';
import { ContactoData } from '../../types';

export function Contacto({ data: _data }: { data?: ContactoData }) {
    const { t } = useI18n();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (status !== 'idle') {
            const timer = setTimeout(() => setStatus('idle'), 8000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    if (!_data) return null;

    const correo = _data.email || 'ufaal2020@gmail.com';
    const redes = _data.redes_sociales || {};

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        setStatus('idle');
        setErrorMsg('');

        const form = e.currentTarget;
        const formData = new FormData(form);
        const rawData = Object.fromEntries(formData.entries());
        
        // QA: Limpieza y Desinfección Proactiva
        const cleanData = {
            nombre: String(rawData.nombre).trim(),
            email: String(rawData.email).trim().toLowerCase(),
            telefono: String(rawData.telefono || '').trim(),
            asunto: String(rawData.asunto).trim(),
            mensaje: String(rawData.mensaje).trim()
        };

        // Validación básica previa
        if (!cleanData.nombre || !cleanData.email || !cleanData.mensaje) {
            setStatus('error');
            setErrorMsg('Por favor completa los campos requeridos');
            setIsLoading(false);
            return;
        }

        try {
            await fetchClient('/contact', {
                method: 'POST',
                body: cleanData,
            });

            setStatus('success');
            form.reset();
        } catch (error: any) {
            console.error('QA Error [Contacto]:', error);
            setStatus('error');
            setErrorMsg(error.message || 'Error al enviar el formulario');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="contacto-directo" className="py-24 bg-white relative">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-ufaal-gray z-0 hidden lg:block"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16 lg:text-left">
                    <FadeIn direction="up">
                        <h2 className="text-3xl md:text-5xl font-bold text-ufaal-blue mb-6 tracking-tight">{t('contacto.titulo')}</h2>
                        <div className="w-24 h-1 bg-ufaal-blue-light mx-auto lg:mx-0 rounded-full mb-6"></div>
                        <p className="text-gray-600 font-light text-lg">
                            {t('contacto.descripcion')}
                        </p>
                    </FadeIn>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    <div className="w-full lg:w-[60%] bg-white rounded-3xl shadow-xl shadow-ufaal-blue/5 border border-gray-100 p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-ufaal-blue via-ufaal-blue-light to-blue-300"></div>

                        <FadeIn delay={0.2} direction="right">
                            <h3 className="text-2xl font-bold text-ufaal-text mb-8">{t('contacto.form_titulo') || 'Envíanos un mensaje'}</h3>

                            {status === 'success' && (
                                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-2xl flex items-center gap-3 border border-green-200 animate-in fade-in slide-in-from-top-2">
                                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                    <p className="font-semibold text-sm">Mensaje enviado correctamente. Nos pondremos en contacto pronto.</p>
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl flex items-center gap-3 border border-red-200 animate-in shake">
                                    <XCircle className="w-5 h-5 flex-shrink-0" />
                                    <p className="font-semibold text-sm">{errorMsg || 'Hubo un problema al enviar el mensaje. Intenta de nuevo.'}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <fieldset disabled={isLoading} className="grid grid-cols-1 md:grid-cols-2 gap-6 disabled:opacity-50">
                                    <div className="space-y-2">
                                        <label htmlFor="nombre" className="text-xs font-bold text-ufaal-text uppercase tracking-widest ml-1">{t('contacto.form_nombre')}</label>
                                        <input type="text" id="nombre" name="nombre" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-ufaal-blue/10 focus:border-ufaal-blue-light outline-none transition-all placeholder-gray-400 font-medium" placeholder={t('contacto.form_nombre_placeholder')} />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-xs font-bold text-ufaal-text uppercase tracking-widest ml-1">{t('contacto.form_email')}</label>
                                        <input type="email" id="email" name="email" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-ufaal-blue/10 focus:border-ufaal-blue-light outline-none transition-all placeholder-gray-400 font-medium" placeholder={t('contacto.form_email_placeholder')} />
                                    </div>
                                </fieldset>

                                <fieldset disabled={isLoading} className="grid grid-cols-1 md:grid-cols-2 gap-6 disabled:opacity-50">
                                    <div className="space-y-2">
                                        <label htmlFor="telefono" className="text-xs font-bold text-ufaal-text uppercase tracking-widest ml-1">{t('contacto.form_telefono')}</label>
                                        <input type="tel" id="telefono" name="telefono" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-ufaal-blue/10 focus:border-ufaal-blue-light outline-none transition-all placeholder-gray-400 font-medium" placeholder={t('contacto.form_telefono_placeholder')} />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="asunto" className="text-xs font-bold text-ufaal-text uppercase tracking-widest ml-1">{t('contacto.form_asunto')}</label>
                                        <input type="text" id="asunto" name="asunto" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-ufaal-blue/10 focus:border-ufaal-blue-light outline-none transition-all placeholder-gray-400 font-medium" placeholder={t('contacto.form_asunto_placeholder')} />
                                    </div>
                                </fieldset>

                                <div className="space-y-2">
                                    <label htmlFor="mensaje" className="text-xs font-bold text-ufaal-text uppercase tracking-widest ml-1">{t('contacto.form_mensaje')}</label>
                                    <textarea id="mensaje" name="mensaje" rows={5} required disabled={isLoading} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-ufaal-blue/10 focus:border-ufaal-blue-light outline-none transition-all resize-none placeholder-gray-400 font-medium disabled:opacity-50" placeholder={t('contacto.form_mensaje_placeholder')}></textarea>
                                </div>

                                <button type="submit" disabled={isLoading} className="w-full sm:w-auto px-10 py-4 bg-ufaal-blue text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-ufaal-blue-dark transition-all flex items-center justify-center gap-3 shadow-xl shadow-ufaal-blue/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                    {isLoading ? 'Enviando...' : t('contacto.enviar_mensaje')}
                                </button>
                            </form>
                        </FadeIn>
                    </div>

                    <div className="w-full lg:w-[40%] flex flex-col justify-center">
                        <FadeIn delay={0.4} direction="left" className="space-y-12">
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white rounded-full text-ufaal-blue shadow-sm border border-gray-100 shrink-0"><Mail className="w-6 h-6" /></div>
                                    <div>
                                        <h4 className="text-lg font-bold text-ufaal-text mb-1">{t('contacto.info_email')}</h4>
                                        <a href={`mailto:${correo}`} className="text-gray-600 hover:text-ufaal-blue transition-colors font-light">{correo}</a>
                                        <p className="text-gray-500 text-sm mt-1">{t('contacto.info_horario')}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-bold text-ufaal-text mb-6">{t('contacto.redes_sociales')}</h4>
                                <div className="flex gap-4">
                                    {redes.facebook && redes.facebook !== "#" && (<a href={redes.facebook} target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-full text-gray-500 hover:text-white hover:bg-[#1877F2] transition-colors shadow-sm"><Facebook className="w-6 h-6" /></a>)}
                                    {redes.instagram && redes.instagram !== "#" && (<a href={redes.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-full text-gray-500 hover:text-white hover:bg-[#E4405F] transition-colors shadow-sm"><Instagram className="w-6 h-6" /></a>)}
                                    {redes.linkedin && redes.linkedin !== "#" && (<a href={redes.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-full text-gray-500 hover:text-white hover:bg-[#0A66C2] transition-colors shadow-sm"><Linkedin className="w-6 h-6" /></a>)}
                                    {(!redes.facebook || redes.facebook === "#") && (!redes.instagram || redes.instagram === "#") && (!redes.linkedin || redes.linkedin === "#") && (<span className="text-gray-400 text-sm italic">{t('contacto.proximamente') || 'Próximamente en redes sociales'}</span>)}
                                </div>
                                {redes.instagram && redes.instagram.includes('instagram.com/') && (
                                    <div className="mt-8 pt-6 border-t border-gray-100/50">
                                        <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-[0.2em]">{t('contacto.insta_oficial')}</p>
                                        <a href={redes.instagram} target="_blank" rel="noopener noreferrer" className="text-ufaal-blue font-bold hover:text-ufaal-blue-light transition-colors text-lg flex items-center gap-2">
                                            <span className="text-ufaal-blue-light">@</span>{redes.instagram.split('instagram.com/')[1].split('/')[0]}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </section>
    );
}
