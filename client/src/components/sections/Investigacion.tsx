import { FadeIn } from '../ui/FadeIn';
import { FileText, Download } from 'lucide-react';

export function Investigacion({ data }: { data: any }) {
    if (!data) return null;

    return (
        <section id="investigacion" className="py-24 bg-ufaal-gray">
            <div className="max-w-7xl mx-auto px-6">

                <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-2xl">
                        <FadeIn direction="up">
                            <h2 className="text-3xl md:text-5xl font-bold text-ufaal-blue mb-6 tracking-tight">{data.titulo}</h2>
                            <div className="w-24 h-1 bg-ufaal-blue-light rounded-full mb-6"></div>
                            <p className="text-gray-600 font-light text-lg leading-relaxed">
                                {data.descripcion}
                            </p>
                        </FadeIn>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.articulos?.map((articulo: any, index: number) => (
                        <FadeIn key={articulo.id || index} delay={0.3 + (index * 0.1)} direction="up" className="h-full">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col hover:border-ufaal-blue-light/30 transition-all group">
                                <div className="p-8 flex flex-col h-full">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-ufaal-gray rounded-xl text-ufaal-blue group-hover:bg-ufaal-blue group-hover:text-white transition-all">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-ufaal-blue-light uppercase tracking-wider">{articulo.revista || 'Publicación'}</p>
                                            <p className="text-xs text-gray-400">{articulo.fecha}</p>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-ufaal-text mb-4 leading-snug group-hover:text-ufaal-blue transition-colors title-min-h-small">
                                        {articulo.titulo}
                                    </h3>

                                    <p className="text-sm text-gray-500 font-light mb-6">
                                        <span className="font-semibold text-gray-700">Autores:</span> {articulo.autores}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                        {articulo.doi && (
                                            <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                                DOI: {articulo.doi}
                                            </span>
                                        )}
                                        {articulo.pdf_url && (
                                            <button 
                                                onClick={() => {
                                                    const url = articulo.pdf_url;
                                                    const finalUrl = url.startsWith('http') || url.startsWith('/') ? url : `http://localhost:5000${url}`;
                                                    window.open(finalUrl, '_blank');
                                                }}
                                                className="flex items-center gap-2 text-ufaal-blue font-bold text-sm hover:text-ufaal-blue-light transition-colors"
                                            >
                                                <Download className="w-4 h-4" />
                                                PDF
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>

            </div>
        </section>
    );
}
