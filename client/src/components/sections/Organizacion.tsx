import { FadeIn } from '../ui/FadeIn';
import { Users, Award, MapPin, ShieldCheck } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { OrganizacionData, OrganizacionSeccion, OrganizacionMiembro } from '../../types';
export function Organizacion({ data: _data }: { data?: OrganizacionData }) {
    const { t } = useI18n();
    if (!_data) return null;

    const icons = [
        <ShieldCheck className="w-6 h-6 text-white" />,
        <Award className="w-6 h-6 text-white" />,
        <Users className="w-6 h-6 text-white" />,
        <MapPin className="w-6 h-6 text-white" />
    ];



    return (
        <section id="organizacion" className="py-24 bg-ufaal-gray">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-16">
                    <FadeIn direction="down">
                        <h2 className="text-3xl md:text-5xl font-bold text-ufaal-blue mb-6 tracking-tight">
                            {t('organizacion.titulo')}
                        </h2>
                        <div className="w-24 h-1 bg-ufaal-blue-light mx-auto rounded-full mb-6"></div>
                        <p className="text-gray-600 font-light max-w-2xl mx-auto text-lg">
                            {t('organizacion.descripcion')}
                        </p>
                    </FadeIn>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {_data.secciones?.map((section: OrganizacionSeccion, index: number) => {
                        const sectionKeys: Record<number, string> = {
                            0: 'junta',
                            1: 'academico',
                            2: 'delegados'
                        };
                        const sectionKey = sectionKeys[index] || 'junta';
                        
                        return (
                            <FadeIn key={section.title || index} delay={0.2 + (index * 0.1)} direction="up">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
                                    <div className="bg-ufaal-blue p-4 flex items-center gap-3">
                                        {icons[index % icons.length]}
                                        <h3 className="text-lg font-bold text-white">{t(`organizacion.secciones.${sectionKey}`)}</h3>
                                    </div>
                                <div className="p-6 flex-1">
                                    <ul className="space-y-4">
                                        {section.members?.map((member: OrganizacionMiembro & { country?: string }, idx: number) => (
                                            <li key={idx} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                                <div>
                                                    <p className="font-semibold text-ufaal-text">{member.name}</p>
                                                    <p className="text-sm font-light text-gray-500">
                                                        {t(`roles.${member.role.toLowerCase().replace(/ /g, '_').normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`) || member.role}
                                                    </p>
                                                </div>
                                                {member.country && (
                                                    <span className="text-xs font-medium px-3 py-1 bg-ufaal-gray text-ufaal-blue-light rounded-full">
                                                        {t(`paises_nombres_by_name.${member.country}`) || member.country}
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            </FadeIn>
                        );
                    })}
                </div>



            </div>
        </section>
    );
}
