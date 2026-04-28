import { Plus, Trash2 } from 'lucide-react';

interface FooterFormProps {
    data: any;
    onChange: (data: any) => void;
}

export function FooterForm({ data, onChange }: FooterFormProps) {
    if (!data) return null;

    const enlacesRapidos = data.enlaces_rapidos || [];
    const recursos = data.recursos || [];

    const handleChange = (field: string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const handleEnlaceChange = (idx: number, field: string, value: string) => {
        const updated = [...enlacesRapidos];
        updated[idx] = { ...updated[idx], [field]: value };
        handleChange('enlaces_rapidos', updated);
    };

    const addEnlace = () => handleChange('enlaces_rapidos', [...enlacesRapidos, { titulo: '', url: '' }]);
    const removeEnlace = (idx: number) => {
        const updated = [...enlacesRapidos];
        updated.splice(idx, 1);
        handleChange('enlaces_rapidos', updated);
    };

    const handleRecursoChange = (idx: number, field: string, value: string) => {
        const updated = [...recursos];
        updated[idx] = { ...updated[idx], [field]: value };
        handleChange('recursos', updated);
    };

    const addRecurso = () => handleChange('recursos', [...recursos, { titulo: '', url: '' }]);
    const removeRecurso = (idx: number) => {
        const updated = [...recursos];
        updated.splice(idx, 1);
        handleChange('recursos', updated);
    };

    return (
        <div className="space-y-6">
            {/* Descripción y copyright */}
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Descripción del Footer</label>
                    <textarea
                        value={data.descripcion || ''}
                        onChange={(e) => handleChange('descripcion', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 outline-none h-20 resize-none"
                        placeholder="Descripción breve de la organización para el pie de página"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Texto de Copyright</label>
                    <input
                        type="text"
                        value={data.copyright_text || ''}
                        onChange={(e) => handleChange('copyright_text', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 outline-none"
                        placeholder="© 2025 UFAAL. Todos los derechos reservados."
                    />
                </div>
            </div>

            {/* Enlaces Rápidos */}
            <div className="border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-ufaal-text">
                        Enlaces Rápidos
                        <span className="ml-2 text-sm font-normal text-gray-400">({enlacesRapidos.length})</span>
                    </h3>
                    <button onClick={addEnlace} className="flex items-center gap-2 bg-ufaal-blue/10 text-ufaal-blue px-4 py-2 rounded-lg font-medium hover:bg-ufaal-blue/20 transition-colors">
                        <Plus className="w-4 h-4" /> Agregar enlace
                    </button>
                </div>
                <div className="space-y-2">
                    {enlacesRapidos.map((enlace: any, idx: number) => (
                        <div key={idx} className="flex gap-3 items-center bg-gray-50 rounded-lg p-3 border border-gray-100">
                            <div className="flex-1 grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={enlace.titulo || ''}
                                    onChange={(e) => handleEnlaceChange(idx, 'titulo', e.target.value)}
                                    className="border border-gray-200 rounded p-2 text-sm"
                                    placeholder="Título (Ej: Quiénes Somos)"
                                />
                                <input
                                    type="text"
                                    value={enlace.url || ''}
                                    onChange={(e) => handleEnlaceChange(idx, 'url', e.target.value)}
                                    className="border border-gray-200 rounded p-2 text-sm"
                                    placeholder="URL (Ej: #/quienes-somos)"
                                />
                            </div>
                            <button onClick={() => removeEnlace(idx)} className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {enlacesRapidos.length === 0 && <p className="text-xs text-gray-400 text-center py-3 border-2 border-dashed border-gray-200 rounded-xl">Sin enlaces. Haz click en "Agregar enlace".</p>}
                </div>
            </div>

            {/* Recursos */}
            <div className="border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-ufaal-text">
                        Recursos / Legales
                        <span className="ml-2 text-sm font-normal text-gray-400">({recursos.length})</span>
                    </h3>
                    <button onClick={addRecurso} className="flex items-center gap-2 bg-ufaal-blue/10 text-ufaal-blue px-4 py-2 rounded-lg font-medium hover:bg-ufaal-blue/20 transition-colors">
                        <Plus className="w-4 h-4" /> Agregar recurso
                    </button>
                </div>
                <div className="space-y-2">
                    {recursos.map((recurso: any, idx: number) => (
                        <div key={idx} className="flex gap-3 items-center bg-gray-50 rounded-lg p-3 border border-gray-100">
                            <div className="flex-1 grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={recurso.titulo || ''}
                                    onChange={(e) => handleRecursoChange(idx, 'titulo', e.target.value)}
                                    className="border border-gray-200 rounded p-2 text-sm"
                                    placeholder="Título (Ej: Privacidad)"
                                />
                                <input
                                    type="text"
                                    value={recurso.url || ''}
                                    onChange={(e) => handleRecursoChange(idx, 'url', e.target.value)}
                                    className="border border-gray-200 rounded p-2 text-sm"
                                    placeholder="URL (Ej: #/privacidad)"
                                />
                            </div>
                            <button onClick={() => removeRecurso(idx)} className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {recursos.length === 0 && <p className="text-xs text-gray-400 text-center py-3 border-2 border-dashed border-gray-200 rounded-xl">Sin recursos. Haz click en "Agregar recurso".</p>}
                </div>
            </div>
        </div>
    );
}
