import { FadeIn } from '../ui/FadeIn';
import { FileText, Download, ShieldCheck, ExternalLink, Calendar, ArrowRight } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { InvestigacionData } from '../../types';
import { getUploadUrl } from '../../services/api';

export function Investigacion({ data: _data }: { data?: InvestigacionData }) {
    const { t } = useI18n();
    if (!_data) return null;

    const handleDownloadEstatutos = () => {
        if (_data.estatutos_pdf) {
            window.open(_data.estatutos_pdf.startsWith('http') || _data.estatutos_pdf.startsWith('/') ? _data.estatutos_pdf : `/${_data.estatutos_pdf}`, '_blank', 'noopener,noreferrer');
        }
    };

    const handleDownloadPDF = (url?: string) => {
        if (url) {
            window.open(url.startsWith('http') || url.startsWith('/') ? url : `/${url}`, '_blank', 'noopener,noreferrer');
        }
    };

    const articulos = _data.articulos || [];

    return (
        <section id="investigacion" className="py-24 bg-ufaal-gray">
            <div className="max-w-7xl mx-auto px-6">

                <div className="flex flex-col lg:flex-row justify-between items-center mb-16 gap-8">
                    <div className="max-w-2xl text-center lg:text-left">
                        <FadeIn direction="up">
                            <h2 className="text-3xl md:text-5xl font-bold text-ufaal-blue mb-6 tracking-tight">{t('investigacion.titulo')}</h2>
                            <div className="w-24 h-1 bg-ufaal-blue-light rounded-full mb-6 mx-auto lg:mx-0"></div>
                            <p className="text-gray-600 font-light text-lg leading-relaxed">
                                {t('investigacion.descripcion')}
                            </p>
                        </FadeIn>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Statutes Card */}
                    <FadeIn direction="up" delay={0.2}>
                        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 group hover:shadow-xl transition-all duration-500 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-ufaal-blue/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-ufaal-blue/10 transition-colors"></div>

                            <div className="shrink-0 p-5 bg-ufaal-gray rounded-2xl text-ufaal-blue group-hover:bg-ufaal-blue group-hover:text-white transition-all transform group-hover:scale-110 duration-500">
                                <ShieldCheck className="w-10 h-10" />
                            </div>

                             <div className="flex-1 text-center md:text-left relative z-10">
                                <h3 className="text-2xl font-bold text-ufaal-blue mb-3">{t('investigacion.estatutos_titulo')}</h3>
                                <p className="text-gray-600 font-light mb-6">
                                    {t('investigacion.estatutos_desc')}
                                </p>
                                <button
                                    onClick={handleDownloadEstatutos}
                                    className="px-8 py-3 bg-ufaal-blue text-white rounded-full font-bold hover:bg-ufaal-blue-light transition-all flex items-center gap-2 shadow-lg hover:shadow-xl group-hover:-translate-y-1 transform duration-300"
                                >
                                    <Download className="w-5 h-5" />
                                    {t('investigacion.descargar_pdf')}
                                </button>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Proximas publicaciones placeholder si no hay artículos */}
                    {articulos.length === 0 && (
                        <FadeIn direction="up" delay={0.4}>
                            <div className="bg-white/50 backdrop-blur-sm border-2 border-dashed border-gray-200 p-10 rounded-3xl flex flex-col items-center justify-center text-center group hover:border-ufaal-blue-light/30 transition-colors h-full">
                                <div className="p-4 bg-gray-100 rounded-2xl text-gray-400 mb-4">
                                    <FileText className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-400 mb-2">{t('investigacion.proximas_pub_titulo')}</h3>
                                <p className="text-gray-400 font-light max-w-xs">
                                    {t('investigacion.proximas_pub_desc')}
                                </p>
                            </div>
                        </FadeIn>
                    )}

                    {/* Si hay artículos, mostrar el primero como destacado o simplemente el listado */}
                </div>

                {articulos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articulos.map((art, idx) => (
                            <FadeIn key={idx} delay={idx * 0.1} direction="up">
                                <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 group hover:shadow-xl transition-all duration-500 flex flex-col h-full">
                                    <div className="relative h-48 overflow-hidden bg-gray-100">
                                        <img 
                                            src={getUploadUrl(art.imagen || "https://images.unsplash.com/photo-1454165833767-027ff33027b4?auto=format&fit=crop&q=80&w=800")} 
                                            alt={art.titulo} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm">
                                            <FileText className="w-4 h-4 text-ufaal-blue" />
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center gap-3 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {art.fecha}
                                            </span>
                                            {art.revista && (
                                                <span className="bg-ufaal-gray px-2 py-0.5 rounded text-ufaal-blue">
                                                    {art.revista}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-bold text-ufaal-text mb-2 line-clamp-2 group-hover:text-ufaal-blue transition-colors">
                                            {art.titulo}
                                        </h3>
                                        <p className="text-gray-500 text-xs font-medium mb-4 italic">
                                            {art.autores}
                                        </p>
                                        <div className="mt-auto pt-4 flex items-center justify-between">
                                            {art.pdf_url ? (
                                                <button 
                                                    onClick={() => handleDownloadPDF(art.pdf_url)}
                                                    className="text-ufaal-blue text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform"
                                                >
                                                    Leer Artículo <ArrowRight className="w-3 h-3" />
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 text-[10px] uppercase font-bold">Sin PDF disponible</span>
                                            )}
                                            {art.doi && (
                                                <a href={`https://doi.org/${art.doi}`} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-ufaal-blue transition-colors">
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

