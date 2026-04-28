import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    LayoutDashboard, LogOut, Save, Image as ImageIcon, Users, Activity, Search,
    Newspaper, CheckCircle2, Home, Globe, BookOpen, UserPlus, AlertCircle, Languages,
    Menu, X, ExternalLink, ChevronRight, Server, FileText, Bell
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
import { AlertsPanel } from './AlertsPanel';
import { fetchClient, clearAdminToken } from '../../api';

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
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const sections = useMemo(() => [
        { id: 'avisos',        label: 'Avisos',           icon: Bell },
        { id: 'hero',          label: 'Inicio (Hero)',    icon: Home },
        { id: 'quienes_somos', label: 'Quiénes Somos',   icon: Users },
        { id: 'organizacion',  label: 'Estructura',       icon: Globe },
        { id: 'paises',        label: 'Países Miembros',  icon: Globe },
        { id: 'actividades',   label: 'Actividades',      icon: Activity },
        { id: 'formacion',     label: 'Formación',        icon: BookOpen },
        { id: 'investigacion', label: 'Investigación',    icon: Search },
        { id: 'galeria',       label: 'Galería',          icon: ImageIcon },
        { id: 'noticias',      label: 'Noticias',         icon: Newspaper },
        { id: 'afiliacion',    label: 'Afiliación',       icon: UserPlus },
        { id: 'contacto',      label: 'Contacto',         icon: LayoutDashboard },
        { id: 'historia',      label: 'Historia',         icon: BookOpen },
        { id: 'colaboradores', label: 'Colaboradores',    icon: Users },
        { id: 'footer',        label: 'Pie de Página',    icon: FileText },
    ], []);

    const fetchContent = useCallback(async (lang: string) => {
        setLoading(true);
        setFetchError(null);
        setContent(null);
        try {
            const raw = await fetchClient(`/admin/content?lang=${lang}`);
            const { _meta, ...data } = raw;
            setContent({ ...data, _meta });
        } catch (err: any) {
            console.error('QA Error [fetchContent]:', err);
            setFetchError(err.message || 'No se pudo conectar con el servidor backend.');
        } finally {
            setLoading(false);
        }
    }, []);

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

    const handleTabChange = (id: string) => {
        setActiveTab(id);
        setSidebarOpen(false);
    };

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
            setContent((prev: any) => ({
                ...prev,
                [sectionKey]: responseData.section,
                _meta: { source: 'db_exact', lang: activeLang },
            }));
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
        clearAdminToken();
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
            <div className="flex flex-col items-center justify-center min-h-screen bg-ufaal-gray font-light text-gray-400">
                <div className="w-10 h-10 border-[3px] border-ufaal-blue border-t-transparent rounded-full animate-spin mb-5"></div>
                <p className="text-sm font-medium text-gray-500">Cargando contenido</p>
                <p className="text-xs text-gray-400 mt-1">{activeLang.toUpperCase()}</p>
            </div>
        );
    }

    if (fetchError || !content) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-ufaal-gray p-6">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-red-100">
                    <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
                        <Server className="w-7 h-7" />
                    </div>
                    <h2 className="text-xl font-black text-gray-800 mb-2 tracking-tight">Error de Conexión</h2>
                    <p className="text-gray-500 text-sm mb-7">{fetchError || 'No se pudo recuperar la información del servidor.'}</p>
                    <div className="space-y-2">
                        <button
                            onClick={() => fetchContent(activeLang)}
                            className="w-full bg-ufaal-blue text-white font-bold py-3 rounded-xl shadow-lg hover:bg-ufaal-blue-light transition-all text-sm"
                        >
                            Reintentar Conexión
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full text-gray-400 font-medium py-2 hover:text-gray-600 transition-colors text-sm"
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
    const dataSource: 'db_exact' | 'db_fallback_es' | 'file_fallback' = content._meta?.source ?? 'db_exact';
    const currentLangFlag = LANGS.find(l => l.code === activeLang)?.flag ?? '';
    const activeSectionLabel = sections.find(s => s.id === activeTab)?.label ?? '';

    return (
        <div className="h-screen overflow-hidden flex bg-ufaal-gray">

            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── SIDEBAR ── */}
            <aside
                className={`
                    admin-sidebar
                    fixed md:relative inset-y-0 left-0 z-30
                    w-72 shrink-0 flex flex-col
                    bg-ufaal-blue h-full overflow-y-auto
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                {/* Brand */}
                <div className="flex items-center justify-between px-5 py-5 border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-ufaal-blue-light rounded-xl flex items-center justify-center shadow-lg">
                            <LayoutDashboard className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-white font-black text-sm tracking-widest uppercase leading-none">UFAAL</p>
                            <p className="text-white/35 text-[10px] tracking-wider uppercase mt-0.5">Panel de Administración</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Language selector */}
                <div className="px-5 py-4 border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-2 mb-3">
                        <Languages className="w-3 h-3 text-white/25" />
                        <span className="text-[10px] font-bold text-white/25 uppercase tracking-widest">Idioma de Edición</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                        {LANGS.map((l) => (
                            <button
                                key={l.code}
                                onClick={() => handleLangChange(l.code)}
                                title={l.code.toUpperCase()}
                                className={`
                                    flex flex-col items-center py-2.5 rounded-xl text-[10px] font-bold transition-all
                                    ${activeLang === l.code
                                        ? 'bg-ufaal-blue-light text-white shadow-md'
                                        : 'text-white/40 hover:text-white/80 hover:bg-white/10'
                                    }
                                `}
                            >
                                <span className="text-sm leading-none mb-1">{l.flag}</span>
                                <span>{l.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4">
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-3 pb-3">Secciones de Contenido</p>
                    <div className="space-y-0.5">
                        {sections.map((sec) => {
                            const isActive = activeTab === sec.id;
                            return (
                                <button
                                    key={sec.id}
                                    onClick={() => handleTabChange(sec.id)}
                                    className={`
                                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group
                                        ${isActive
                                            ? 'bg-ufaal-blue-light text-white shadow-md'
                                            : 'text-white/45 hover:text-white hover:bg-white/8 border border-transparent'
                                        }
                                    `}
                                >
                                    <div className={`
                                        w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all
                                        ${isActive ? 'bg-white/15' : 'bg-transparent group-hover:bg-white/10'}
                                    `}>
                                        <sec.icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`} />
                                    </div>
                                    <span className={`text-sm flex-1 text-left ${isActive ? 'font-semibold' : 'font-medium'}`}>
                                        {sec.label}
                                    </span>
                                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                {/* Sidebar footer */}
                <div className="px-4 py-4 border-t border-white/10 shrink-0 space-y-1">
                    <button
                        onClick={() => window.open('/', '_blank')}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-white/35 hover:text-white/70 hover:bg-white/8 transition-all text-xs font-medium"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Ver sitio público</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="font-semibold text-sm">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* ── MAIN ── */}
            <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">

                {/* Mobile top bar */}
                <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shrink-0">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors shrink-0"
                        aria-label="Abrir menú"
                    >
                        <Menu className="w-5 h-5 text-gray-700" />
                    </button>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-ufaal-blue uppercase tracking-widest leading-none">UFAAL Admin</p>
                        <h2 className="text-sm font-black text-ufaal-text truncate mt-0.5">{activeSectionLabel}</h2>
                    </div>
                    {activeTab !== 'avisos' && (
                        <button
                            onClick={() => handleSave(activeTab, currentSectionData)}
                            disabled={saving}
                            className="flex items-center gap-1.5 bg-ufaal-blue text-white px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-50 shrink-0 shadow-md"
                        >
                            {saving
                                ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                : <Save className="w-3.5 h-3.5" />
                            }
                            <span>Guardar</span>
                        </button>
                    )}
                </div>

                {/* Scrollable content */}
                <main className="flex-1 overflow-y-auto admin-main-scroll">

                    {/* Desktop header */}
                    <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-10">
                        <div>
                            <div className="flex items-center gap-2 text-xs mb-1">
                                <span className="font-black text-ufaal-blue uppercase tracking-widest">Módulo de Contenidos</span>
                                <ChevronRight className="w-3 h-3 text-gray-300" />
                                <span className="text-gray-400 font-medium">{activeSectionLabel}</span>
                                <span className="ml-1 inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full text-[10px] font-bold text-gray-500">
                                    {currentLangFlag} {activeLang.toUpperCase()}
                                </span>
                            </div>
                            <h1 className="text-lg font-black text-ufaal-text tracking-tight">{activeSectionLabel}</h1>
                        </div>

                        <div className="flex items-center gap-2.5">
                            {message && (
                                <span className="flex items-center gap-2 text-green-700 font-bold text-xs bg-green-50 px-4 py-2 rounded-xl border border-green-200">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> {message}
                                </span>
                            )}
                            {errorMsg && (
                                <span className="flex items-center gap-2 text-red-700 font-bold text-xs bg-red-50 px-4 py-2 rounded-xl border border-red-200">
                                    <AlertCircle className="w-3.5 h-3.5" /> {errorMsg}
                                </span>
                            )}
                            {activeTab !== 'avisos' && (
                                <button
                                    onClick={() => handleSave(activeTab, currentSectionData)}
                                    disabled={saving}
                                    className="bg-ufaal-blue text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-ufaal-blue/20 hover:bg-ufaal-blue-light hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 text-sm"
                                >
                                    {saving ? (
                                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Guardando...</>
                                    ) : (
                                        <><Save className="w-4 h-4" /> Guardar ({activeLang.toUpperCase()})</>
                                    )}
                                </button>
                            )}
                        </div>
                    </header>

                    <div className="p-4 md:p-8 max-w-5xl">

                        {/* Status banners */}
                        {dataSource === 'db_exact' && isTranslationLang && (
                            <div className="mb-5 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3.5 flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-emerald-800 font-bold text-sm">
                                        {currentLangFlag} {activeLang.toUpperCase()} — Cargado desde MongoDB
                                    </p>
                                    <p className="text-emerald-700 text-xs mt-0.5">
                                        Versión traducida guardada. Edita y guarda para actualizar.
                                    </p>
                                </div>
                            </div>
                        )}
                        {dataSource === 'db_fallback_es' && (
                            <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5 flex items-start gap-3">
                                <Globe className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-amber-800 font-bold text-sm">
                                        {currentLangFlag} {activeLang.toUpperCase()} — No existe en MongoDB. Mostrando base en Español.
                                    </p>
                                    <p className="text-amber-700 text-xs mt-0.5">
                                        Traduce los campos de texto y pulsa Guardar para crear el documento {activeLang.toUpperCase()}.
                                    </p>
                                </div>
                            </div>
                        )}
                        {dataSource === 'file_fallback' && (
                            <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-5 py-3.5 flex items-start gap-3">
                                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-red-800 font-bold text-sm">MongoDB sin conexión — Datos cargados desde archivo local</p>
                                    <p className="text-red-700 text-xs mt-0.5">
                                        Los cambios no se guardarán hasta restaurar la conexión con la base de datos.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Form card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                            <div className="animate-in fade-in duration-300">
                                {activeTab === 'avisos' && (
                                    <AlertsPanel
                                        onNavigate={(lang, section) => {
                                            handleLangChange(lang);
                                            setActiveTab(section);
                                            setSidebarOpen(false);
                                        }}
                                    />
                                )}
                                {activeTab === 'hero'          && <HeroForm          data={currentSectionData} onChange={(d: any) => handleSectionChange('hero', d)} />}
                                {activeTab === 'quienes_somos' && <QuienesSomosForm  data={currentSectionData} onChange={(d: any) => handleSectionChange('quienes_somos', d)} />}
                                {activeTab === 'organizacion'  && <OrganizacionForm  data={currentSectionData} onChange={(d: any) => handleSectionChange('organizacion', d)} />}
                                {activeTab === 'paises'        && <PaisesForm        data={currentSectionData} onChange={(d: any) => handleSectionChange('paises', d)} />}
                                {activeTab === 'actividades'   && <ActividadesForm   data={currentSectionData} onChange={(d: any) => handleSectionChange('actividades', d)} />}
                                {activeTab === 'formacion'     && <FormacionForm     data={currentSectionData} onChange={(d: any) => handleSectionChange('formacion', d)} />}
                                {activeTab === 'investigacion' && <InvestigacionForm data={currentSectionData} onChange={(d: any) => handleSectionChange('investigacion', d)} />}
                                {activeTab === 'galeria'       && <GaleriaForm       data={currentSectionData} onChange={(d: any) => handleSectionChange('galeria', d)} />}
                                {activeTab === 'noticias'      && <NoticiasForm      data={currentSectionData} onChange={(d: any) => handleSectionChange('noticias', d)} />}
                                {activeTab === 'afiliacion'    && <AfiliacionForm    data={currentSectionData} onChange={(d: any) => handleSectionChange('afiliacion', d)} />}
                                {activeTab === 'contacto'      && <ContactoForm      data={currentSectionData} onChange={(d: any) => handleSectionChange('contacto', d)} />}
                                {activeTab === 'historia'      && <HistoriaForm      data={currentSectionData} onChange={(d: any) => handleSectionChange('historia', d)} />}
                                {activeTab === 'colaboradores' && <ColaboradoresForm data={currentSectionData} onChange={(d: any) => handleSectionChange('colaboradores', d)} />}
                                {activeTab === 'footer'        && <FooterForm        data={currentSectionData} onChange={(d: any) => handleSectionChange('footer', d)} />}

                                {!['avisos','hero','quienes_somos','organizacion','paises','actividades','formacion',
                                   'investigacion','galeria','noticias','afiliacion','contacto',
                                   'historia','colaboradores','footer'].includes(activeTab) && (
                                    <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                                        <Search className="w-10 h-10 mb-4" />
                                        <p className="text-sm">Editor para "{activeTab}" no disponible.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile save button area */}
                        {activeTab !== 'avisos' && (
                            <div className="md:hidden mt-5">
                                {message && (
                                    <div className="flex items-center gap-2 text-green-700 font-bold text-xs bg-green-50 px-4 py-3 rounded-xl border border-green-200 mb-3">
                                        <CheckCircle2 className="w-4 h-4" /> {message}
                                    </div>
                                )}
                                {errorMsg && (
                                    <div className="flex items-center gap-2 text-red-700 font-bold text-xs bg-red-50 px-4 py-3 rounded-xl border border-red-200 mb-3">
                                        <AlertCircle className="w-4 h-4" /> {errorMsg}
                                    </div>
                                )}
                                <button
                                    onClick={() => handleSave(activeTab, currentSectionData)}
                                    disabled={saving}
                                    className="w-full bg-ufaal-blue text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-ufaal-blue/20 disabled:opacity-50 text-sm"
                                >
                                    {saving ? (
                                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Guardando...</>
                                    ) : (
                                        <><Save className="w-4 h-4" /> Guardar ({activeLang.toUpperCase()})</>
                                    )}
                                </button>
                            </div>
                        )}

                    </div>
                </main>
            </div>
        </div>
    );
}
