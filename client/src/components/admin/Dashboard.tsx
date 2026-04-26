import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    LayoutDashboard, LogOut, Save, Image as ImageIcon, Users, Activity, Search,
    Newspaper, CheckCircle2, Home, Globe, BookOpen, UserPlus, AlertCircle, Languages
} from 'lucide-react';
import { HeroForm } from './sections/HeroForm';
import { OrganizacionForm } from './sections/OrganizacionForm';
import { QuienesSomosForm } from './sections/QuienesSomosForm';
import { PaisesForm } from './sections/PaisesForm';
import { ActividadesForm } from './sections/ActividadesForm';
import { FormacionForm } from './sections/FormacionForm';
import { InvestigacionForm } from './sections/InvestigacionForm';
import { GaleriaForm } from './sections/GaleriaForm';
import { NoticiasForm } from './sections/NoticiasForm';
import { AfiliacionForm } from './sections/AfiliacionForm';
import { ContactoForm } from './sections/ContactoForm';
import { FooterForm } from './sections/FooterForm';
import { HistoriaForm } from './sections/HistoriaForm';
import { ColaboradoresForm } from './sections/ColaboradoresForm';
import { fetchClient } from '../../api';

const LANGS = [
    { code: 'es', label: 'ES', flag: '🇪🇸' },
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'fr', label: 'FR', flag: '🇫🇷' },
    { code: 'pt', label: 'PT', flag: '🇧🇷' },
];

export function Dashboard() {
    const [content, setContent] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('hero');
    const [activeLang, setActiveLang] = useState('es');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [fetchError, setFetchError] = useState<string | null>(null);

    const sections = useMemo(() => [
        { id: 'hero', label: 'Inicio (Hero)', icon: Home },
        { id: 'quienes_somos', label: 'Quiénes Somos', icon: Users },
        { id: 'organizacion', label: 'Estructura', icon: Globe },
        { id: 'paises', label: 'Países Miembros', icon: Globe },
        { id: 'actividades', label: 'Actividades', icon: Activity },
        { id: 'formacion', label: 'Formación', icon: BookOpen },
        { id: 'investigacion', label: 'Investigación', icon: Search },
        { id: 'galeria', label: 'Galería', icon: ImageIcon },
        { id: 'noticias', label: 'Noticias', icon: Newspaper },
        { id: 'afiliacion', label: 'Afiliación', icon: UserPlus },
        { id: 'contacto', label: 'Contacto', icon: LayoutDashboard },
        { id: 'historia', label: 'Historia', icon: BookOpen },
        { id: 'colaboradores', label: 'Colaboradores', icon: Users },
        { id: 'footer', label: 'Pie de Página', icon: LayoutDashboard },
    ], []);

    const fetchContent = useCallback(async (lang: string) => {
        setLoading(true);
        setFetchError(null);
        setContent(null);
        try {
            const data = await fetchClient(`/admin/content?lang=${lang}`);
            setContent(data);
        } catch (err: any) {
            console.error('QA Error [fetchContent]:', err);
            setFetchError(err.message || 'No se pudo conectar con el servidor backend.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Carga inicial y cuando cambia el idioma
    useEffect(() => {
        fetchContent(activeLang);
    }, [activeLang, fetchContent]);

    const handleLangChange = (lang: string) => {
        if (lang === activeLang) return;
        setActiveLang(lang);
        setMessage('');
        setErrorMsg('');
    };

    const handleSectionChange = useCallback((sectionKey: string, newData: any) => {
        setContent((prev: any) => ({ ...prev, [sectionKey]: newData }));
    }, []);

    const handleSave = async (sectionKey: string, sectionData: any) => {
        if (saving) return;
        setSaving(true);
        setMessage('');
        setErrorMsg('');
        try {
            if (!sectionData) throw new Error('No hay datos para guardar en esta sección');
            const responseData = await fetchClient(`/admin/content/${sectionKey}?lang=${activeLang}`, {
                method: 'PUT',
                body: sectionData,
            });
            setContent((prev: any) => ({ ...prev, [sectionKey]: responseData.section }));
            setMessage(`Sección guardada (${activeLang.toUpperCase()})`);
            setTimeout(() => setMessage(''), 4000);
        } catch (err: any) {
            console.error('QA Error [handleSave]:', err);
            setErrorMsg(err.message || 'Error inesperado al guardar');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetchClient('/admin/logout', { method: 'POST' });
        } catch (err) {
            console.error('QA Error [handleLogout]:', err);
        } finally {
            window.location.reload();
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 font-light text-gray-500">
                <div className="w-12 h-12 border-4 border-ufaal-blue border-t-transparent rounded-full animate-spin mb-4"></div>
                Cargando contenido ({activeLang.toUpperCase()})...
            </div>
        );
    }

    if (fetchError || !content) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-red-100">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Activity className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error de Conexión</h2>
                    <p className="text-gray-600 mb-8">{fetchError || 'No se pudo recuperar la información del servidor.'}</p>
                    <div className="space-y-3">
                        <button
                            onClick={() => fetchContent(activeLang)}
                            className="w-full bg-ufaal-blue text-white font-bold py-3 rounded-xl shadow-lg hover:bg-ufaal-blue-dark transition-all"
                        >
                            Reintentar Conexión
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full text-gray-500 font-medium py-2 hover:text-gray-700 transition-colors"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentSectionData = content[activeTab];
    const isTranslationLang = activeLang !== 'es';

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-ufaal-text text-white px-4 py-6 hidden md:flex flex-col shrink-0 overflow-y-auto border-r border-white/5">
                <div className="flex items-center gap-3 mb-6 px-2">
                    <LayoutDashboard className="w-6 h-6 text-ufaal-blue-light" />
                    <span className="text-lg font-bold tracking-tight text-white uppercase italic">UFAAL Admin</span>
                </div>

                {/* Selector de idioma en sidebar */}
                <div className="mb-6 px-2">
                    <div className="flex items-center gap-2 mb-2">
                        <Languages className="w-3 h-3 text-gray-500" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Idioma</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                        {LANGS.map((l) => (
                            <button
                                key={l.code}
                                onClick={() => handleLangChange(l.code)}
                                title={l.code.toUpperCase()}
                                className={`flex flex-col items-center py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                    activeLang === l.code
                                        ? 'bg-ufaal-blue text-white shadow'
                                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <span className="text-base leading-none">{l.flag}</span>
                                <span className="mt-0.5">{l.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <nav className="flex-grow space-y-1">
                    {sections.map((sec) => (
                        <button
                            key={sec.id}
                            onClick={() => setActiveTab(sec.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${activeTab === sec.id ? 'bg-ufaal-blue text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <sec.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${activeTab === sec.id ? 'text-white' : 'text-ufaal-blue-light/50'}`} />
                            <span className="font-medium text-sm">{sec.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-8 pt-6 border-t border-white/10 px-2 space-y-4">
                    <button
                        onClick={() => window.open('/', '_blank')}
                        className="w-full text-left text-xs text-gray-500 hover:text-white transition-colors"
                    >
                        Ver Sitio Público ↗
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 text-red-400/80 hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="font-semibold text-sm">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-4 md:p-8 h-screen overflow-y-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <div className="text-xs font-bold text-ufaal-blue uppercase tracking-widest mb-1">
                            Módulo de Contenidos —{' '}
                            <span className="text-ufaal-text">
                                {LANGS.find(l => l.code === activeLang)?.flag} {activeLang.toUpperCase()}
                            </span>
                        </div>
                        <h1 className="text-2xl font-black text-ufaal-text tracking-tight uppercase">
                            {sections.find(s => s.id === activeTab)?.label}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap justify-end">
                        {/* Selector de idioma en header (mobile-friendly) */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                            {LANGS.map((l) => (
                                <button
                                    key={l.code}
                                    onClick={() => handleLangChange(l.code)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        activeLang === l.code
                                            ? 'bg-white text-ufaal-blue shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <span>{l.flag}</span>
                                    <span>{l.label}</span>
                                </button>
                            ))}
                        </div>

                        {message && (
                            <span className="flex items-center gap-2 text-green-700 font-bold text-xs uppercase bg-green-50 px-4 py-2.5 rounded-xl border border-green-200">
                                <CheckCircle2 className="w-4 h-4" /> {message}
                            </span>
                        )}
                        {errorMsg && (
                            <span className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase bg-red-50 px-4 py-2.5 rounded-xl border border-red-200">
                                <AlertCircle className="w-4 h-4" /> {errorMsg}
                            </span>
                        )}
                        <button
                            onClick={() => handleSave(activeTab, currentSectionData)}
                            disabled={saving}
                            className="bg-ufaal-blue text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-ufaal-blue/20 hover:bg-ufaal-blue-dark hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Guardar ({activeLang.toUpperCase()})
                                </>
                            )}
                        </button>
                    </div>
                </header>

                {isTranslationLang && (
                    <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-start gap-3">
                        <span className="text-amber-500 text-lg mt-0.5">🌐</span>
                        <div>
                            <p className="text-amber-800 font-bold text-sm">
                                Editando versión {LANGS.find(l => l.code === activeLang)?.flag} {activeLang.toUpperCase()} — Cargada desde base de datos
                            </p>
                            <p className="text-amber-700 text-xs mt-0.5">
                                Traduce los campos de texto y guarda. Imágenes, URLs y datos numéricos son compartidos con ES.
                            </p>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 p-6 md:p-10">
                    <div className="animate-in fade-in duration-300">
                        {activeTab === 'hero' && <HeroForm data={currentSectionData} onChange={(d: any) => handleSectionChange('hero', d)} />}
                        {activeTab === 'quienes_somos' && <QuienesSomosForm data={currentSectionData} onChange={(d: any) => handleSectionChange('quienes_somos', d)} />}
                        {activeTab === 'organizacion' && <OrganizacionForm data={currentSectionData} onChange={(d: any) => handleSectionChange('organizacion', d)} />}
                        {activeTab === 'paises' && <PaisesForm data={currentSectionData} onChange={(d: any) => handleSectionChange('paises', d)} />}
                        {activeTab === 'actividades' && <ActividadesForm data={currentSectionData} onChange={(d: any) => handleSectionChange('actividades', d)} />}
                        {activeTab === 'formacion' && <FormacionForm data={currentSectionData} onChange={(d: any) => handleSectionChange('formacion', d)} />}
                        {activeTab === 'investigacion' && <InvestigacionForm data={currentSectionData} onChange={(d: any) => handleSectionChange('investigacion', d)} />}
                        {activeTab === 'galeria' && <GaleriaForm data={currentSectionData} onChange={(d: any) => handleSectionChange('galeria', d)} />}
                        {activeTab === 'noticias' && <NoticiasForm data={currentSectionData} onChange={(d: any) => handleSectionChange('noticias', d)} />}
                        {activeTab === 'afiliacion' && <AfiliacionForm data={currentSectionData} onChange={(d: any) => handleSectionChange('afiliacion', d)} />}
                        {activeTab === 'contacto' && <ContactoForm data={currentSectionData} onChange={(d: any) => handleSectionChange('contacto', d)} />}
                        {activeTab === 'historia' && <HistoriaForm data={currentSectionData} onChange={(d: any) => handleSectionChange('historia', d)} />}
                        {activeTab === 'colaboradores' && <ColaboradoresForm data={currentSectionData} onChange={(d: any) => handleSectionChange('colaboradores', d)} />}
                        {activeTab === 'footer' && <FooterForm data={currentSectionData} onChange={(d: any) => handleSectionChange('footer', d)} />}

                        {!['hero','quienes_somos','organizacion','paises','actividades','formacion',
                           'investigacion','galeria','noticias','afiliacion','contacto',
                           'historia','colaboradores','footer'].includes(activeTab) && (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400 italic">
                                <Search className="w-12 h-12 mb-4 opacity-10" />
                                <p>Editor para "{activeTab}" no disponible.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
