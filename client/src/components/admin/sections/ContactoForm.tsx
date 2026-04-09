import { Plus, Trash2 } from 'lucide-react';

interface ContactoFormProps {
    data: any;
    onChange: (data: any) => void;
}

export function ContactoForm({ data, onChange }: ContactoFormProps) {
    const handleChange = (field: string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const handleRedLocalChange = (index: number, field: string, value: any) => {
        const newRedes = [...data.redes_locales];
        newRedes[index] = { ...newRedes[index], [field]: value };
        handleChange('redes_locales', newRedes);
    };

    const addRedLocal = () => {
        const newRedes = [...data.redes_locales, { pais: "", email_contacto: "", telefono: "" }];
        handleChange('redes_locales', newRedes);
    };

    const removeRedLocal = (index: number) => {
        const newRedes = [...data.redes_locales];
        newRedes.splice(index, 1);
        handleChange('redes_locales', newRedes);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Título</label>
                    <input type="text" value={data.titulo} onChange={(e) => handleChange('titulo', e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 outline-none" />
                </div>
                <div>
                     <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Descripción Corta</label>
                     <input type="text" value={data.texto_corto} onChange={(e) => handleChange('texto_corto', e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 outline-none" />
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
                 <h3 className="font-bold text-gray-700 text-sm">Información Principal (Sede)</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Email Central</label>
                          <input type="text" value={data.email_central} onChange={(e) => handleChange('email_central', e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm" />
                      </div>
                      <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Teléfono / WhatsApp</label>
                          <input type="text" value={data.telefono_principal} onChange={(e) => handleChange('telefono_principal', e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm" />
                      </div>
                      <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Dirección Física</label>
                          <input type="text" value={data.direccion} onChange={(e) => handleChange('direccion', e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm" />
                      </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                      <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">URL Facebook</label>
                          <input type="text" value={data.redes_sociales?.facebook} onChange={(e) => handleChange('redes_sociales', {...data.redes_sociales, facebook: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-sm" />
                      </div>
                      <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">URL Twitter</label>
                          <input type="text" value={data.redes_sociales?.twitter} onChange={(e) => handleChange('redes_sociales', {...data.redes_sociales, twitter: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-sm" />
                      </div>
                      <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">URL LinkedIn</label>
                          <input type="text" value={data.redes_sociales?.linkedin} onChange={(e) => handleChange('redes_sociales', {...data.redes_sociales, linkedin: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-sm" />
                      </div>
                 </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-ufaal-text">Redes o Contactos Locales por País</h3>
                    <button onClick={addRedLocal} className="flex items-center gap-2 bg-ufaal-blue/10 text-ufaal-blue px-4 py-2 rounded-lg font-medium">
                        <Plus className="w-4 h-4" /> Agregar País
                    </button>
                </div>

                <div className="space-y-4">
                    {data.redes_locales.map((red: any, idx: number) => (
                        <div key={idx} className="bg-white border rounded-xl p-4 flex gap-4">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">País</label>
                                    <input type="text" value={red.pais} onChange={(e) => handleRedLocalChange(idx, 'pais', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm font-bold" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Email Contacto</label>
                                    <input type="text" value={red.email_contacto} onChange={(e) => handleRedLocalChange(idx, 'email_contacto', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Teléfono</label>
                                    <input type="text" value={red.telefono} onChange={(e) => handleRedLocalChange(idx, 'telefono', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm" />
                                </div>
                            </div>
                            <button onClick={() => removeRedLocal(idx)} className="self-center p-3 text-red-500 hover:bg-red-100 rounded-lg">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
