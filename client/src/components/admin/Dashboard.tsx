import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
    LayoutDashboard, LogOut, Save, Image as ImageIcon, Users, Activity, Search,
    Newspaper, CheckCircle2, Home, Globe, BookOpen, UserPlus, AlertCircle
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
import { fetchClient } from '../../api';

export function Dashboard() {
    const [content, setContent] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('hero');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [fetchError, setFetchError] = useState<string | null>(null);

    // QA: Definición estática de secciones con useMemo para rendimiento
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
        { id: 'afiliacion', label: 'Afiliacion', icon: UserPlus },
    ], []);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setLoading(true);
        setFetchError(null);
        try {
            const data = await fetchClient('/admin/content');
            setContent(data);
        } catch (err: any) {
            console.error('QA Error [fetchContent]:', err);
            setFetchError(err.message || 'No se pudo conectar con el servidor backend.');
        } finally {
            setLoading(false);
        }
    };

    // QA: Memoizar el manejador de cambios para evitar recreación de lambdas en cada render
    const handleSectionChange = useCallback((sectionKey: string, newData: any) => {
        setContent((prev: any) => ({
            ...prev,
            [sectionKey]: newData
        }));
    }, []);

    const handleSave = async (sectionKey: string, sectionData: any) => {
        if (saving) return;
        
        setSaving(true);
        setMessage('');
        setErrorMsg('');
        
        try {
            // QA: Validación previa al envío
            if (!sectionData) throw new Error('No hay datos para guardar en esta sección');

            const responseData = await fetchClient(`/admin/content/${sectionKey}`, {
                method: 'PUT',
                body: sectionData,
            });

            setContent((prev: any) => ({ ...prev, [sectionKey]: responseData.section }));
            setMessage('Sección guardada exitosamente');
            
            // Auto-cerrado de mensaje después de un tiempo
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
                Sincronizando con Servidor UFAAL...
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
                            onClick={fetchContent}
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

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-ufaal-text text-white px-4 py-6 hidden md:flex flex-col shrink-0 overflow-y-auto border-r border-white/5">
                <div className="flex items-center gap-3 mb-8 px-2">
                    <LayoutDashboard className="w-6 h-6 text-ufaal-blue-light" />
                    <span className="text-lg font-bold tracking-tight text-white uppercase italic">UFAAL Admin</span>
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
                        <div className="text-xs font-bold text-ufaal-blue uppercase tracking-widest mb-1">Módulo de Contenidos</div>
                        <h1 className="text-2xl font-black text-ufaal-text tracking-tight uppercase">{sections.find(s => s.id === activeTab)?.label}</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {message && (
                            <span className="flex items-center gap-2 text-green-700 font-bold text-xs uppercase bg-green-50 px-4 py-2.5 rounded-xl border border-green-200 animate-in fade-in slide-in-from-top-2">
                                <CheckCircle2 className="w-4 h-4" /> {message}
                            </span>
                        )}
                        {errorMsg && (
                            <span className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase bg-red-50 px-4 py-2.5 rounded-xl border border-red-200 animate-in shake">
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
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </header>

                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 p-6 md:p-10">
                    <div className="animate-in fade-in duration-500">
                      {activeTab === 'hero' && <HeroForm data={currentSectionData} onChange={(newData: any) => handleSectionChange('hero', newData)} />}
                      {activeTab === 'quienes_somos' && <QuienesSomosForm data={currentSectionData} onChange={(newData: any) => handleSectionChange('quienes_somos', newData)} />}
                      {activeTab === 'organizacion' && <OrganizacionForm data={currentSectionData} onChange={(newData: any) => handleSectionChange('organizacion', newData)} />}
                      {activeTab === 'paises' && <PaisesForm data={currentSectionData} onChange={(newData: any) => handleSectionChange('paises', newData)} />}
                      {activeTab === 'actividades' && <ActividadesForm data={currentSectionData} onChange={(newData: any) => handleSectionChange('actividades', newData)} />}
                      {activeTab === 'formacion' && <FormacionForm data={currentSectionData} onChange={(newData: any) => handleSectionChange('formacion', newData)} />}
                      {activeTab === 'investigacion' && <InvestigacionForm data={currentSectionData} onChange={(newData: any) => handleSectionChange('investigacion', newData)} />}
                      {activeTab === 'galeria' && <GaleriaForm data={currentSectionData} onChange={(newData: any) => handleSectionChange('galeria', newData)} />}
                      {activeTab === 'noticias' && <NoticiasForm data={currentSectionData} onChange={(newData: any) => handleSectionChange('noticias', newData)} />}
                      { activeTab === 'afiliacion' && <AfiliacionForm data={currentSectionData} onChange={(newData: any) => handleSectionChange('afiliacion', newData)} />}

                      {![
                          'hero', 'quienes_somos', 'organizacion', 'paises', 'actividades',
                          'formacion', 'investigacion', 'galeria', 'noticias', 'afiliacion'
                      ].includes(activeTab) && (
                          <div className="flex flex-col items-center justify-center py-20 text-gray-400 italic">
                              <Search className="w-12 h-12 mb-4 opacity-10" />
                              <p>El editor para "{activeTab}" está siendo optimizado.</p>
                          </div>
                      )}
                    </div>
                </div>
            </main>
        </div>
    );
}
