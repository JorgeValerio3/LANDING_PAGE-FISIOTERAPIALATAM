import { useState } from 'react';
import { FadeIn } from '../ui/FadeIn';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Mail, Phone } from 'lucide-react';
import { countriesData } from '../../data/membersData';

// Solución rápida para iconos de Leaflet en React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const randomCountryImages = [
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1519340241574-2c61ce34d3d3?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1600881333168-2ef49b341f30?auto=format&fit=crop&q=80&w=300",
];

export function Paises() {
    const [selectedCountry, setSelectedCountry] = useState(countriesData[0]);

    return (
        <section id="paises" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-16">
                    <FadeIn direction="up">
                        <h2 className="text-3xl md:text-5xl font-bold text-ufaal-blue mb-6 tracking-tight">Miembros y Países</h2>
                        <div className="w-24 h-1 bg-ufaal-blue-light mx-auto rounded-full mb-6"></div>
                        <p className="text-gray-600 font-light max-w-2xl mx-auto text-lg">
                            Identidad Latinoamericana. Explora los representantes e instituciones que conforman nuestra red regional.
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
                                {countriesData.map((country) => (
                                    <Marker
                                        key={country.id}
                                        position={country.coords}
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
                                                <p className="font-bold text-ufaal-blue mt-1 leading-tight">{country.name}</p>
                                                <p className="text-xs text-ufaal-text font-semibold">{country.rep.name}</p>
                                                <p className="text-[10px] text-gray-500 mt-1 cursor-pointer underline hover:text-ufaal-blue-light" onClick={() => setSelectedCountry(country)}>Ver perfil en panel</p>
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
                                                    alt={`Bandera de ${selectedCountry.name}`} 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <h3 className="text-3xl font-bold text-ufaal-blue tracking-tight">{selectedCountry.name}</h3>
                                        </div>
                                        
                                        {/* Insignia Técnica (Empresarial) */}
                                        <div className="hidden sm:flex flex-col items-end">
                                            <span className="text-[10px] uppercase tracking-widest font-bold text-ufaal-blue-light/60 mb-1">Miembro Regional</span>
                                            <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-ufaal-blue-light/40"></div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-6 mb-8 items-start">
                                        <div className="relative shrink-0">
                                            <img
                                                src={selectedCountry.rep.photo}
                                                alt={selectedCountry.rep.name}
                                                className="w-32 h-32 md:w-36 md:h-36 rounded-2xl object-cover border-4 border-white shadow-md relative z-10 bg-white"
                                                loading="lazy"
                                            />
                                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-ufaal-blue rounded-xl flex items-center justify-center border-2 border-white shadow-lg z-20">
                                                <img 
                                                    src={`https://flagcdn.com/w40/${selectedCountry.id}.png`} 
                                                    className="w-6 h-4 object-cover rounded-[1px]" 
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-ufaal-text mb-1">{selectedCountry.rep.name}</h4>
                                            <p className="text-sm font-medium text-ufaal-blue-light mb-4">Representante Nacional</p>
                                            <p className="text-gray-600 font-light text-sm leading-relaxed text-justify line-clamp-[10]">
                                                {selectedCountry.rep.profile}
                                            </p>
                                        </div>
                                    </div>

                                    {(selectedCountry.rep.contact || (selectedCountry.rep as any).phone) && (
                                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-50 mb-8">
                                            <h5 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wider">Contacto Institucional</h5>
                                            <div className="flex flex-col gap-3">
                                                {selectedCountry.rep.contact && (
                                                    <a href={`mailto:${selectedCountry.rep.contact}`} className="flex items-center gap-3 text-gray-600 hover:text-ufaal-blue transition-colors text-sm break-all">
                                                        <Mail className="w-5 h-5 text-ufaal-blue-light shrink-0" />
                                                        {selectedCountry.rep.contact}
                                                    </a>
                                                )}
                                                {(selectedCountry.rep as any).phone && (
                                                    <p className="flex items-center gap-3 text-gray-600 text-sm">
                                                        <Phone className="w-5 h-5 text-ufaal-blue-light shrink-0" />
                                                        {(selectedCountry.rep as any).phone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* 5 placeholder images below */}
                                    <div className="mb-4">
                                        <h5 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Actividades en {selectedCountry.name}</h5>
                                        <div className="grid grid-cols-5 gap-2">
                                            {randomCountryImages.map((img, i) => (
                                                <img 
                                                    key={i} 
                                                    src={`${img}&seed=${selectedCountry.id}-${i}`} 
                                                    className="w-full h-16 md:h-20 object-cover rounded-lg shadow-sm hover:scale-105 transition-transform" 
                                                    alt={`Actividad ${i+1}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Switcher para móvil - Lista rápida de botones */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <p className="text-xs text-center text-gray-500 mb-4 font-medium uppercase tracking-widest">Selecciona otro país</p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {countriesData.map(c => (
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
                                                {c.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </FadeIn>
                    </div>

                </div>
            </div>
        </section>
    );
}
