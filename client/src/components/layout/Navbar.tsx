import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useI18n } from '../../contexts/I18nContext';
import { LanguageSelector } from '../ui/LanguageSelector';

export function Navbar() {
    const { t } = useI18n();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const items = React.useMemo(() => [
        { label: t('navbar.quienes_somos'), href: '#/quienes-somos' },
        { label: t('navbar.historia'), href: '#/historia' },
        { label: t('navbar.organizacion'), href: '#/organizacion' },
        { label: t('navbar.paises'), href: '#/paises' },
        { label: t('navbar.formacion'), href: '#/formacion' },
        { label: t('navbar.investigacion'), href: '#/investigacion' },
        { label: t('navbar.noticias'), href: '#/noticias' },
        { label: t('navbar.contacto'), href: '#/contacto-directo' },
        { label: t('navbar.galeria'), href: '#/galeria' },
    ], [t]);
    const isSubPage = ['/privacidad', '/terminos', '/faq', '/contacto', '/sede-virtual'].includes(location.pathname);
    const forceSolid = isSubPage || isScrolled;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50); // Lower threshold for more responsiveness
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={twMerge(
                clsx(
                    'fixed top-0 w-full z-50 px-6 nav-container',
                    forceSolid
                        ? 'bg-ufaal-white/95 backdrop-blur-md shadow-md border-b border-gray-100 py-2'
                        : 'bg-transparent py-4 md:py-8'
                )
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between w-full relative">

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center justify-center w-full z-10">
                    {/* Left Items */}
                    <div className="flex-none w-[460px] flex justify-end items-center gap-3 xl:gap-4">
                        {items.slice(0, 5).map((item: any) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "text-[12px] xl:text-[13px] font-medium transition-colors hover:text-ufaal-blue whitespace-nowrap",
                                    forceSolid ? "text-gray-600" : "text-gray-200 hover:text-white"
                                )}
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    {/* Center Logo - Fixed Width Spacer */}
                    <div
                        className={clsx(
                            "flex-none w-[180px] xl:w-[220px] flex items-center justify-center",
                            forceSolid 
                                ? "opacity-100 scale-100" 
                                : "opacity-0 scale-90 pointer-events-none"
                        )}
                    >
                        <a
                            href="#/inicio"
                            className="flex items-center justify-center rounded-2xl p-2 bg-transparent"
                        >
                            <img
                                src="./images/logo_sin_fondo.png?v=3"
                                alt="Logo UFAAL"
                                className={clsx(
                                    "object-contain mix-blend-multiply brightness-110",
                                    forceSolid ? "h-20 xl:h-24" : "h-28 xl:h-32"
                                )}
                            />
                        </a>
                    </div>

                    {/* Right Items */}
                    <div className="flex-none w-[460px] flex justify-start items-center gap-3 pl-4">
                        {items.slice(5).map((item: any) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "text-[12px] xl:text-[13px] font-medium transition-colors hover:text-ufaal-blue whitespace-nowrap",
                                    forceSolid ? "text-gray-600" : "text-gray-200 hover:text-white"
                                )}
                            >
                                {item.label}
                            </a>
                        ))}

                        {/* Language Selector Desktop (In-flow) */}
                        <div className="ml-2">
                            <LanguageSelector isScrolled={forceSolid} />
                        </div>
                    </div>
                </div>

                {/* Mobile Logo & Spacer */}
                <div className={clsx(
                    "lg:hidden flex items-center transition-all duration-500 p-2 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10",
                    forceSolid ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                )}>
                    <a href="#/inicio">
                        <img
                            src="./images/logo_sin_fondo.png?v=3"
                            alt="Logo UFAAL"
                            className="h-24 w-auto object-contain transition-all duration-500 mix-blend-multiply brightness-110"
                        />
                    </a>
                </div>

                {/* Mobile menu button */}
                <div className="lg:hidden flex items-center gap-4 ml-auto">
                    <LanguageSelector isScrolled={forceSolid} />
                    <button
                        className="p-2 z-10"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X className={clsx("w-6 h-6", forceSolid ? "text-ufaal-blue" : "text-white")} />
                        ) : (
                            <Menu className={clsx("w-6 h-6", forceSolid ? "text-ufaal-blue" : "text-white")} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg border-b border-gray-100 lg:hidden flex flex-col p-4 gap-4 pb-8">
                    {items.map((item: any) => (
                        <a
                            key={item.href}
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
