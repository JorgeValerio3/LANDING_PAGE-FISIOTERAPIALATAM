interface HeroFormProps {
    data: any;
    onChange: (data: any) => void;
}

export function HeroForm({ data, onChange }: HeroFormProps) {
    const handleChange = (field: string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const handleStatChange = (index: number, field: string, value: string) => {
        const newStats = [...data.estadisticas];
        newStats[index] = { ...newStats[index], [field]: value };
        handleChange('estadisticas', newStats);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Título Principal</label>
                    <input 
                        type="text" 
                        value={data.titulo_principal} 
                        onChange={(e) => handleChange('titulo_principal', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-ufaal-blue/30 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Subtítulo</label>
                    <input 
                        type="text" 
                        value={data.subtitulo} 
                        onChange={(e) => handleChange('subtitulo', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-ufaal-blue/30 outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Descripción</label>
                <textarea 
                    value={data.descripcion} 
                    onChange={(e) => handleChange('descripcion', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 h-24 focus:ring-2 focus:ring-ufaal-blue/30 outline-none"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                     <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Texto Botón Primario</label>
                     <input type="text" value={data.cta_primario} onChange={(e) => handleChange('cta_primario', e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 outline-none" />
                </div>
                <div>
                     <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Texto Botón Secundario</label>
                     <input type="text" value={data.cta_secundario} onChange={(e) => handleChange('cta_secundario', e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 outline-none" />
                </div>
                <div>
                     <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">ID del Video YouTube (Ej: 8zR4z8C5XjU)</label>
                     <input type="text" value={data.video_id} onChange={(e) => handleChange('video_id', e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 outline-none" />
                </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-700 mb-4">Estadísticas Principales</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.estadisticas.map((stat: any, idx: number) => (
                        <div key={idx} className="bg-gray-50 p-4 border border-gray-100 rounded-lg">
                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Valor</label>
                            <input type="text" value={stat.valor} onChange={(e) => handleStatChange(idx, 'valor', e.target.value)} className="w-full mb-3 border border-gray-200 rounded p-2 text-sm" />
                            
                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Etiqueta</label>
                            <input type="text" value={stat.etiqueta} onChange={(e) => handleStatChange(idx, 'etiqueta', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
