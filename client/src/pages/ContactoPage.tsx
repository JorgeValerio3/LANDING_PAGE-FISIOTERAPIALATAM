import { FadeIn } from '../components/ui/FadeIn';
import { Mail, Phone, Clock, Send } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { useData } from '../contexts/DataContext';

export default function ContactoPage() {
    const { t } = useI18n();
    const { data: contentData } = useData();
    
    if (!contentData) return null;
    const { contacto } = contentData;

    return (
        <div className="pt-32 pb-24 bg-white overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-ufaal-gray z-0 hidden lg:block opacity-50"></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <FadeIn direction="up">
                    <h1 className="text-4xl md:text-5xl font-bold text-ufaal-blue mb-8 tracking-tight">{t('contacto.titulo')}</h1>
                    <div className="w-24 h-1 bg-ufaal-blue-light rounded-full mb-12"></div>
                </FadeIn>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    
                    {/* Left Column: Info */}
                    <div className="space-y-12">
                        <FadeIn delay={0.1} direction="right">
                            <p className="text-gray-600 text-lg font-light leading-relaxed mb-12 max-w-xl">
                                {t('contacto.descripcion')}
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-start gap-6 group">
                                    <div className="p-4 bg-ufaal-blue text-white rounded-2xl shadow-lg shadow-ufaal-blue/20 transition-all duration-300 group-hover:scale-110">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-ufaal-text">{t('contacto.info_canal')}</h4>
                                        <a href={`mailto:${contacto.email}`} className="text-gray-600 hover:text-ufaal-blue transition-colors font-light text-lg">
                                            {contacto.email}
                                        </a>
                                        <p className="text-sm text-ufaal-blue-light font-medium mt-1 uppercase tracking-wider">{t('contacto.info_respuesta')}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="p-4 bg-white border border-gray-100 text-ufaal-blue rounded-2xl shadow-sm transition-all duration-300 group-hover:scale-110">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-ufaal-text">{t('contacto.info_telefono')}</h4>
                                        <p className="text-gray-600 font-light text-lg">{contacto.telefono}</p>
                                        <div className="flex items-center gap-2 mt-1 text-gray-400">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-sm">{t('contacto.info_horario')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 p-8 bg-ufaal-blue/5 border border-ufaal-blue-light/10 rounded-3xl">
                                <h5 className="font-bold text-ufaal-blue mb-2">{t('contacto.afiliaciones_titulo')}</h5>
                                <p className="text-sm text-gray-500 font-light">
                                    {t('contacto.afiliaciones_desc')}
                                </p>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Right Column: Form */}
                    <div className="relative">
                        <FadeIn delay={0.3} direction="left">
                            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-black/5 border border-gray-100 relative">
                                <h3 className="text-2xl font-bold text-ufaal-text mb-8">{t('contacto.form_titulo')}</h3>
                                
                                <form action={`https://formsubmit.co/${contacto.email}`} method="POST" className="space-y-6">
                                    <input type="hidden" name="_subject" value="Solicitud de Soporte UFAAL" />
                                    <input type="hidden" name="_template" value="table" />
                                    <input type="hidden" name="_next" value={window.location.origin} />
                                    
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 ml-1">{t('contacto.form_nombre')}</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            placeholder={t('contacto.form_nombre_placeholder')}
                                            className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-ufaal-blue-light/50 focus:ring-4 focus:ring-ufaal-blue-light/5 outline-none transition-all placeholder-gray-400"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 ml-1">{t('contacto.form_email')}</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            placeholder={t('contacto.form_email_placeholder')}
                                            className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-ufaal-blue-light/50 focus:ring-4 focus:ring-ufaal-blue-light/5 outline-none transition-all placeholder-gray-400"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 ml-1">{t('contacto.form_asunto')}</label>
                                        <select 
                                            name="subject"
                                            className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-ufaal-blue-light/50 focus:ring-4 focus:ring-ufaal-blue-light/5 outline-none transition-all"
                                        >
                                            <option>{t('contacto.asuntos.soporte')}</option>
                                            <option>{t('contacto.asuntos.afiliacion')}</option>
                                            <option>{t('contacto.asuntos.formacion')}</option>
                                            <option>{t('contacto.asuntos.investigacion')}</option>
                                            <option>{t('contacto.asuntos.otros')}</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 ml-1">{t('contacto.form_mensaje')}</label>
                                        <textarea
                                            name="message"
                                            rows={5}
                                            required
                                            placeholder={t('contacto.form_mensaje_placeholder')}
                                            className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-ufaal-blue-light/50 focus:ring-4 focus:ring-ufaal-blue-light/5 outline-none transition-all resize-none placeholder-gray-400"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-ufaal-blue text-white rounded-2xl font-bold hover:bg-ufaal-blue-light transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-95"
                                    >
                                        <Send className="w-5 h-5" /> {t('contacto.form_enviar')}
                                    </button>
                                </form>
                            </div>
                        </FadeIn>
                    </div>

                </div>
            </div>
        </div>
    );
}
