import { Plus, Trash2 } from 'lucide-react';
import { ImageUpload } from '../ImageUpload';

interface ColaboradoresFormProps {
    data: any;
    onChange: (data: any) => void;
}

export function ColaboradoresForm({ data, onChange }: ColaboradoresFormProps) {
    if (!data) return null;

    const logos = data.logos || [];

    const handleChange = (field: string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const handleLogoChange = (idx: number, field: string, value: string) => {
        const updated = [...logos];
        updated[idx] = { ...updated[idx], [field]: value };
        handleChange('logos', updated);
    };

    const addLogo = () => handleChange('logos', [...logos, { nombre: '', url: '', sitio_web: '' }]);

    const removeLogo = (idx: number) => {
        const updated = [...logos];
        updated.splice(idx, 1);
        handleChange('logos', updated);
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Título de Sección</label>
                <input
                    type="text"
                    value={data.titulo || ''}
                    onChange={(e) => handleChange('titulo', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 outline-none"
                    placeholder="Nuestros Aliados y Colaboradores"
                />
            </div>

            <div className="border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-ufaal-text">
                        Logos de Colaboradores
                        <span className="ml-2 text-sm font-normal text-gray-400">({logos.length})</span>
                    </h3>
                    <button onClick={addLogo} className="flex items-center gap-2 bg-ufaal-blue/10 text-ufaal-blue px-4 py-2 rounded-lg font-medium hover:bg-ufaal-blue/20 transition-colors">
                        <Plus className="w-4 h-4" /> Agregar colaborador
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {logos.map((logo: any, idx: number) => (
                        <div key={idx} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-xs font-bold text-ufaal-blue bg-ufaal-blue/10 px-2 py-1 rounded-full">#{idx + 1}</span>
                                <button onClick={() => removeLogo(idx)} className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Nombre</label>
                                    <input
                                        type="text"
                                        value={logo.nombre || ''}
                                        onChange={(e) => handleLogoChange(idx, 'nombre', e.target.value)}
                                        className="w-full border border-gray-200 rounded p-2 text-sm"
                                        placeholder="Nombre de la organización"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Sitio Web (Opcional)</label>
                                    <input
                                        type="url"
                                        value={logo.sitio_web || ''}
                                        onChange={(e) => handleLogoChange(idx, 'sitio_web', e.target.value)}
                                        className="w-full border border-gray-200 rounded p-2 text-sm"
                                        placeholder="https://..."
                                    />
                                </div>
                                <ImageUpload
                                    label="Logo"
                                    currentImage={logo.url || ''}
                                    onUploadSuccess={(url) => handleLogoChange(idx, 'url', url)}
                                />
                            </div>
                        </div>
                    ))}
                    {logos.length === 0 && (
                        <div className="col-span-2 text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                            Sin colaboradores. Haz click en "Agregar colaborador".
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
