import { useState, useEffect } from 'react';
import { FadeIn } from '../ui/FadeIn';
import { Check, ShieldCheck, GraduationCap, Building2, User, Mail, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function Afiliacion() {
    const planes = [
        {
            id: 'estudiante',
            titulo: 'Membresía Estudiante',
            icono: <GraduationCap className="w-8 h-8 text-ufaal-blue" />,
            descripcion: 'Para estudiantes activos de pregrado en Fisioterapia/Kinesiología que desean comenzar su formación acuática.',
            precio: '$25 USD',
            periodo: '/ año',
            beneficios: [
                'Acceso a biblioteca de recursos básicos',
                'Descuento del 30% en webinarios introductorios',
                'Participación como oyente en asambleas',
                'Foro exclusivo para resolución de dudas',
                'Certificado digital de miembro estudiante'
            ],
            destacado: false
        },
        {
            id: 'profesional',
            titulo: 'Membresía Profesional',
            icono: <User className="w-8 h-8 text-white" />,
            descripcion: 'La opción ideal para profesionales titulados buscando especialización certificada y comunidad académica activa.',
            precio: '$60 USD',
            periodo: '/ año',
            beneficios: [
                'Acceso al Consenso Latinoamericano completo',
                'Descuentos de hasta 50% en congresos y talleres',
                'Inclusión en el directorio regional de fisioterapeutas acuáticos (Buscador para pacientes)',
                'Voz y voto en la Asamblea General Anual',
                'Oportunidad de publicar en el boletín trimestral',
                'Asesoramiento lega-laboral internacional básico'
            ],
            destacado: true
        },
        {
            id: 'institucional',
            titulo: 'Membresía Institucional',
            icono: <Building2 className="w-8 h-8 text-ufaal-blue" />,
            descripcion: 'Para universidades, clínicas, y centros de rehabilitación interesados en formar alianzas y capacitar a su personal.',
            precio: '$250 USD',
            periodo: '/ año',
            beneficios: [
                'Afiliación de hasta 5 profesionales de la institución',
                'Logo institucional en la categoría de "Centros Avalados UFAAL"',
                'Asesoría técnica para diseño o remodelación de piscinas terapéuticas',
                'Programas de capacitación in-house con tarifas preferenciales',
                'Acceso preferente para becas de residentes'
            ],
            destacado: false
        }
    ];

    const [modalOpen, setModalOpen] = useState(false);
    const [planSeleccionado, setPlanSeleccionado] = useState('');

    // Bloquear scroll al abrir el modal de registro
    useEffect(() => {
        if (modalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [modalOpen]);

    const handleAfiliarmeClick = (tituloPlan: string) => {
        setPlanSeleccionado(tituloPlan);
        setModalOpen(true);
    };

    return (
        <section id="afiliacion" className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <FadeIn direction="up">
                        <div className="flex justify-center mb-4">
                            <span className="bg-ufaal-blue/10 text-ufaal-blue font-semibold px-4 py-1.5 rounded-full text-sm flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Únete a Nosotros
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-ufaal-text mb-6 tracking-tight">
                            Impulsa tu Desarrollo <span className="text-ufaal-blue">Profesional</span>
                        </h2>
                        <div className="w-24 h-1 bg-ufaal-blue-light mx-auto rounded-full mb-6"></div>
                        <p className="text-gray-600 font-light text-lg leading-relaxed">
                            Forma parte de la red más grande de fisioterapia acuática en Latinoamérica. Obtén respaldo internacional, continua tu educación y eleva el nivel de tu práctica clínica a través de nuestras membresías.
                        </p>
                    </FadeIn>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {planes.map((plan, index) => (
                        <FadeIn key={plan.id} delay={0.2 + (index * 0.1)} direction="up" className="h-full">
                            <div className={`rounded-3xl p-8 flex flex-col h-full relative transition-all duration-300 border ${plan.destacado ? 'bg-ufaal-blue text-white shadow-xl shadow-ufaal-blue/20 border-ufaal-blue transform md:-translate-y-4' : 'bg-white text-ufaal-text shadow-sm border-gray-100 hover:shadow-lg'}`}>

                                {plan.destacado && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-bold px-4 py-1.5 rounded-full text-xs shadow-md whitespace-nowrap uppercase tracking-wider">
                                            Más Elegido
                                        </span>
                                    </div>
                                )}

                                <div className="mb-6">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${plan.destacado ? 'bg-white/20 backdrop-blur-sm' : 'bg-ufaal-blue/5'}`}>
                                        {plan.icono}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{plan.titulo}</h3>
                                    <p className={`text-sm leading-relaxed ${plan.destacado ? 'text-white/80' : 'text-gray-500'}`}>
                                        {plan.descripcion}
                                    </p>
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-extrabold tracking-tight">{plan.precio}</span>
                                        <span className={`font-medium ${plan.destacado ? 'text-white/70' : 'text-gray-400'}`}>{plan.periodo}</span>
                                    </div>
                                </div>

                                <div className="flex-grow">
                                    <ul className="space-y-4">
                                        {plan.beneficios.map((beneficio, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className={`mt-0.5 shrink-0 rounded-full p-0.5 ${plan.destacado ? 'bg-white/20' : 'bg-green-100 text-green-600'}`}>
                                                    <Check className={`w-3.5 h-3.5 ${plan.destacado ? 'text-white' : ''}`} />
                                                </div>
                                                <span className={`text-sm leading-snug ${plan.destacado ? 'text-white/90' : 'text-gray-700'}`}>
                                                    {beneficio}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="pt-8 mt-auto">
                                    <button
                                        onClick={() => handleAfiliarmeClick(plan.titulo)}
                                        className={`w-full py-4 rounded-xl font-bold transition-all shadow-sm ${plan.destacado ? 'bg-white text-ufaal-blue hover:bg-gray-50 active:scale-95' : 'bg-ufaal-gray text-ufaal-blue hover:bg-ufaal-blue hover:text-white border border-gray-200 active:scale-95'}`}
                                    >
                                        Afiliarme
                                    </button>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>

            </div>

            {/* Modal de Formulario de Afiliación */}
            <AnimatePresence>
                {modalOpen && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 flex flex-col"
                        >
                            {/* Header modal */}
                            <div className="bg-ufaal-blue px-8 py-6 flex justify-between items-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                <h3 className="text-2xl font-bold text-white relative z-10">Solicitud de Afiliación</h3>
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors relative z-10"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body Modal (Formulario) */}
                            <div className="p-8">
                                <p className="text-gray-500 mb-6 text-sm">
                                    Completa este formulario pre-registro y nuestro equipo de admisiones se pondrá en contacto contigo para formalizar el proceso.
                                </p>

                                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert("Formulario enviado con éxito (simulación)."); setModalOpen(false); }}>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="tipo_membresia">
                                            Tipo de Membresía
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="tipo_membresia"
                                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-ufaal-blue/30 focus:border-ufaal-blue transition-all"
                                                value={planSeleccionado}
                                                onChange={(e) => setPlanSeleccionado(e.target.value)}
                                            >
                                                <option value="Membresía Estudiante">Membresía Estudiante</option>
                                                <option value="Membresía Profesional">Membresía Profesional</option>
                                                <option value="Membresía Institucional">Membresía Institucional</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="nombre">
                                            Nombre Completo
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                id="nombre"
                                                required
                                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-ufaal-blue/30 focus:border-ufaal-blue transition-all"
                                                placeholder="Dr. John Doe"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="email">
                                            Correo Electrónico Principal
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                id="email"
                                                required
                                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-ufaal-blue/30 focus:border-ufaal-blue transition-all"
                                                placeholder="correo@ejemplo.com"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-ufaal-blue hover:bg-ufaal-blue-light text-white font-bold py-3.5 rounded-xl shadow-md transition-all mt-4 hover:shadow-lg active:scale-95"
                                    >
                                        Enviar Solicitud
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </section>
    );
}
