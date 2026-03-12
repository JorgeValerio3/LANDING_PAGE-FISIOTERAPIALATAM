import { Plus, Trash2 } from 'lucide-react';
import { ImageUpload } from '../ImageUpload';

interface ActividadesFormProps {
    data: any;
    onChange: (data: any) => void;
}

export function ActividadesForm({ data, onChange }: ActividadesFormProps) {
    const handleChange = (field: string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        handleChange('items', newItems);
    };

    const addItem = () => {
        const id = Date.now();
        const newItems = [...data.items, { id, titulo: "", categoria: "", descripcion: "", fecha: "", pais: "", impacto: "", imagen: "" }];
        handleChange('items', newItems);
    };

    const removeItem = (index: number) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        handleChange('items', newItems);
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
                    <h3 className="text-lg font-bold text-ufaal-text">Lista de Actividades</h3>
                    <button onClick={addItem} className="flex items-center gap-2 bg-ufaal-blue/10 text-ufaal-blue px-4 py-2 rounded-lg font-medium">
                        <Plus className="w-4 h-4" /> Agregar Actividad
                    </button>
                </div>

                <div className="space-y-4">
                    {data.items.map((item: any, idx: number) => (
                        <div key={item.id} className="bg-gray-50 border rounded-xl p-4 flex gap-4">
                            <div className="w-full sm:w-1/3 space-y-4">
                                <ImageUpload 
                                    label="Imagen de Actividad" 
                                    currentImage={item.imagen} 
                                    onUploadSuccess={(url) => handleItemChange(idx, 'imagen', url)} 
                                />
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">País</label>
                                    <input type="text" value={item.pais} onChange={(e) => handleItemChange(idx, 'pais', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm" placeholder="Ej. Argentina" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Impacto</label>
                                    <input type="text" value={item.impacto} onChange={(e) => handleItemChange(idx, 'impacto', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm" placeholder="Ej. 100+ asistentes" />
                                </div>
                            </div>
                            <div className="flex-1 grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Título</label>
                                    <input type="text" value={item.titulo} onChange={(e) => handleItemChange(idx, 'titulo', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm font-bold" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Categoría</label>
                                        <input type="text" value={item.categoria} onChange={(e) => handleItemChange(idx, 'categoria', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Fecha/Periodicidad</label>
                                        <input type="text" value={item.fecha} onChange={(e) => handleItemChange(idx, 'fecha', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Descripción</label>
                                    <textarea value={item.descripcion} onChange={(e) => handleItemChange(idx, 'descripcion', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm h-32" />
                                </div>
                            </div>
                            <button onClick={() => removeItem(idx)} className="self-center p-3 text-red-500 hover:bg-red-100 rounded-lg">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
