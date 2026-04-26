import { Plus, Trash2 } from 'lucide-react';
import { ImageUpload } from '../ImageUpload';
import { FileUpload } from '../FileUpload';

interface ActividadesFormProps {
    data: any;
    onChange: (data: any) => void;
}

export function ActividadesForm({ data, onChange }: ActividadesFormProps) {
    if (!data) return null;
    const items = data.items || [];

    const handleChange = (field: string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        handleChange('items', newItems);
    };

    const addItem = () => {
        handleChange('items', [
            ...items,
            {
                id: Date.now(),
                titulo: '',
                categoria: '',
                descripcion: '',
                fecha: '',
                pais: '',
                impacto: '',
                estado: 'programada',
                url_registro: '',
                imagen: '',
                archivos_adjuntos: []
            }
        ]);
    };

    const removeItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        handleChange('items', newItems);
    };

    const addAdjunto = (index: number) => {
        const item = items[index];
        const adjuntos = item.archivos_adjuntos || [];
        handleItemChange(index, 'archivos_adjuntos', [
            ...adjuntos,
            { id: Date.now(), nombre: '', url: '' }
        ]);
    };

    const updateAdjunto = (itemIdx: number, adjIdx: number, field: string, value: string) => {
        const item = items[itemIdx];
        const adjuntos = [...(item.archivos_adjuntos || [])];
        adjuntos[adjIdx] = { ...adjuntos[adjIdx], [field]: value };
        handleItemChange(itemIdx, 'archivos_adjuntos', adjuntos);
    };

    const removeAdjunto = (itemIdx: number, adjIdx: number) => {
        const item = items[itemIdx];
        const adjuntos = [...(item.archivos_adjuntos || [])];
        adjuntos.splice(adjIdx, 1);
        handleItemChange(itemIdx, 'archivos_adjuntos', adjuntos);
    };

    const ESTADOS = ['programada', 'en curso', 'finalizada', 'cancelada'];

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
                        Lista de Actividades
                        <span className="ml-2 text-sm font-normal text-gray-400">({items.length})</span>
                    </h3>
                    <button
                        onClick={addItem}
                        className="flex items-center gap-2 bg-ufaal-blue/10 text-ufaal-blue px-4 py-2 rounded-lg font-medium hover:bg-ufaal-blue/20 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Agregar Actividad
                    </button>
                </div>

                <div className="space-y-6">
                    {items.map((item: any, idx: number) => (
                        <div key={item.id || idx} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-ufaal-blue uppercase bg-ufaal-blue/10 px-3 py-1 rounded-full">
                                        Actividad #{idx + 1}
                                    </span>
                                    <select
                                        value={item.estado || 'programada'}
                                        onChange={(e) => handleItemChange(idx, 'estado', e.target.value)}
                                        className="text-xs font-bold border border-gray-200 rounded-full px-3 py-1 bg-white outline-none cursor-pointer"
                                    >
                                        {ESTADOS.map(e => (
                                            <option key={e} value={e}>
                                                {e.charAt(0).toUpperCase() + e.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={() => removeItem(idx)}
                                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Imagen + datos cortos */}
                                <div className="space-y-4">
                                    <ImageUpload
                                        label="Imagen de Actividad"
                                        currentImage={item.imagen || ''}
                                        onUploadSuccess={(url) => handleItemChange(idx, 'imagen', url)}
                                    />
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">País</label>
                                        <input
                                            type="text"
                                            value={item.pais || ''}
                                            onChange={(e) => handleItemChange(idx, 'pais', e.target.value)}
                                            className="w-full border border-gray-200 rounded p-2 text-sm"
                                            placeholder="Ej. Argentina"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Impacto</label>
                                        <input
                                            type="text"
                                            value={item.impacto || ''}
                                            onChange={(e) => handleItemChange(idx, 'impacto', e.target.value)}
                                            className="w-full border border-gray-200 rounded p-2 text-sm"
                                            placeholder="Ej. 100+ asistentes"
                                        />
                                    </div>
                                </div>

                                {/* Campos principales */}
                                <div className="md:col-span-2 space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Título</label>
                                        <input
                                            type="text"
                                            value={item.titulo || ''}
                                            onChange={(e) => handleItemChange(idx, 'titulo', e.target.value)}
                                            className="w-full border border-gray-200 rounded p-2 text-sm font-bold"
                                            placeholder="Nombre de la actividad"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Categoría</label>
                                            <input
                                                type="text"
                                                value={item.categoria || ''}
                                                onChange={(e) => handleItemChange(idx, 'categoria', e.target.value)}
                                                className="w-full border border-gray-200 rounded p-2 text-sm"
                                                placeholder="Ej. Congreso, Taller"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Fecha / Periodicidad</label>
                                            <input
                                                type="text"
                                                value={item.fecha || ''}
                                                onChange={(e) => handleItemChange(idx, 'fecha', e.target.value)}
                                                className="w-full border border-gray-200 rounded p-2 text-sm"
                                                placeholder="Ej. 15 Jun 2025 / Anual"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Descripción</label>
                                        <textarea
                                            value={item.descripcion || ''}
                                            onChange={(e) => handleItemChange(idx, 'descripcion', e.target.value)}
                                            className="w-full border border-gray-200 rounded p-2 text-sm h-28 resize-none"
                                            placeholder="Descripción detallada de la actividad"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Enlace de Registro / Más Info (Opcional)</label>
                                        <input
                                            type="url"
                                            value={item.url_registro || ''}
                                            onChange={(e) => handleItemChange(idx, 'url_registro', e.target.value)}
                                            className="w-full border border-gray-200 rounded p-2 text-sm"
                                            placeholder="https://..."
                                        />
                                    </div>

                                    {/* Archivos adjuntos */}
                                    <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Archivos Adjuntos (Programa, Formularios)</label>
                                            <button
                                                onClick={() => addAdjunto(idx)}
                                                className="flex items-center gap-1 text-xs text-ufaal-blue font-bold hover:underline"
                                            >
                                                <Plus className="w-3 h-3" /> Agregar archivo
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {(item.archivos_adjuntos || []).map((adj: any, adjIdx: number) => (
                                                <div key={adj.id || adjIdx} className="flex flex-col sm:flex-row gap-2 items-start bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                                    <div className="flex-1 w-full space-y-2">
                                                        <input
                                                            type="text"
                                                            value={adj.nombre || ''}
                                                            onChange={(e) => updateAdjunto(idx, adjIdx, 'nombre', e.target.value)}
                                                            className="w-full border border-gray-200 rounded p-2 text-xs"
                                                            placeholder="Nombre del archivo (Ej: Programa oficial)"
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
                                                        className="self-end sm:self-start text-red-400 hover:text-red-600 p-1 bg-red-50 rounded-md transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            {(item.archivos_adjuntos || []).length === 0 && (
                                                <p className="text-xs text-gray-400 text-center py-2">Sin archivos adjuntos</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {items.length === 0 && (
                        <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                            <p className="font-medium">Sin actividades aún</p>
                            <p className="text-sm mt-1">Haz click en "Agregar Actividad" para comenzar</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
