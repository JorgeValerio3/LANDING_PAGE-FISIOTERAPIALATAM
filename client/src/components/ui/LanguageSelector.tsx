import { useState, useRef, useEffect } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import { Globe, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

const languages = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
];

export function LanguageSelector({ isScrolled }: { isScrolled: boolean }) {
  const { currentLang, changeLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300",
          isScrolled 
            ? "border-gray-200 text-gray-700 bg-white hover:bg-gray-50" 
            : "border-white/20 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm"
        )}
      >
        <Globe className="w-4 h-4 opacity-70" />
        <span className="text-xs font-bold uppercase tracking-wider">{currentLang}</span>
        <ChevronDown className={clsx("w-3 h-3 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                changeLanguage(lang.code as any);
                setIsOpen(false);
              }}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                currentLang === lang.code 
                  ? "bg-ufaal-blue/5 text-ufaal-blue font-bold" 
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
