import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const navItems = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Quiénes Somos', href: '#quienes-somos' },
    { label: 'Organización', href: '#organizacion' },
    { label: 'Países Miembros', href: '#paises' },
    { label: 'Galería', href: '#galeria' },
    { label: 'Actividades', href: '#actividades' },
    { label: 'Formación', href: '#formacion' },
    { label: 'Investigación', href: '#investigacion' },
    { label: 'Noticias', href: '#noticias' },
    { label: 'Afiliación', href: '#afiliacion' },
    { label: 'Contacto', href: '#contacto' },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > window.innerHeight * 0.8);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={twMerge(
                clsx(
                    'fixed top-0 w-full z-50 transition-all duration-300 ease-in-out px-6',
                    isScrolled
                        ? 'bg-ufaal-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-4'
                        : 'bg-transparent py-6'
                )
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between w-full relative">
                
                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center justify-center w-full gap-8 z-10">
                    {/* Left Items */}
                    <div className="flex flex-1 justify-end items-center gap-6">
                        {navItems.slice(0, 6).map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className={clsx(
                                    "text-sm font-medium transition-colors hover:text-ufaal-blue whitespace-nowrap",
                                    isScrolled ? "text-gray-600" : "text-gray-200 hover:text-white"
                                )}
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    {/* Center Logo */}
                    <div
                        className={clsx(
                            "flex items-center justify-center shrink-0 transition-all duration-300",
                            isScrolled ? "scale-90" : "scale-100"
                        )}
                    >
                        <a href="#inicio" className="flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl p-2.5 shadow-md border border-gray-100 transition-all hover:shadow-lg hover:-translate-y-0.5">
                            <img
                                src="/images/ufal.png?v=3"
                                alt="Logo UFAAL"
                                className="h-14 w-auto object-contain"
                            />
                        </a>
                    </div>

                    {/* Right Items */}
                    <div className="flex flex-1 justify-start items-center gap-6">
                        {navItems.slice(6).map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className={clsx(
                                    "text-sm font-medium transition-colors hover:text-ufaal-blue whitespace-nowrap",
                                    isScrolled ? "text-gray-600" : "text-gray-200 hover:text-white"
                                )}
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Mobile Logo & Spacer */}
                <div className="lg:hidden flex items-center bg-white rounded-2xl p-1.5 shadow-sm">
                    <a href="#inicio">
                        <img
                            src="/images/ufal.png?v=3"
                            alt="Logo UFAAL"
                            className="h-10 w-auto object-contain"
                        />
                    </a>
                </div>

                {/* Mobile menu button */}
                <button
                    className="lg:hidden p-2 ml-auto z-10"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? (
                        <X className={clsx("w-6 h-6", isScrolled ? "text-ufaal-blue" : "text-white")} />
                    ) : (
                        <Menu className={clsx("w-6 h-6", isScrolled ? "text-ufaal-blue" : "text-white")} />
                    )}
                </button>
            </div>

            {/* Mobile Nav */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg border-b border-gray-100 lg:hidden flex flex-col p-4 gap-4 pb-8">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-gray-800 text-sm font-medium hover:text-ufaal-blue hover:bg-gray-50 p-2 rounded-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    );
}
