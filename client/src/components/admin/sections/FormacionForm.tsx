import { Plus, Trash2 } from 'lucide-react';
import { ImageUpload } from '../ImageUpload';

interface FormacionFormProps {
    data: any;
    onChange: (data: any) => void;
}

export function FormacionForm({ data, onChange }: FormacionFormProps) {
    if (!data) return null;
    const niveles = data.niveles || [];

    const handleChange = (field: string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const handleNivelChange = (index: number, field: string, value: any) => {
        const newNiveles = [...niveles];
        newNiveles[index] = { ...newNiveles[index], [field]: value };
        handleChange('niveles', newNiveles);
    };

    const addNivel = () => {
        const id = "nuevo_" + Date.now();
        const newNiveles = [...niveles, { id, titulo: "", descripcion: "", duracion: "", requisitos: "", icono: "book", imagen: "", enlace: "" }];
        handleChange('niveles', newNiveles);
    };

    const removeNivel = (index: number) => {
        const newNiveles = [...niveles];
        newNiveles.splice(index, 1);
        handleChange('niveles', newNiveles);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Título</label>
                    <input type="text" value={data.titulo || ''} onChange={(e) => handleChange('titulo', e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 outline-none" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Descripción</label>
                    <input type="text" value={data.descripcion || ''} onChange={(e) => handleChange('descripcion', e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 outline-none" />
                </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-ufaal-text">Niveles de Formación</h3>
                    <button onClick={addNivel} className="flex items-center gap-2 bg-ufaal-blue/10 text-ufaal-blue px-4 py-2 rounded-lg font-medium">
                        <Plus className="w-4 h-4" /> Agregar Nivel
                    </button>
                </div>

                <div className="space-y-4">
                    {niveles.map((nivel: any, idx: number) => (
                        <div key={nivel.id} className="bg-gray-50 border rounded-xl p-4 flex gap-4">
                            <div className="w-full sm:w-1/3 space-y-4">
                                <ImageUpload 
                                    label="Imagen Representativa" 
                                    currentImage={nivel.imagen} 
                                    onUploadSuccess={(url) => handleNivelChange(idx, 'imagen', url)} 
                                />
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Icono (laptop, award, book, landmark)</label>
                                    <input type="text" value={nivel.icono || ''} onChange={(e) => handleNivelChange(idx, 'icono', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm" placeholder="Ej. laptop" />
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Título del Nivel</label>
                                    <input type="text" value={nivel.titulo || ''} onChange={(e) => handleNivelChange(idx, 'titulo', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm font-bold" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Duración</label>
                                        <input type="text" value={nivel.duracion || ''} onChange={(e) => handleNivelChange(idx, 'duracion', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Requisitos</label>
                                        <input type="text" value={nivel.requisitos || ''} onChange={(e) => handleNivelChange(idx, 'requisitos', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Enlace de Registro/Información</label>
                                        <input type="text" value={nivel.enlace || ''} onChange={(e) => handleNivelChange(idx, 'enlace', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm" placeholder="https://..." />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Descripción</label>
                                    <textarea value={nivel.descripcion || ''} onChange={(e) => handleNivelChange(idx, 'descripcion', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm h-16" />
                                </div>
                            </div>
                            <button onClick={() => removeNivel(idx)} className="self-center p-3 text-red-500 hover:bg-red-100 rounded-lg">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
