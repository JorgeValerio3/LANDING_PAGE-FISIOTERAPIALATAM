import { Plus, Trash2 } from 'lucide-react';

interface OrganizacionFormProps {
    data: any;
    onChange: (data: any) => void;
}

export function OrganizacionForm({ data, onChange }: OrganizacionFormProps) {
    if (!data) return null;

    const secciones = data.secciones || [];

    const handleChange = (field: string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const handleSectionChange = (sectionIndex: number, field: string, value: any) => {
        const newSections = [...secciones];
        newSections[sectionIndex] = { ...newSections[sectionIndex], [field]: value };
        handleChange('secciones', newSections);
    };

    const handleMemberChange = (sectionIndex: number, memberIndex: number, field: string, value: string) => {
        const newSections = [...secciones];
        const newMembers = [...(newSections[sectionIndex].members || [])];
        newMembers[memberIndex] = { ...newMembers[memberIndex], [field]: value };
        newSections[sectionIndex] = { ...newSections[sectionIndex], members: newMembers };
        handleChange('secciones', newSections);
    };

    const addSection = () => {
        const id = Date.now();
        handleChange('secciones', [...secciones, { id, title: "", members: [] }]);
    };

    const removeSection = (index: number) => {
        const newSections = [...secciones];
        newSections.splice(index, 1);
        handleChange('secciones', newSections);
    };

    const addMember = (sectionIndex: number) => {
        const newSections = [...secciones];
        const members = [...(newSections[sectionIndex].members || [])];
        members.push({ id: Date.now(), name: "", role: "", country: "" });
        newSections[sectionIndex] = { ...newSections[sectionIndex], members };
        handleChange('secciones', newSections);
    };

    const removeMember = (sectionIndex: number, memberIndex: number) => {
        const newSections = [...secciones];
        const members = [...(newSections[sectionIndex].members || [])];
        members.splice(memberIndex, 1);
        newSections[sectionIndex] = { ...newSections[sectionIndex], members };
        handleChange('secciones', newSections);
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Título de la Sección</label>
                    <input
                        type="text"
                        value={data.titulo || ''}
                        onChange={(e) => handleChange('titulo', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-ufaal-blue/30 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Archivo PDF Estatutos</label>
                    <input
                        type="text"
                        value={data.estatutos_pdf || ''}
                        onChange={(e) => handleChange('estatutos_pdf', e.target.value)}
                        placeholder="/docs/archivo.pdf"
                        className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-ufaal-blue/30 outline-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">Coloque la URL o ruta del PDF (ej. /docs/...) </p>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Descripción</label>
                <textarea
                    value={data.descripcion || ''}
                    onChange={(e) => handleChange('descripcion', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 h-24 focus:ring-2 focus:ring-ufaal-blue/30 outline-none"
                />
            </div>

            <div className="border-t border-gray-100 pt-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-ufaal-text">Bloques Organizativos</h3>
                    <button 
                        onClick={addSection}
                        className="flex items-center gap-2 bg-ufaal-blue/10 text-ufaal-blue px-4 py-2 rounded-lg font-medium hover:bg-ufaal-blue/20 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Agregar Bloque
                    </button>
                </div>

                <div className="space-y-8">
                    {secciones.map((section: any, sectionIdx: number) => (
                        <div key={section.id || sectionIdx} className="bg-white border rounded-xl p-6 shadow-sm relative">
                            <button 
                                onClick={() => removeSection(sectionIdx)}
                                className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg"
                                title="Eliminar bloque"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Nombre del Bloque</label>
                            <input
                                type="text"
                                value={section.title || ''}
                                onChange={(e) => handleSectionChange(sectionIdx, 'title', e.target.value)}
                                className="w-full sm:w-1/2 mb-6 border border-gray-200 rounded-lg p-3 bg-gray-50 font-bold"
                            />

                            <div className="space-y-4">
                                {(section.members || []).map((member: any, memberIdx: number) => (
                                    <div key={member.id || memberIdx} className="flex flex-col sm:flex-row gap-3 items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <input
                                            type="text"
                                            placeholder="Nombre"
                                            value={member.name || ''}
                                            onChange={(e) => handleMemberChange(sectionIdx, memberIdx, 'name', e.target.value)}
                                            className="flex-1 w-full border border-gray-200 rounded p-2 text-sm"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Cargo/Rol"
                                            value={member.role || ''}
                                            onChange={(e) => handleMemberChange(sectionIdx, memberIdx, 'role', e.target.value)}
                                            className="flex-1 w-full border border-gray-200 rounded p-2 text-sm"
                                        />
                                        <input
                                            type="text"
                                            placeholder="País (Opcional)"
                                            value={member.country || ''}
                                            onChange={(e) => handleMemberChange(sectionIdx, memberIdx, 'country', e.target.value)}
                                            className="w-full sm:w-32 border border-gray-200 rounded p-2 text-sm"
                                        />
                                        <button 
                                            onClick={() => removeMember(sectionIdx, memberIdx)}
                                            title="Eliminar miembro"
                                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            
                            <button 
                                onClick={() => addMember(sectionIdx)}
                                className="mt-4 flex items-center gap-2 text-sm font-medium text-ufaal-blue hover:text-ufaal-blue-light"
                            >
                                <Plus className="w-4 h-4" /> Agregar Miembro
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
