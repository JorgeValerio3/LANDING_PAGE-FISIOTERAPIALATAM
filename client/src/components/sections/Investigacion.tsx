import { FadeIn } from '../ui/FadeIn';
import { FileText, Download, ShieldCheck } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';

export function Investigacion({ data: _data }: { data?: any }) {
    const { t } = useI18n();
    if (!_data) return null;

    const handleDownloadEstatutos = () => {
        if (_data.estatutos_pdf) {
            window.open(_data.estatutos_pdf.startsWith('http') || _data.estatutos_pdf.startsWith('/') ? _data.estatutos_pdf : `/${_data.estatutos_pdf}`, '_blank', 'noopener,noreferrer');
        }
    };

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

                    {/* Placeholder for future Research works */}
                    <FadeIn direction="up" delay={0.4}>
                        <div className="bg-white/50 backdrop-blur-sm border-2 border-dashed border-gray-200 p-10 rounded-3xl flex flex-col items-center justify-center text-center group hover:border-ufaal-blue-light/30 transition-colors">
                            <div className="p-4 bg-gray-100 rounded-2xl text-gray-400 mb-4">
                                <FileText className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-400 mb-2">{t('investigacion.proximas_pub_titulo')}</h3>
                            <p className="text-gray-400 font-light max-w-xs">
                                {t('investigacion.proximas_pub_desc')}
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
