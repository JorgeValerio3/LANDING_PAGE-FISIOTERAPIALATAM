import React, { useState } from 'react';
import { SERVER_URL } from '../../api';
import { getUploadUrl } from '../../services/api';
import { Loader2, Upload } from 'lucide-react';

interface ImageUploadProps {
    currentImage: string;
    onUploadSuccess: (url: string) => void;
    label?: string;
}

export function ImageUpload({ currentImage, onUploadSuccess, label = "Seleccionar Imagen" }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        // Mostrar preview local
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        // Subir al servidor
        setUploading(true);
        const formData = new FormData();
        formData.append('files', file); 

        try {
            // QA: Usamos fetch directo aquí porque fetchClient está diseñado para JSON, 
            // pero usamos SERVER_URL para evitar hardcoding.
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
                setPreview(data.urls[0]);
            } else {
                alert('Error subiendo imagen: ' + (data.error || 'Desconocido'));
                setPreview(currentImage); // revert
            }
        } catch (err) {
            console.error(err);
            alert('Error de conexión al subir imagen');
            setPreview(currentImage);
        } finally {
            setUploading(false);
        }
    };

    const displayUrl = preview ? getUploadUrl(preview) : '';

    return (
        <div className="border shadow-sm rounded-xl p-4 bg-white relative">
            <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">{label}</label>
            
            {preview ? (
                <div className="relative rounded-lg overflow-hidden group">
                    <img 
                        src={displayUrl} 
                        alt="Preview" 
                        className="w-full h-48 object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                    />
                    
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <span className="bg-white text-gray-800 px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            Cambiar Imagen
                        </span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                    </label>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg h-48 cursor-pointer hover:bg-gray-50 transition-colors">
                    {uploading ? (
                        <Loader2 className="w-8 h-8 text-ufaal-blue animate-spin mb-2" />
                    ) : (
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    )}
                    <span className="text-sm text-gray-500 font-medium">Click para subir foto</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                </label>
            )}
        </div>
    );
}
