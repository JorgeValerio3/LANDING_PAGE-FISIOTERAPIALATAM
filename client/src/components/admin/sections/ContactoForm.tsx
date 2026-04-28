import { Plus, Trash2 } from 'lucide-react';

interface ContactoFormProps {
    data: any;
    onChange: (data: any) => void;
}

export function ContactoForm({ data, onChange }: ContactoFormProps) {
    if (!data) return null;

    const redes = data.redes_sociales || {};
    const redesLocales = data.redes_locales || [];

    const handleChange = (field: string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const handleRedSocialChange = (red: string, value: string) => {
        onChange({ ...data, redes_sociales: { ...redes, [red]: value } });
    };

    const handleRedLocalChange = (index: number, field: string, value: any) => {
        const updated = [...redesLocales];
        updated[index] = { ...updated[index], [field]: value };
        handleChange('redes_locales', updated);
    };

    const addRedLocal = () => {
        handleChange('redes_locales', [...redesLocales, { pais: '', email_contacto: '', telefono: '' }]);
    };

    const removeRedLocal = (index: number) => {
        const updated = [...redesLocales];
        updated.splice(index, 1);
        handleChange('redes_locales', updated);
    };

    return (
        <div className="space-y-6">
            {/* Campos principales */}
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
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Descripción</label>
                    <input
                        type="text"
                        value={data.descripcion || ''}
                        onChange={(e) => handleChange('descripcion', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 outline-none"
                    />
                </div>
            </div>

            {/* Información de contacto sede */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
                <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Información Principal (Sede)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Email</label>
                        <input
                            type="email"
                            value={data.email || ''}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 text-sm"
                            placeholder="contacto@ufaal.org"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Teléfono / WhatsApp</label>
                        <input
                            type="text"
                            value={data.telefono || ''}
                            onChange={(e) => handleChange('telefono', e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 text-sm"
                            placeholder="+1 (809) 000-0000"
                        />
                    </div>
                </div>

                {/* Redes sociales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Facebook</label>
                        <input
                            type="url"
                            value={redes.facebook || ''}
                            onChange={(e) => handleRedSocialChange('facebook', e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 text-sm"
                            placeholder="https://facebook.com/..."
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Instagram</label>
                        <input
                            type="url"
                            value={redes.instagram || ''}
                            onChange={(e) => handleRedSocialChange('instagram', e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 text-sm"
                            placeholder="https://instagram.com/..."
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">LinkedIn</label>
                        <input
                            type="url"
                            value={redes.linkedin || ''}
                            onChange={(e) => handleRedSocialChange('linkedin', e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 text-sm"
                            placeholder="https://linkedin.com/..."
                        />
                    </div>
                </div>
            </div>

            {/* Contactos locales por país */}
            <div className="border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-ufaal-text">
                        Contactos Locales por País
                        <span className="ml-2 text-sm font-normal text-gray-400">({redesLocales.length})</span>
                    </h3>
                    <button
                        onClick={addRedLocal}
                        className="flex items-center gap-2 bg-ufaal-blue/10 text-ufaal-blue px-4 py-2 rounded-lg font-medium hover:bg-ufaal-blue/20 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Agregar País
                    </button>
                </div>

                <div className="space-y-3">
                    {redesLocales.map((red: any, idx: number) => (
                        <div key={idx} className="bg-white border rounded-xl p-4 flex gap-4 items-center">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">País</label>
                                    <input
                                        type="text"
                                        value={red.pais || ''}
                                        onChange={(e) => handleRedLocalChange(idx, 'pais', e.target.value)}
                                        className="w-full border border-gray-200 rounded p-2 text-sm font-bold"
                                        placeholder="Ej. Argentina"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Email</label>
                                    <input
                                        type="text"
                                        value={red.email_contacto || ''}
                                        onChange={(e) => handleRedLocalChange(idx, 'email_contacto', e.target.value)}
                                        className="w-full border border-gray-200 rounded p-2 text-sm"
                                        placeholder="contacto@pais.org"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Teléfono</label>
                                    <input
                                        type="text"
                                        value={red.telefono || ''}
                                        onChange={(e) => handleRedLocalChange(idx, 'telefono', e.target.value)}
                                        className="w-full border border-gray-200 rounded p-2 text-sm"
                                        placeholder="+54 ..."
                                    />
                                </div>
                            </div>
                            <button
                                onClick={() => removeRedLocal(idx)}
                                className="p-3 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    {redesLocales.length === 0 && (
                        <p className="text-center text-gray-400 text-sm py-4 border-2 border-dashed border-gray-200 rounded-xl">
                            Sin contactos locales. Haz click en "Agregar País".
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
