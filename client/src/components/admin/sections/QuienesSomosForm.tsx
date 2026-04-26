import { ImageUpload } from '../ImageUpload';
import { Target, Eye, Heart, Users, Plus, Trash2 } from 'lucide-react';

interface QuienesSomosFormProps {
    data: any;
    onChange: (data: any) => void;
}

const iconOptions = ['Globe', 'TestTube', 'ShieldCheck', 'Lightbulb', 'HandHeart', 'Users'];

export function QuienesSomosForm({ data, onChange }: QuienesSomosFormProps) {
    if (!data) return null;

    const handleChange = (field: string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const handleFilosofiaChange = (field: string, value: any) => {
        handleChange('filosofia', { ...data.filosofia, [field]: value });
    };

    const handleValoresChange = (field: string, value: any) => {
        handleChange('valores', { ...data.valores, [field]: value });
    };

    const updateValorItem = (index: number, field: string, value: any) => {
        const newItems = [...(data.valores?.items || [])];
        newItems[index] = { ...newItems[index], [field]: value };
        handleValoresChange('items', newItems);
    };

    const addValorItem = () => {
        const newItems = [...(data.valores?.items || []), { titulo: '', descripcion: '', icono: 'Heart' }];
        handleValoresChange('items', newItems);
    };

    const removeValorItem = (index: number) => {
        const newItems = data.valores?.items.filter((_: any, i: number) => i !== index);
        handleValoresChange('items', newItems);
    };

    return (
        <div className="space-y-10">
            {/* Cabecera Principal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Título Sección</label>
                    <input
                        type="text"
                        value={data.titulo}
                        onChange={(e) => handleChange('titulo', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-ufaal-blue/30 outline-none transition-all"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Descripción Principal</label>
                    <textarea
                        value={data.descripcion}
                        onChange={(e) => handleChange('descripcion', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 h-24 focus:ring-2 focus:ring-ufaal-blue/30 outline-none transition-all"
                    />
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* Filosofía */}
            <div className="bg-blue-50/30 p-6 rounded-2xl border border-blue-100/50">
                <div className="flex items-center gap-2 mb-6 text-ufaal-blue">
                    <Heart className="w-5 h-5" />
                    <h3 className="font-bold uppercase text-sm tracking-wider">Filosofía Institucional</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Título Filosofía</label>
                        <input
                            type="text"
                            value={data.filosofia?.titulo}
                            onChange={(e) => handleFilosofiaChange('titulo', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg p-3 bg-white focus:ring-2 focus:ring-ufaal-blue/30 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Contenido Filosofía</label>
                        <textarea
                            value={data.filosofia?.contenido}
                            onChange={(e) => handleFilosofiaChange('contenido', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg p-3 bg-white h-48 focus:ring-2 focus:ring-ufaal-blue/30 outline-none"
                        />
                        <p className="text-[10px] text-gray-400 mt-2">Separa los párrafos con dos saltos de línea (\n\n) para que se vean correctamente en la UI.</p>
                    </div>
                </div>
            </div>

            {/* Misión y Visión */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                    <div className="flex items-center gap-2 mb-4 text-slate-800">
                        <Target className="w-5 h-5" />
                        <h3 className="font-bold uppercase text-sm tracking-wider">Misión</h3>
                    </div>
                    <textarea
                        value={data.mision}
                        onChange={(e) => handleChange('mision', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-3 bg-white h-32 focus:ring-2 focus:ring-ufaal-blue/30 outline-none"
                    />
                </div>
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                    <div className="flex items-center gap-2 mb-4 text-slate-800">
                        <Eye className="w-5 h-5" />
                        <h3 className="font-bold uppercase text-sm tracking-wider">Visión</h3>
                    </div>
                    <textarea
                        value={data.vision}
                        onChange={(e) => handleChange('vision', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-3 bg-white h-32 focus:ring-2 focus:ring-ufaal-blue/30 outline-none"
                    />
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* Valores */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-ufaal-blue">
                        <Users className="w-5 h-5" />
                        <h3 className="font-bold uppercase text-sm tracking-wider">Gestión de Valores</h3>
                    </div>
                    <button
                        onClick={addValorItem}
                        className="flex items-center gap-2 text-xs font-bold bg-ufaal-blue text-white px-4 py-2 rounded-full hover:bg-ufaal-blue-dark transition-all"
                    >
                        <Plus className="w-3 h-3" /> Agregar Valor
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(data.valores?.items || []).map((item: any, index: number) => (
                        <div key={index} className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm relative group">
                            <button
                                onClick={() => removeValorItem(index)}
                                className="absolute top-2 right-2 p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Título</label>
                                    <input
                                        type="text"
                                        value={item.titulo || ''}
                                        onChange={(e) => updateValorItem(index, 'titulo', e.target.value)}
                                        className="w-full text-sm border border-gray-100 rounded-lg p-2 bg-gray-50 focus:border-ufaal-blue outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Icono</label>
                                    <select
                                        value={item.icono || 'Heart'}
                                        onChange={(e) => updateValorItem(index, 'icono', e.target.value)}
                                        className="w-full text-sm border border-gray-100 rounded-lg p-2 bg-gray-50 focus:border-ufaal-blue outline-none"
                                    >
                                        {iconOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Descripción</label>
                                    <textarea
                                        value={item.descripcion || ''}
                                        onChange={(e) => updateValorItem(index, 'descripcion', e.target.value)}
                                        className="w-full text-sm border border-gray-100 rounded-lg p-2 bg-gray-50 h-20 focus:border-ufaal-blue outline-none resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <hr className="border-gray-100" />

            <div>
                <ImageUpload
                    label="Imagen de Fondo / Portada"
                    currentImage={data.imagen_destacada}
                    onUploadSuccess={(url) => handleChange('imagen_destacada', url)}
                />
            </div>
        </div>
    );
}
