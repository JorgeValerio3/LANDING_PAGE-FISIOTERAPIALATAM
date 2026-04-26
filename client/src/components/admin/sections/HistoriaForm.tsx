import { Plus, Trash2 } from 'lucide-react';
import { ImageUpload } from '../ImageUpload';

interface HistoriaFormProps {
    data: any;
    onChange: (data: any) => void;
}

export function HistoriaForm({ data, onChange }: HistoriaFormProps) {
    if (!data) return null;

    const parrafos = Array.isArray(data.descripcion) ? data.descripcion : [];

    const handleChange = (field: string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const handleParrafoChange = (idx: number, value: string) => {
        const updated = [...parrafos];
        updated[idx] = value;
        handleChange('descripcion', updated);
    };

    const addParrafo = () => handleChange('descripcion', [...parrafos, '']);

    const removeParrafo = (idx: number) => {
        const updated = [...parrafos];
        updated.splice(idx, 1);
        handleChange('descripcion', updated);
    };

    const moveParrafo = (idx: number, dir: -1 | 1) => {
        const updated = [...parrafos];
        const target = idx + dir;
        if (target < 0 || target >= updated.length) return;
        [updated[idx], updated[target]] = [updated[target], updated[idx]];
        handleChange('descripcion', updated);
    };

    return (
        <div className="space-y-6">
            {/* Encabezados */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Título</label>
                    <input
                        type="text"
                        value={data.titulo || ''}
                        onChange={(e) => handleChange('titulo', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Subtítulo</label>
                    <input
                        type="text"
                        value={data.subtitulo || ''}
                        onChange={(e) => handleChange('subtitulo', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 outline-none"
                    />
                </div>
            </div>

            {/* Imagen */}
            <div className="max-w-xs">
                <ImageUpload
                    label="Imagen de Historia"
                    currentImage={data.imagen || ''}
                    onUploadSuccess={(url) => handleChange('imagen', url)}
                />
            </div>

            {/* Párrafos */}
            <div className="border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-ufaal-text">
                        Párrafos del Relato
                        <span className="ml-2 text-sm font-normal text-gray-400">({parrafos.length})</span>
                    </h3>
                    <button onClick={addParrafo} className="flex items-center gap-2 bg-ufaal-blue/10 text-ufaal-blue px-4 py-2 rounded-lg font-medium hover:bg-ufaal-blue/20 transition-colors">
                        <Plus className="w-4 h-4" /> Agregar párrafo
                    </button>
                </div>
                <div className="space-y-3">
                    {parrafos.map((parrafo: string, idx: number) => (
                        <div key={idx} className="flex gap-3 items-start">
                            <div className="flex flex-col gap-1 pt-2">
                                <button onClick={() => moveParrafo(idx, -1)} disabled={idx === 0} className="text-gray-300 hover:text-gray-500 disabled:opacity-30 text-xs font-bold leading-none">▲</button>
                                <span className="text-[10px] font-bold text-gray-400 text-center">{idx + 1}</span>
                                <button onClick={() => moveParrafo(idx, 1)} disabled={idx === parrafos.length - 1} className="text-gray-300 hover:text-gray-500 disabled:opacity-30 text-xs font-bold leading-none">▼</button>
                            </div>
                            <textarea
                                value={parrafo}
                                onChange={(e) => handleParrafoChange(idx, e.target.value)}
                                className="flex-1 border border-gray-200 rounded-lg p-3 text-sm h-24 resize-none focus:ring-2 focus:ring-ufaal-blue/20 outline-none"
                                placeholder={`Párrafo ${idx + 1} de la historia...`}
                            />
                            <button onClick={() => removeParrafo(idx)} className="mt-2 text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {parrafos.length === 0 && (
                        <p className="text-xs text-gray-400 text-center py-4 border-2 border-dashed border-gray-200 rounded-xl">Sin párrafos. Haz click en "Agregar párrafo".</p>
                    )}
                </div>
            </div>
        </div>
    );
}
