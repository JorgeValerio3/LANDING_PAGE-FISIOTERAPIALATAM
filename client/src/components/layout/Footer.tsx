import { Facebook, Instagram, Linkedin, Globe, Mail } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { FooterData, ContactoData } from '../../types';

export function Footer({ data: _data, contactData }: { data?: FooterData, contactData?: ContactoData }) {
    const { t } = useI18n();
    const currentYear = new Date().getFullYear();
    
    // Redes sociales desde contactData o _data.contacto
    const socialLinks: { facebook?: string; instagram?: string; linkedin?: string } = contactData?.redes_sociales || _data?.redes_sociales || {};

    return (
        <footer className="bg-ufaal-blue pt-20 pb-10 border-t border-ufaal-blue-light/20 relative overflow-hidden">
            {/* Elemento Decorativo de Fondo */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

                    {/* Columna 1: Logo e Identidad */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 group">
                            <img
                                src="./images/logo.svg"
                                alt="Logo UFAAL"
                                className="h-16 w-auto object-contain brightness-0 invert opacity-100 transition-all duration-300 group-hover:scale-105"
                                loading="lazy"
                            />
                        </div>
                        <p className="text-gray-400 font-light leading-relaxed text-sm">
                            {t('footer.descripcion')}
                        </p>
                        <div className="flex items-center gap-2 text-ufaal-blue-light border border-ufaal-blue-light/30 bg-ufaal-blue-light/5 px-4 py-2 rounded-lg w-fit">
                            <Globe className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">{t('footer.region')}</span>
                        </div>
                    </div>

                    {/* Columna 2: Navegación */}
                    <div>
                        <h4 className="text-white font-bold mb-8 text-lg flex items-center gap-2">
                             {t('footer.enlaces_rapidos')}
                        </h4>
                        <ul className="grid grid-cols-1 gap-4">
                            {[
                                { titulo: t('navbar.quienes_somos'), url: '#/quienes-somos' },
                                { titulo: t('navbar.historia'), url: '#/historia' },
                                { titulo: t('navbar.organizacion'), url: '#/organizacion' },
                                { titulo: t('navbar.paises'), url: '#/paises' },
                                { titulo: t('navbar.formacion'), url: '#/formacion' },
                                { titulo: t('navbar.investigacion'), url: '#/investigacion' },
                                { titulo: t('navbar.sede_virtual'), url: '#/sede-virtual' }
                            ].map((link: { titulo: string; url: string }, idx: number) => (
                                <li key={idx}>
                                    <a href={link.url} className="text-gray-400 hover:text-white transition-all duration-300 text-sm font-light hover:pl-2 inline-block">
                                        {link.titulo}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-8 text-lg">{t('footer.recursos')}</h4>
                        <ul className="space-y-4">
                            {[
                                { titulo: t('faq.titulo') || 'FAQ', url: '#/faq' },
                                { titulo: t('privacidad.titulo'), url: '#/privacidad' },
                                { titulo: t('terminos.titulo'), url: '#/terminos' },
                                { titulo: t('navbar.contacto') || 'Contacto', url: '#/contacto' }
                            ].map((link: { titulo: string; url: string }, idx: number) => (
                                <li key={idx}>
                                    <a href={link.url} className="text-gray-400 hover:text-white transition-all duration-300 text-sm font-light hover:pl-2 inline-block">
                                        {link.titulo}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h4 className="text-white font-bold mb-6 text-lg">{t('footer.siguenos')}</h4>
                            <div className="flex gap-3">
                                {socialLinks.facebook && socialLinks.facebook !== "#" && (
                                    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" 
                                       className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all border border-white/5 active:scale-95"
                                       title="Facebook">
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                )}
                                {socialLinks.instagram && socialLinks.instagram !== "#" && (
                                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" 
                                       className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all border border-white/5 active:scale-95"
                                       title="Instagram">
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                )}
                                {socialLinks.linkedin && socialLinks.linkedin !== "#" && (
                                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" 
                                       className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all border border-white/5 active:scale-95"
                                       title="LinkedIn">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4 opacity-50">{t('footer.contacto_institucional')}</h4>
                            <a href="mailto:ufaal2020@gmail.com" className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors bg-white/5 p-4 rounded-2xl border border-white/5">
                                <div className="p-2 bg-ufaal-blue-light/20 rounded-lg text-ufaal-blue-light group-hover:bg-ufaal-blue-light group-hover:text-white transition-all">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-light truncate tracking-wide">ufaal2020@gmail.com</span>
                            </a>
                        </div>
                    </div>

                </div>

                {/* Sub-footer: Copyright y Reconocimiento */}
                <div className="border-t border-white/5 pt-10 mt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <div className="space-y-1">
                        <p className="text-gray-500 text-sm font-light">
                            &copy; {currentYear} {t('footer.copyright_text')}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4 py-2 px-6 bg-white/5 rounded-full border border-white/5">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-gray-400 text-xs font-medium tracking-tight">
                            {t('footer.reconocimiento')}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
