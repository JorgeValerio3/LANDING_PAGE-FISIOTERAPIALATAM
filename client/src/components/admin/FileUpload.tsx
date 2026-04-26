import { useState } from 'react';
import { Loader2, FileText } from 'lucide-react';
import { SERVER_URL } from '../../api';

interface FileUploadProps {
    currentFile: string;
    onUploadSuccess: (url: string) => void;
    label?: string;
    accept?: string;
}

export function FileUpload({ currentFile, onUploadSuccess, label = "Seleccionar Archivo", accept = ".pdf" }: FileUploadProps) {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        setUploading(true);
        const formData = new FormData();
        formData.append('files', file);

        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch(`${SERVER_URL}/api/admin/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            const data = await res.json();
            if (res.ok && data.urls && data.urls.length > 0) {
                onUploadSuccess(data.urls[0]);
            } else {
                alert('Error subiendo archivo: ' + (data.error || 'Desconocido'));
            }
        } catch (err) {
            console.error(err);
            alert('Error de conexión al subir archivo');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase">{label}</label>
            <div className="flex items-center gap-3">
                <input 
                    type="text" 
                    value={currentFile} 
                    readOnly 
                    placeholder="Ningún archivo subido"
                    className="flex-1 border border-gray-200 rounded p-2 text-sm bg-gray-50 text-gray-500 truncate"
                />
                <label className={`cursor-pointer flex items-center gap-2 px-4 py-2 bg-ufaal-blue text-white rounded text-sm font-medium hover:bg-ufaal-blue-dark transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                    {uploading ? 'Subiendo...' : 'Subir'}
                    <input type="file" accept={accept} className="hidden" onChange={handleFileChange} />
                </label>
            </div>
        </div>
    );
}
