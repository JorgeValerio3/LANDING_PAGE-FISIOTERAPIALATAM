import { FadeIn } from '../ui/FadeIn';
import { BookOpen, Laptop, Landmark } from 'lucide-react';

export function Formacion({ data }: { data: any }) {
    if (!data) return null;

    const items = data.niveles || [];

    const getIcon = (iconName: string) => {
        const i = String(iconName).toLowerCase();
        if (i.includes('laptop') || i.includes('curso')) return <Laptop className="w-8 h-8 text-ufaal-blue" />;
        if (i.includes('award') || i.includes('certifica')) return <AwardIcon className="w-8 h-8 text-ufaal-blue" />;
        if (i.includes('book') || i.includes('educa') || i.includes('programa')) return <BookOpen className="w-8 h-8 text-ufaal-blue" />;
        if (i.includes('landmark') || i.includes('alianza') || i.includes('universidad')) return <Landmark className="w-8 h-8 text-ufaal-blue" />;
        return <BookOpen className="w-8 h-8 text-ufaal-blue" />;
    };

    return (
        <section id="formacion" className="py-24 bg-white relative overflow-hidden">
            {/* Elemento de diseño de fondo */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-ufaal-gray z-0 hidden lg:block rounded-bl-[150px]"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="text-left mb-16 max-w-2xl">
                    <FadeIn direction="right">
                        <h2 className="text-3xl md:text-5xl font-bold text-ufaal-blue mb-6 tracking-tight">{data.titulo}</h2>
                        <div className="w-24 h-1 bg-ufaal-blue-light rounded-full mb-6"></div>
                        <p className="text-gray-600 font-light text-lg leading-relaxed">
                            {data.descripcion}
                        </p>
                    </FadeIn>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {items.map((item: any, index: number) => (
                        <FadeIn key={item.titulo || index} delay={0.2 + (index * 0.1)} direction="up">
                            <div className="flex gap-6 items-start p-8 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md hover:border-ufaal-blue-light/30 transition-all group h-full">
                                <div className="p-4 bg-ufaal-gray rounded-xl group-hover:bg-ufaal-blue/5 transition-colors shrink-0">
                                    {getIcon(item.icono || item.titulo)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-ufaal-text mb-3">{item.titulo}</h3>
                                    <p className="text-gray-600 font-light leading-relaxed">
                                        {item.descripcion}
                                    </p>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>

            </div>
        </section>
    );
}

function AwardIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
            <path d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101" />
            <path d="m10.172 13.828a4 4 0 0 1 5.656 0l4 4a4 4 0 0 1-5.656 5.656l-1.102-1.101" />
        </svg>
    );
}
