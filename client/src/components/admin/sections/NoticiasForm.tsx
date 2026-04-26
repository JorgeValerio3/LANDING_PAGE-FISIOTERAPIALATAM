import { Plus, Trash2, X } from 'lucide-react';
import { ImageUpload } from '../ImageUpload';
import { FileUpload } from '../FileUpload';

interface NoticiasFormProps {
    data: any;
    onChange: (data: any) => void;
}

export function NoticiasForm({ data, onChange }: NoticiasFormProps) {
    if (!data) return null;
    const articulos = data.articulos || [];

    const handleChange = (field: string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const handleArticuloChange = (index: number, field: string, value: any) => {
        const newArticulos = [...articulos];
        newArticulos[index] = { ...newArticulos[index], [field]: value };
        handleChange('articulos', newArticulos);
    };

    const addArticulo = () => {
        const id = Date.now();
        handleChange('articulos', [
            ...articulos,
            {
                id,
                titulo: '',
                fecha: '',
                autor: '',
                categoria: '',
                extracto: '',
                contenido: '',
                imagen: '',
                url_externa: '',
                archivos_adjuntos: []
            }
        ]);
    };

    const removeArticulo = (index: number) => {
        const newArticulos = [...articulos];
        newArticulos.splice(index, 1);
        handleChange('articulos', newArticulos);
    };

    const addAdjunto = (index: number) => {
        const articulo = articulos[index];
        const adjuntos = articulo.archivos_adjuntos || [];
        handleArticuloChange(index, 'archivos_adjuntos', [
            ...adjuntos,
            { id: Date.now(), nombre: '', url: '' }
        ]);
    };

    const updateAdjunto = (artIdx: number, adjIdx: number, field: string, value: string) => {
        const articulo = articulos[artIdx];
        const adjuntos = [...(articulo.archivos_adjuntos || [])];
        adjuntos[adjIdx] = { ...adjuntos[adjIdx], [field]: value };
        handleArticuloChange(artIdx, 'archivos_adjuntos', adjuntos);
    };

    const removeAdjunto = (artIdx: number, adjIdx: number) => {
        const articulo = articulos[artIdx];
        const adjuntos = [...(articulo.archivos_adjuntos || [])];
        adjuntos.splice(adjIdx, 1);
        handleArticuloChange(artIdx, 'archivos_adjuntos', adjuntos);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Título de Sección</label>
                    <input
                        type="text"
                        value={data.titulo || ''}
                        onChange={(e) => handleChange('titulo', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Descripción de Sección</label>
                    <input
                        type="text"
                        value={data.descripcion || ''}
                        onChange={(e) => handleChange('descripcion', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 outline-none"
                    />
                </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-ufaal-text">
                        Artículos de Noticias
                        <span className="ml-2 text-sm font-normal text-gray-400">({articulos.length})</span>
                    </h3>
                    <button
                        onClick={addArticulo}
                        className="flex items-center gap-2 bg-ufaal-blue/10 text-ufaal-blue px-4 py-2 rounded-lg font-medium hover:bg-ufaal-blue/20 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Agregar Noticia
                    </button>
                </div>

                <div className="space-y-8">
                    {articulos.map((articulo: any, idx: number) => (
                        <div key={articulo.id || idx} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-bold text-ufaal-blue uppercase bg-ufaal-blue/10 px-3 py-1 rounded-full">
                                    Noticia #{idx + 1}
                                </span>
                                <button
                                    onClick={() => removeArticulo(idx)}
                                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Campos principales */}
                                <div className="md:col-span-2 space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Título</label>
                                        <input
                                            type="text"
                                            value={articulo.titulo || ''}
                                            onChange={(e) => handleArticuloChange(idx, 'titulo', e.target.value)}
                                            className="w-full border border-gray-200 rounded p-2 text-sm font-bold"
                                            placeholder="Título de la noticia"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Fecha</label>
                                            <input
                                                type="date"
                                                value={articulo.fecha || ''}
                                                onChange={(e) => handleArticuloChange(idx, 'fecha', e.target.value)}
                                                className="w-full border border-gray-200 rounded p-2 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Autor</label>
                                            <input
                                                type="text"
                                                value={articulo.autor || ''}
                                                onChange={(e) => handleArticuloChange(idx, 'autor', e.target.value)}
                                                className="w-full border border-gray-200 rounded p-2 text-sm"
                                                placeholder="Nombre del autor"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Categoría</label>
                                            <input
                                                type="text"
                                                value={articulo.categoria || ''}
                                                onChange={(e) => handleArticuloChange(idx, 'categoria', e.target.value)}
                                                className="w-full border border-gray-200 rounded p-2 text-sm"
                                                placeholder="Ej. Evento, Investigación"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Extracto / Resumen</label>
                                        <textarea
                                            value={articulo.extracto || ''}
                                            onChange={(e) => handleArticuloChange(idx, 'extracto', e.target.value)}
                                            className="w-full border border-gray-200 rounded p-2 text-sm h-16 resize-none"
                                            placeholder="Breve resumen visible en la lista de noticias"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Contenido Completo</label>
                                        <textarea
                                            value={articulo.contenido || ''}
                                            onChange={(e) => handleArticuloChange(idx, 'contenido', e.target.value)}
                                            className="w-full border border-gray-200 rounded p-2 text-sm h-32 resize-none"
                                            placeholder="Texto completo de la noticia"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Enlace Externo (Opcional)</label>
                                        <input
                                            type="url"
                                            value={articulo.url_externa || ''}
                                            onChange={(e) => handleArticuloChange(idx, 'url_externa', e.target.value)}
                                            className="w-full border border-gray-200 rounded p-2 text-sm"
                                            placeholder="https://..."
                                        />
                                    </div>

                                    {/* Archivos adjuntos */}
                                    <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Archivos Adjuntos (PDFs, Docs)</label>
                                            <button
                                                onClick={() => addAdjunto(idx)}
                                                className="flex items-center gap-1 text-xs text-ufaal-blue font-bold hover:underline"
                                            >
                                                <Plus className="w-3 h-3" /> Agregar archivo
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {(articulo.archivos_adjuntos || []).map((adj: any, adjIdx: number) => (
                                                <div key={adj.id || adjIdx} className="flex gap-2 items-start">
                                                    <div className="flex-1 space-y-2">
                                                        <input
                                                            type="text"
                                                            value={adj.nombre || ''}
                                                            onChange={(e) => updateAdjunto(idx, adjIdx, 'nombre', e.target.value)}
                                                            className="w-full border border-gray-200 rounded p-2 text-xs"
                                                            placeholder="Nombre del archivo (Ej: Programa del evento)"
                                                        />
                                                        <FileUpload
                                                            label=""
                                                            currentFile={adj.url || ''}
                                                            onUploadSuccess={(url) => updateAdjunto(idx, adjIdx, 'url', url)}
                                                            accept=".pdf,.doc,.docx"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => removeAdjunto(idx, adjIdx)}
                                                        className="mt-1 text-red-400 hover:text-red-600 p-1"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            {(articulo.archivos_adjuntos || []).length === 0 && (
                                                <p className="text-xs text-gray-400 text-center py-2">Sin archivos adjuntos</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Imagen de portada */}
                                <div>
                                    <ImageUpload
                                        label="Imagen de Portada"
                                        currentImage={articulo.imagen || ''}
                                        onUploadSuccess={(url) => handleArticuloChange(idx, 'imagen', url)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {articulos.length === 0 && (
                        <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                            <p className="font-medium">Sin noticias aún</p>
                            <p className="text-sm mt-1">Haz click en "Agregar Noticia" para comenzar</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
