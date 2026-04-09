import { FileUpload } from '../FileUpload';

interface AfiliacionFormProps {
    data: any;
    onChange: (data: any) => void;
}

export function AfiliacionForm({ data, onChange }: AfiliacionFormProps) {
    const handleChange = (field: string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Título</label>
                    <input type="text" value={data.titulo} onChange={(e) => handleChange('titulo', e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 outline-none" />
                </div>
                <div>
                     <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Texto Botón</label>
                     <input type="text" value={data.cta_texto} onChange={(e) => handleChange('cta_texto', e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 outline-none" />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Descripción Principal</label>
                <textarea value={data.descripcion} onChange={(e) => handleChange('descripcion', e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 h-32 focus:ring-2 focus:ring-ufaal-blue/30 outline-none" />
            </div>

            <div className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-bold text-ufaal-text mb-4">Documentos y Requisitos</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                         <h4 className="font-bold text-gray-700 mb-4 text-sm">Documento PDF "Pasos para Afiliarse"</h4>
                         <FileUpload 
                            label="Reemplazar archivo"
                            currentFile={data.documento_requisitos_pdf}
                            onUploadSuccess={(url) => handleChange('documento_requisitos_pdf', url)}
                         />
                     </div>
                     <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                         <h4 className="font-bold text-gray-700 mb-4 text-sm">Formato de Ficha de Inscripción (Word/PDF)</h4>
                         <FileUpload 
                            label="Reemplazar archivo"
                            currentFile={data.formato_ficha_pdf}
                            accept=".pdf,.doc,.docx"
                            onUploadSuccess={(url) => handleChange('formato_ficha_pdf', url)}
                         />
                     </div>
                </div>
            </div>
        </div>
    );
}
