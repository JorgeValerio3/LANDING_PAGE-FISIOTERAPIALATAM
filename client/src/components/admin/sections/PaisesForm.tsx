import { Plus, Trash2, MapPin, User, Mail, Image as ImageIcon } from 'lucide-react';
import { ImageUpload } from '../ImageUpload';

interface PaisesFormProps {
    data: any;
    onChange: (data: any) => void;
}

export function PaisesForm({ data, onChange }: PaisesFormProps) {
    if (!data) return null;

    const handleChange = (field: string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const handlePaisChange = (index: number, field: string, value: any) => {
        const newPaises = [...(data.paises_lista || [])];
        newPaises[index] = { ...newPaises[index], [field]: value };
        handleChange('paises_lista', newPaises);
    };

    const addPais = () => {
        const newPaises = [...(data.paises_lista || []), {
            id: "",
            nombre: "",
            latitud: 0,
            longitud: 0,
            representante: "",
            cargo: "Delegado Nacional",
            contacto: "",
            imagen: "",
            galeria: []
        }];
        handleChange('paises_lista', newPaises);
    };

    const removePais = (index: number) => {
        const newPaises = data.paises_lista.filter((_: any, i: number) => i !== index);
        handleChange('paises_lista', newPaises);
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Título de Sección</label>
                    <input 
                        type="text" 
                        value={data.titulo} 
                        onChange={(e) => handleChange('titulo', e.target.value)} 
                        className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-ufaal-blue/20 outline-none transition-all" 
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Subtítulo / Descripción</label>
                    <input 
                        type="text" 
                        value={data.descripcion} 
                        onChange={(e) => handleChange('descripcion', e.target.value)} 
                        className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-ufaal-blue/20 outline-none transition-all" 
                    />
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2 text-ufaal-text">
                        <MapPin className="w-5 h-5 text-ufaal-blue" />
                        <h3 className="text-lg font-bold">Gestión de Países Miembros</h3>
                    </div>
                    <button 
                        onClick={addPais} 
                        className="flex items-center gap-2 bg-ufaal-blue text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md hover:bg-ufaal-blue-dark transition-all"
                    >
                        <Plus className="w-4 h-4" /> Agregar País
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {(data.paises_lista || []).map((pais: any, idx: number) => (
                        <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative group hover:shadow-md transition-all">
                            <button 
                                onClick={() => removePais(idx)} 
                                className="absolute top-4 right-4 text-red-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Datos del País */}
                                <div className="lg:col-span-4 space-y-4">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Información Geográfica</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="col-span-1">
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">ISO (ar, br...)</label>
                                            <input type="text" value={pais.id} onChange={(e) => handlePaisChange(idx, 'id', e.target.value)} className="w-full border border-gray-100 rounded-lg p-2 text-sm bg-gray-50 focus:bg-white focus:border-ufaal-blue outline-none transition-all" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Nombre País</label>
                                            <input type="text" value={pais.nombre} onChange={(e) => handlePaisChange(idx, 'nombre', e.target.value)} className="w-full border border-gray-100 rounded-lg p-2 text-sm bg-gray-50 focus:bg-white focus:border-ufaal-blue outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Latitud</label>
                                            <input type="number" step="any" value={pais.latitud} onChange={(e) => handlePaisChange(idx, 'latitud', parseFloat(e.target.value))} className="w-full border border-gray-100 rounded-lg p-2 text-sm bg-gray-50 focus:bg-white focus:border-ufaal-blue outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Longitud</label>
                                            <input type="number" step="any" value={pais.longitud} onChange={(e) => handlePaisChange(idx, 'longitud', parseFloat(e.target.value))} className="w-full border border-gray-100 rounded-lg p-2 text-sm bg-gray-50 focus:bg-white focus:border-ufaal-blue outline-none transition-all" />
                                        </div>
                                    </div>
                                </div>

                                {/* Representante */}
                                <div className="lg:col-span-12 xl:col-span-5 space-y-4 pt-1 lg:pt-0">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <User className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Delegado Nacional</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Nombre Completo</label>
                                            <input type="text" value={pais.representante} onChange={(e) => handlePaisChange(idx, 'representante', e.target.value)} className="w-full border border-gray-100 rounded-lg p-2 text-sm bg-gray-50 focus:bg-white focus:border-ufaal-blue outline-none transition-all font-medium" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Cargo / Título</label>
                                                <input type="text" value={pais.cargo} onChange={(e) => handlePaisChange(idx, 'cargo', e.target.value)} className="w-full border border-gray-100 rounded-lg p-2 text-sm bg-gray-50 focus:bg-white focus:border-ufaal-blue outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Contacto (Email)</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
                                                    <input type="email" value={pais.contacto} onChange={(e) => handlePaisChange(idx, 'contacto', e.target.value)} className="w-full border border-gray-100 rounded-lg p-2 pl-8 text-sm bg-gray-50 focus:bg-white focus:border-ufaal-blue outline-none transition-all" placeholder="ejemplo@mail.com" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Descripción del País / Delegación</label>
                                            <textarea 
                                                value={pais.descripcion || ""} 
                                                onChange={(e) => handlePaisChange(idx, 'descripcion', e.target.value)} 
                                                className="w-full border border-gray-100 rounded-lg p-2 text-sm bg-gray-50 focus:bg-white focus:border-ufaal-blue outline-none transition-all h-20 resize-none"
                                                placeholder="Breve reseña sobre la fisioterapia acuática en este país..."
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Imagen */}
                                <div className="lg:col-span-12 xl:col-span-3">
                                    <div className="flex items-center justify-between gap-2 text-gray-400 mb-3">
                                        <div className="flex items-center gap-2">
                                            <ImageIcon className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Imagen Perfil</span>
                                        </div>
                                        {pais.imagen && (
                                            <button 
                                                onClick={() => handlePaisChange(idx, 'imagen', '')}
                                                className="text-[10px] text-red-400 hover:text-red-500 font-bold uppercase tracking-tighter"
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </div>
                                    <ImageUpload 
                                        label="" 
                                        currentImage={pais.imagen} 
                                        onUploadSuccess={(url) => handlePaisChange(idx, 'imagen', url)} 
                                    />
                                </div>
                            </div>

                            {/* Galería dinámica sin límite */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <div className="flex items-center justify-between gap-2 mb-6">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Plus className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Galería de Actividades</span>
                                        <span className="text-[10px] text-gray-300">({(pais.galeria || []).filter(Boolean).length} foto{(pais.galeria || []).filter(Boolean).length !== 1 ? 's' : ''})</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const newGaleria = [...(pais.galeria || []), ''];
                                            handlePaisChange(idx, 'galeria', newGaleria);
                                        }}
                                        className="flex items-center gap-1 text-[9px] text-ufaal-blue hover:text-ufaal-blue-dark font-bold uppercase tracking-wide"
                                    >
                                        <Plus className="w-3 h-3" /> Agregar foto
                                    </button>
                                </div>
                                {(pais.galeria || []).length === 0 ? (
                                    <div className="text-center py-6 text-gray-300 border-2 border-dashed border-gray-100 rounded-xl text-xs">
                                        Sin fotos. Haz clic en "Agregar foto".
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {(pais.galeria || []).map((imgUrl: string, slotIdx: number) => (
                                            <div key={slotIdx} className="space-y-2">
                                                <div className="flex justify-between items-center px-1">
                                                    <span className="text-[9px] font-bold text-gray-300 uppercase">Foto {slotIdx + 1}</span>
                                                    <button
                                                        onClick={() => {
                                                            const newGaleria = [...(pais.galeria || [])];
                                                            newGaleria.splice(slotIdx, 1);
                                                            handlePaisChange(idx, 'galeria', newGaleria);
                                                        }}
                                                        className="text-[9px] text-red-300 hover:text-red-500 font-bold uppercase"
                                                    >
                                                        Quitar
                                                    </button>
                                                </div>
                                                <ImageUpload
                                                    label=""
                                                    currentImage={imgUrl}
                                                    onUploadSuccess={(url) => {
                                                        const newGaleria = [...(pais.galeria || [])];
                                                        newGaleria[slotIdx] = url;
                                                        handlePaisChange(idx, 'galeria', newGaleria);
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
