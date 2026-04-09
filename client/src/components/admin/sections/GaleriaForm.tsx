import { Plus, Trash2 } from 'lucide-react';
import { ImageUpload } from '../ImageUpload';

interface GaleriaFormProps {
    data: any;
    onChange: (data: any) => void;
}

export function GaleriaForm({ data, onChange }: GaleriaFormProps) {
    const handleChange = (field: string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const handleImagenChange = (index: number, field: string, value: any) => {
        const newImagenes = [...data.imagenes];
        newImagenes[index] = { ...newImagenes[index], [field]: value };
        handleChange('imagenes', newImagenes);
    };

    const addImagen = () => {
        const id = Date.now();
        const newImagenes = [...data.imagenes, { id, url: "", titulo: "", descripcion: "", categoria: "" }];
        handleChange('imagenes', newImagenes);
    };

    const removeImagen = (index: number) => {
        const newImagenes = [...data.imagenes];
        newImagenes.splice(index, 1);
        handleChange('imagenes', newImagenes);
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
                    <h3 className="text-lg font-bold text-ufaal-text">Catálogo de Fotos</h3>
                    <button onClick={addImagen} className="flex items-center gap-2 bg-ufaal-blue/10 text-ufaal-blue px-4 py-2 rounded-lg font-medium">
                        <Plus className="w-4 h-4" /> Agregar Imagen
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.imagenes.map((imagen: any, idx: number) => (
                        <div key={imagen.id} className="bg-white border rounded-xl p-6 shadow-sm relative">
                            <button onClick={() => removeImagen(idx)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg z-10 bg-white shadow-sm border">
                                <Trash2 className="w-4 h-4" />
                            </button>
                            
                            <ImageUpload 
                                label={`Foto ${idx + 1}`} 
                                currentImage={imagen.url} 
                                onUploadSuccess={(url) => handleImagenChange(idx, 'url', url)} 
                            />
                            
                            <div className="space-y-3 mt-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Título de la foto</label>
                                    <input type="text" value={imagen.titulo} onChange={(e) => handleImagenChange(idx, 'titulo', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Categoría</label>
                                    <select value={imagen.categoria} onChange={(e) => handleImagenChange(idx, 'categoria', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm bg-white">
                                        <option value="formacion">Formación</option>
                                        <option value="eventos">Eventos</option>
                                        <option value="investigacion">Investigación</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
