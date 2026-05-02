import { Plus, Trash2, AlertTriangle, Download } from 'lucide-react';
import { ImageUpload } from '../ImageUpload';

interface GaleriaFormProps {
    data: any;
    onChange: (data: any) => void;
    baseImages?: any[]; // Imágenes de ES como referencia cuando se edita otro idioma
}

export function GaleriaForm({ data, onChange, baseImages }: GaleriaFormProps) {
    if (!data) return null;

    const imagenes = data.imagenes || [];

    const handleChange = (field: string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const handleImagenChange = (index: number, field: string, value: any) => {
        const newImagenes = [...imagenes];
        newImagenes[index] = { ...newImagenes[index], [field]: value };
        handleChange('imagenes', newImagenes);
    };

    const addImagen = () => {
        const id = Date.now();
        handleChange('imagenes', [...imagenes, { id, url: "", titulo: "", descripcion: "", categoria: "eventos" }]);
    };

    const removeImagen = (index: number) => {
        const newImagenes = [...imagenes];
        newImagenes.splice(index, 1);
        handleChange('imagenes', newImagenes);
    };

    // Detecta fotos del idioma base (ES) que faltan en el idioma actual
    const currentIds = new Set(imagenes.map((img: any) => img.id));
    const missingImages = (baseImages || []).filter((img: any) => !currentIds.has(img.id));

    const handleSyncFromBase = () => {
        if (!baseImages || missingImages.length === 0) return;
        handleChange('imagenes', [...imagenes, ...missingImages]);
    };

    return (
        <div className="space-y-6">

            {/* Banner: fotos faltantes del idioma base */}
            {baseImages && missingImages.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-amber-800 font-bold text-sm">
                            {missingImages.length} foto{missingImages.length > 1 ? 's' : ''} del idioma base (ES) no {missingImages.length > 1 ? 'están' : 'está'} en este idioma
                        </p>
                        <p className="text-amber-700 text-xs mt-1">
                            Guarda la galería en Español para sincronizar automáticamente, o importa ahora para editar los textos en este idioma.
                        </p>
                    </div>
                    <button
                        onClick={handleSyncFromBase}
                        className="shrink-0 flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Importar de ES
                    </button>
                </div>
            )}

            {/* Banner: todas las fotos de ES están presentes */}
            {baseImages && baseImages.length > 0 && missingImages.length === 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <p className="text-emerald-700 text-xs font-medium">
                        Galería sincronizada con ES — {imagenes.length} foto{imagenes.length !== 1 ? 's' : ''} presente{imagenes.length !== 1 ? 's' : ''}. Puedes editar los textos para este idioma.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Título</label>
                    <input type="text" value={data.titulo || ''} onChange={(e) => handleChange('titulo', e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 outline-none" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Descripción</label>
                    <input type="text" value={data.descripcion || ''} onChange={(e) => handleChange('descripcion', e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 outline-none" />
                </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-ufaal-text">
                        Catálogo de Fotos y Videos
                        <span className="ml-2 text-sm font-normal text-gray-400">({imagenes.length})</span>
                    </h3>
                    <button onClick={addImagen} className="flex items-center gap-2 bg-ufaal-blue/10 text-ufaal-blue px-4 py-2 rounded-lg font-medium">
                        <Plus className="w-4 h-4" /> Agregar Foto / Video
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {imagenes.map((imagen: any, idx: number) => {
                        const isFromBase = baseImages?.some((b: any) => b.id === imagen.id);
                        return (
                            <div key={imagen.id || idx} className="bg-white border rounded-xl p-6 shadow-sm relative">
                                {baseImages && (
                                    <span className={`absolute top-4 left-4 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                        isFromBase
                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                            : 'bg-blue-50 text-blue-600 border border-blue-200'
                                    }`}>
                                        {isFromBase ? 'ES ✓' : 'Solo este idioma'}
                                    </span>
                                )}
                                <button onClick={() => removeImagen(idx)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg z-10 bg-white shadow-sm border">
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                <ImageUpload
                                    label={`Foto / Video ${idx + 1}`}
                                    currentImage={imagen.url || ''}
                                    onUploadSuccess={(url) => handleImagenChange(idx, 'url', url)}
                                />

                                <div className="space-y-3 mt-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Título de la foto / video</label>
                                        <input type="text" value={imagen.titulo || ''} onChange={(e) => handleImagenChange(idx, 'titulo', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Categoría</label>
                                        <select value={imagen.categoria || 'eventos'} onChange={(e) => handleImagenChange(idx, 'categoria', e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm bg-white">
                                            <option value="formacion">Formación</option>
                                            <option value="eventos">Eventos</option>
                                            <option value="investigacion">Investigación</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {imagenes.length === 0 && (
                        <div className="col-span-2 text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                            Sin fotos ni videos. Haz click en "Agregar Foto / Video".
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
