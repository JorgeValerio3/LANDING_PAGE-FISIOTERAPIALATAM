import { useState, useEffect } from 'react';
import { FadeIn } from '../ui/FadeIn';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Mail, ImageIcon, X } from 'lucide-react';
import { getUploadUrl } from '../../services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Solución rápida para iconos de Leaflet en React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

import { useI18n } from '../../contexts/I18nContext';

export function Paises({ data: _data }: { data?: any }) {
    const { t } = useI18n();
    const paisesLista = _data?.paises_lista || [];
    const [selectedCountry, setSelectedCountry] = useState<any>(null);
    const [fullscreenImg, setFullscreenImg] = useState<string | null>(null);

    useEffect(() => {
        if (paisesLista.length > 0 && !selectedCountry) {
            setSelectedCountry(paisesLista[0]);
        }
    }, [paisesLista, selectedCountry]);

    // Prevenir scroll cuando el modal está abierto
    useEffect(() => {
        if (fullscreenImg) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [fullscreenImg]);

    if (!_data || paisesLista.length === 0 || !selectedCountry) return null;

    return (
        <section id="paises" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-16">
                    <FadeIn direction="up">
                        <h2 className="text-3xl md:text-5xl font-bold text-ufaal-blue mb-6 tracking-tight">{t('paises.titulo')}</h2>
                        <div className="w-24 h-1 bg-ufaal-blue-light mx-auto rounded-full mb-6"></div>
                        <p className="text-gray-600 font-light max-w-2xl mx-auto text-lg">
                            {t('paises.descripcion')}
                        </p>
                    </FadeIn>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Mapa Interactivo */}
                    <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-lg border border-gray-100 h-[500px] z-10">
                        <FadeIn delay={0.2} direction="left" className="h-full w-full">
                            <MapContainer
                                center={[-10, -60]}
                                zoom={3}
                                scrollWheelZoom={false}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {paisesLista.map((country: any) => (
                                    <Marker
                                        key={country.id}
                                        position={[country.latitud, country.longitud]}
                                        eventHandlers={{
                                            click: () => setSelectedCountry(country)
                                        }}
                                    >
                                        <Popup>
                                            <div className="text-center font-sans p-1">
                                                <div className="w-10 h-6 mx-auto mb-2 rounded shadow-sm border border-gray-200 overflow-hidden">
                                                    <img
                                                        src={`https://flagcdn.com/w80/${country.id}.png`}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <p className="font-bold text-ufaal-blue mt-1 leading-tight">{t(`paises_nombres.${country.id}`) || country.nombre}</p>
                                                <p className="text-xs text-ufaal-text font-semibold">{country.representante}</p>
                                                <p className="text-[10px] text-gray-500 mt-1 cursor-pointer underline hover:text-ufaal-blue-light" onClick={() => setSelectedCountry(country)}>{t('paises.ver_perfil')}</p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </FadeIn>
                    </div>

                    {/* Ficha del País Acordeón */}
                    <div className="w-full lg:w-1/2 flex flex-col pt-4">
                        <FadeIn delay={0.4} direction="right">
                            <div className="bg-ufaal-gray rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
                                {/* Bandera Estilizada de Fondo (Technical Business style) */}
                                <div className="absolute -top-4 -right-4 w-48 h-32 transition-all duration-700 group-hover:scale-110 group-hover:-rotate-3 opacity-20 lg:opacity-30">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent z-10 rounded-3xl"></div>
                                    <img
                                        src={`https://flagcdn.com/w320/${selectedCountry.id}.png`}
                                        alt=""
                                        className="w-full h-full object-cover rounded-3xl blur-[2px]"
                                    />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-8 rounded shadow-sm border border-white/50 overflow-hidden shrink-0">
                                                <img
                                                    src={`https://flagcdn.com/w80/${selectedCountry.id}.png`}
                                                    alt={`Bandera de ${selectedCountry.nombre}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <h3 className="text-3xl font-bold text-ufaal-blue tracking-tight">{t(`paises_nombres.${selectedCountry.id}`) || selectedCountry.nombre}</h3>
                                        </div>

                                        {/* Insignia Técnica (Empresarial) */}
                                        <div className="hidden sm:flex flex-col items-end">
                                            <span className="text-[10px] uppercase tracking-widest font-bold text-ufaal-blue-light/60 mb-1">{t('paises.miembro_regional')}</span>
                                            <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-ufaal-blue-light/40"></div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-6 mb-8 items-start">
                                        <div className="relative shrink-0">
                                            {selectedCountry.imagen ? (
                                                <img
                                                    src={getUploadUrl(selectedCountry.imagen)}
                                                    alt={selectedCountry.representante}
                                                    className="w-32 h-32 md:w-36 md:h-36 rounded-2xl object-cover border-4 border-white shadow-md relative z-10 bg-white cursor-zoom-in hover:scale-105 transition-transform"
                                                    loading="lazy"
                                                    onClick={() => setFullscreenImg(getUploadUrl(selectedCountry.imagen))}
                                                />
                                            ) : (
                                                <div className="w-32 h-32 md:w-36 md:h-36 rounded-2xl bg-gradient-to-br from-ufaal-blue to-ufaal-blue-light border-4 border-white shadow-md relative z-10 flex items-center justify-center text-white text-3xl font-bold uppercase tracking-widest">
                                                    {(selectedCountry.representante || '??')
                                                        .split(' ')
                                                        .filter(Boolean)
                                                        .map((n: string) => n[0])
                                                        .slice(0, 2)
                                                        .join('')}
                                                </div>
                                            )}
                                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-ufaal-blue rounded-xl flex items-center justify-center border-2 border-white shadow-lg z-20">
                                                <img
                                                    src={`https://flagcdn.com/w40/${selectedCountry.id}.png`}
                                                    className="w-6 h-4 object-cover rounded-[1px]"
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-xl font-bold text-ufaal-text mb-1">{selectedCountry.representante || t('paises.por_definir')}</h4>
                                            <p className="text-sm font-medium text-ufaal-blue-light mb-2">
                                                {t(`roles.${(selectedCountry.cargo || '').toLowerCase().replace(/ /g, '_').normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`) || selectedCountry.cargo}
                                            </p>
                                            {selectedCountry.contacto && (
                                                <a 
                                                    href={`mailto:${selectedCountry.contacto}`} 
                                                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-ufaal-blue transition-colors group/mail mb-4"
                                                >
                                                    <Mail className="w-4 h-4 text-ufaal-blue-light group-hover/mail:text-ufaal-blue" />
                                                    {selectedCountry.contacto}
                                                </a>
                                            )}
                                            {selectedCountry.descripcion && (
                                                <p className="text-sm text-gray-600 leading-relaxed italic border-l-2 border-ufaal-blue/20 pl-4 py-1 whitespace-pre-line">
                                                    "{selectedCountry.descripcion}"
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Gallery of dynamic activities (Max 5) */}
                                    <div className="mb-4">
                                        <h5 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">{t('paises.actividades_en')} {t(`paises_nombres.${selectedCountry.id}`) || selectedCountry.nombre}</h5>
                                        <div className="grid grid-cols-5 gap-2">
                                            {selectedCountry.galeria && selectedCountry.galeria.filter(Boolean).length > 0 ? (
                                                selectedCountry.galeria.filter(Boolean).slice(0, 5).map((img: string, i: number) => (
                                                    <img
                                                        key={i}
                                                        src={getUploadUrl(img)}
                                                        className="w-full h-16 md:h-20 object-cover rounded-lg shadow-sm hover:scale-105 transition-transform bg-gray-100 cursor-zoom-in"
                                                        alt={`Actividad ${i + 1}`}
                                                        onClick={() => setFullscreenImg(getUploadUrl(img))}
                                                    />
                                                ))
                                            ) : (
                                                <div className="col-span-5 py-8 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center bg-gray-50/50">
                                                    <ImageIcon className="w-6 h-6 text-gray-300 mb-2" />
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('paises.sin_actividades')}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Switcher para móvil - Lista rápida de botones */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <p className="text-xs text-center text-gray-500 mb-4 font-medium uppercase tracking-widest">{t('paises.selecciona_pais')}</p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {paisesLista.map((c: any) => (
                                            <button
                                                key={c.id}
                                                onClick={() => setSelectedCountry(c)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2
                          ${selectedCountry.id === c.id
                                                        ? 'bg-ufaal-blue text-white shadow-md'
                                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                                            >
                                                <img
                                                    src={`https://flagcdn.com/w40/${c.id}.png`}
                                                    className="w-5 h-3.5 object-cover rounded-[1px] shadow-sm"
                                                    alt=""
                                                />
                                                {t(`paises_nombres.${c.id}`) || c.nombre}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </FadeIn>
                    </div>

                </div>
            </div>

            {/* Lightbox Modal */}
            {fullscreenImg && (
                <div 
                    className="fixed inset-0 z-[9999] bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
                    onClick={() => setFullscreenImg(null)}
                >
                    <button 
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-white/10 p-3 rounded-full hover:bg-white/20 z-[10000]"
                        onClick={(e) => {
                            e.stopPropagation();
                            setFullscreenImg(null);
                        }}
                    >
                        <X className="w-8 h-8" />
                    </button>
                    
                    <img 
                        src={fullscreenImg} 
                        alt="Zoom" 
                        className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 ring-4 ring-white/10"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </section>
    );
}
