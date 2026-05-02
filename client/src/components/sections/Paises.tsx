import { useState, useEffect, useMemo } from 'react';
import { FadeIn } from '../ui/FadeIn';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Mail, ImageIcon, X, Play, Film } from 'lucide-react';
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
import { PaisesData, PaisData } from '../../types';

export function Paises({ data: _data }: { data?: PaisesData }) {
    const { t } = useI18n();
    const rawPaises = _data?.paises_lista;
    const paisesLista = useMemo(() => rawPaises || [], [rawPaises]);
    const [selectedCountry, setSelectedCountry] = useState<PaisData | null>(null);
    const [fullscreenMedia, setFullscreenMedia] = useState<string | null>(null);

    useEffect(() => {
        if (paisesLista.length > 0 && !selectedCountry) {
            setSelectedCountry(paisesLista[0]);
        }
    }, [paisesLista, selectedCountry]);

    // Prevenir scroll cuando el modal está abierto
    useEffect(() => {
        if (fullscreenMedia) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [fullscreenMedia]);

    if (!_data || paisesLista.length === 0 || !selectedCountry) return null;

    const isVideo = (url: string) => {
        if (!url) return false;
        return url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) || url.includes('/video/upload/');
    };

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

                <div className="flex flex-col lg:flex-row gap-12 mb-16">

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
                                {paisesLista.map((country: PaisData) => (
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
                                                <div className="relative cursor-zoom-in group/main" onClick={() => setFullscreenMedia(getUploadUrl(selectedCountry.imagen || ''))}>
                                                    {isVideo(selectedCountry.imagen) ? (
                                                        <div className="w-32 h-32 md:w-36 md:h-36 rounded-2xl border-4 border-white shadow-md relative z-10 bg-black overflow-hidden">
                                                            <video 
                                                                src={getUploadUrl(selectedCountry.imagen)} 
                                                                className="w-full h-full object-cover"
                                                                muted
                                                                playsInline
                                                                onMouseOver={e => e.currentTarget.play()}
                                                                onMouseOut={e => e.currentTarget.pause()}
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                                <Play className="w-8 h-8 text-white opacity-80" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <img
                                                            src={getUploadUrl(selectedCountry.imagen || '')}
                                                            alt={selectedCountry.representante}
                                                            className="w-32 h-32 md:w-36 md:h-36 rounded-2xl object-cover border-4 border-white shadow-md relative z-10 bg-white hover:scale-105 transition-transform"
                                                            loading="lazy"
                                                        />
                                                    )}
                                                </div>
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

                                    {/* Switcher para móvil - Lista rápida de botones */}
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <p className="text-xs text-center text-gray-500 mb-4 font-medium uppercase tracking-widest">{t('paises.selecciona_pais')}</p>
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {paisesLista.map((c: PaisData) => (
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

                            </div>
                        </FadeIn>
                    </div>

                </div>

                {/* Galería de Actividades (Debajo del mapa) */}
                <FadeIn delay={0.6} direction="up">
                    <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-ufaal-blue mb-1">
                                    {t('paises.actividades_en')} {t(`paises_nombres.${selectedCountry.id}`) || selectedCountry.nombre}
                                </h3>
                                <p className="text-sm text-gray-500">{t('paises.galeria_descripcion') || 'Explora los eventos y actividades destacadas de este país.'}</p>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
                                <Film className="w-4 h-4 text-ufaal-blue-light" />
                                <span className="text-xs font-bold text-ufaal-text uppercase tracking-wider">{t('paises.fotos_y_videos') || 'Fotos y Videos'}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {selectedCountry.galeria && selectedCountry.galeria.filter(Boolean).length > 0 ? (
                                selectedCountry.galeria.filter(Boolean).slice(0, 5).map((media: string, i: number) => (
                                    <div 
                                        key={i} 
                                        className="relative aspect-square rounded-2xl overflow-hidden shadow-md group cursor-zoom-in bg-white border-4 border-white"
                                        onClick={() => setFullscreenMedia(getUploadUrl(media))}
                                    >
                                        {isVideo(media) ? (
                                            <>
                                                <video 
                                                    src={getUploadUrl(media)} 
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    muted
                                                    playsInline
                                                    onMouseOver={e => e.currentTarget.play()}
                                                    onMouseOut={e => {
                                                        e.currentTarget.pause();
                                                        e.currentTarget.currentTime = 0;
                                                    }}
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                                                    <Play className="w-10 h-10 text-white drop-shadow-lg opacity-80" />
                                                </div>
                                                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm p-1.5 rounded-lg">
                                                    <Film className="w-3.5 h-3.5 text-white" />
                                                </div>
                                            </>
                                        ) : (
                                            <img
                                                src={getUploadUrl(media)}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                alt={`Actividad ${i + 1}`}
                                                loading="lazy"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                            <p className="text-white text-[10px] font-bold uppercase tracking-widest">{t('paises.ver_mas') || 'Ver detalle'}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-16 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center bg-white">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <ImageIcon className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('paises.sin_actividades')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </FadeIn>
            </div>

            {/* Lightbox Modal */}
            {fullscreenMedia && (
                <div 
                    className="fixed inset-0 z-[9999] bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
                    onClick={() => setFullscreenMedia(null)}
                >
                    <button 
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-white/10 p-3 rounded-full hover:bg-white/20 z-[10000]"
                        onClick={(e) => {
                            e.stopPropagation();
                            setFullscreenMedia(null);
                        }}
                    >
                        <X className="w-8 h-8" />
                    </button>
                    
                    <div className="relative max-w-5xl w-full max-h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        {isVideo(fullscreenMedia) ? (
                            <video 
                                src={fullscreenMedia} 
                                className="max-w-full max-h-[85vh] rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 ring-4 ring-white/10"
                                controls
                                autoPlay
                                playsInline
                            />
                        ) : (
                            <img 
                                src={fullscreenMedia} 
                                alt="Zoom" 
                                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 ring-4 ring-white/10"
                            />
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
