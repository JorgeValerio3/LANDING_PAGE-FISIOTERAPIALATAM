import { Plus, Trash2 } from 'lucide-react';
import { ImageUpload } from '../ImageUpload';

interface NoticiasFormProps {
    data: any;
    onChange: (data: any) => void;
}

export function NoticiasForm({ data, onChange }: NoticiasFormProps) {
    const handleChange = (field: string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const handleArticuloChange = (index: number, field: string, value: any) => {
        const newArticulos = [...data.articulos];
        newArticulos[index] = { ...newArticulos[index], [field]: value };
        handleChange('articulos', newArticulos);
    };

    const addArticulo = () => {
        const id = Date.now();
        const newArticulos = [...data.articulos, { id, titulo: "", fecha: "", autor: "", categoria: "", extracto: "", contenido_rtf: "", imagen: "", url_externa: "" }];
        handleChange('articulos', newArticulos);
    };

    const removeArticulo = (index: number) => {
        const newArticulos = [...data.articulos];
        newArticulos.splice(index, 1);
        handleChange('articulos', newArticulos);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Título</label>
                    <input type="text" value={data.titulo} onChange={(e) => handleChange('titulo', e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 outline-none" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Descripción</label>
                    <input type="text" value={data.descripcion} onChange={(e) => handleChange('descripcion', e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 outline-none" />
                </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-ufaal-text">Artículos de Noticias</h3>
                    <button onClick={addArticulo} className="flex items-center gap-2 bg-ufaal-blue/10 text-ufaal-blue px-4 py-2 rounded-lg font-medium">
                        <Plus className="w-4 h-4" /> Agregar Noticia
                    </button>
                </div>

                <div className="space-y-8">
                    {data.articulos.map((articulo: any, idx: number) => (
                        <div key={articulo.id} className="bg-white border rounded-xl p-6 shadow-sm relative pr-12">
                            <button onClick={() => removeArticulo(idx)} className="absolute top-6 right-6 text-red-500 hover:bg-red-50 p-2 rounded-lg">
                                <Trash2 className="w-5 h-5" />
                            </button>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Título de la Noticia</label>
                                        <input type="text" value={articulo.titulo} onChange={(e) => handleArticuloChange(idx, 'titulo', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm font-bold" />
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                         <div>
                                             <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Fecha</label>
                                             <input type="text" value={articulo.fecha} onChange={(e) => handleArticuloChange(idx, 'fecha', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm" />
                                         </div>
                                         <div>
                                             <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Autor</label>
                                             <input type="text" value={articulo.autor} onChange={(e) => handleArticuloChange(idx, 'autor', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm" />
                                         </div>
                                         <div>
                                             <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Categoría</label>
                                             <input type="text" value={articulo.categoria} onChange={(e) => handleArticuloChange(idx, 'categoria', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm" />
                                         </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Breve Extracto</label>
                                        <textarea value={articulo.extracto} onChange={(e) => handleArticuloChange(idx, 'extracto', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm h-16" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Enlace Externo (Opcional)</label>
                                        <input type="text" value={articulo.url_externa} onChange={(e) => handleArticuloChange(idx, 'url_externa', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <ImageUpload 
                                        label="Imagen de Portada" 
                                        currentImage={articulo.imagen} 
                                        onUploadSuccess={(url) => handleArticuloChange(idx, 'imagen', url)} 
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
