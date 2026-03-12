import { useState, useEffect } from 'react';
import { 
    LayoutDashboard, LogOut, Save, Image as ImageIcon, Users, Activity, Search,
    Newspaper, CheckCircle2, Home, Globe, BookOpen, UserPlus, Phone
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

export function Dashboard() {
    const [content, setContent] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('hero');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const token = localStorage.getItem('admin_token');

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/content');
            const data = await res.json();
            setContent(data);
        } catch (err) {
            console.error('Error fetching content', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (sectionKey: string, sectionData: any) => {
        setSaving(true);
        setMessage('');
        try {
            const res = await fetch(`http://localhost:5000/api/admin/content/${sectionKey}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(sectionData),
            });
            if (res.ok) {
                const responseData = await res.json();
                setContent((prev: any) => ({ ...prev, [sectionKey]: responseData.section }));
                setMessage('Sección guardada exitosamente');
                setTimeout(() => setMessage(''), 3000);
            } else {
                const errData = await res.json();
                alert(`Error: ${errData.error}`);
            }
        } catch (err) {
            alert('Error de conexión al guardar');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        window.location.reload();
    };

    if (loading || !content) {
        return <div className="flex items-center justify-center min-h-screen font-light text-gray-500">
            Cargando sistema CMS...
        </div>;
    }

    const sections = [
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
    ];

    const currentSectionData = content[activeTab];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-ufaal-text text-white px-4 py-6 hidden md:flex flex-col shrink-0 overflow-y-auto">
                <div className="flex items-center gap-3 mb-8 px-2">
                    <LayoutDashboard className="w-6 h-6 text-ufaal-blue-light" />
                    <span className="text-lg font-bold tracking-tight text-white">UFAAL Admin</span>
                </div>

                <nav className="flex-grow space-y-1">
                    {sections.map((sec) => (
                        <button
                            key={sec.id}
                            onClick={() => setActiveTab(sec.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${activeTab === sec.id ? 'bg-ufaal-blue text-white shadow' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <sec.icon className="w-4 h-4" />
                            <span className="font-medium text-sm">{sec.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-8 pt-6 border-t border-white/10 px-2 space-y-4">
                     <button 
                        onClick={() => window.open('/', '_blank')}
                        className="w-full text-left text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Ver Sitio Web
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
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
                        <h1 className="text-2xl font-bold text-ufaal-text">Gestionando: {sections.find(s => s.id === activeTab)?.label}</h1>
                        <p className="text-gray-500 text-sm mt-1">Los cambios se aplican de forma independiente por sección.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {message && (
                            <span className="flex items-center gap-2 text-green-700 font-medium text-sm bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                                <CheckCircle2 className="w-4 h-4" /> {message}
                            </span>
                        )}
                        <button
                            onClick={() => handleSave(activeTab, currentSectionData)}
                            disabled={saving}
                            className="bg-ufaal-blue text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow hover:bg-ufaal-blue-dark transition-all disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? 'Guardando...' : 'Guardar Sección'}
                        </button>
                    </div>
                </header>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                    {/* Render specialized form components or generic ones */}
                    {activeTab === 'hero' && <HeroForm data={currentSectionData} onChange={(newData: any) => setContent({ ...content, hero: newData })} />}
                    {activeTab === 'quienes_somos' && <QuienesSomosForm data={currentSectionData} onChange={(newData: any) => setContent({ ...content, quienes_somos: newData })} />}
                    {activeTab === 'organizacion' && <OrganizacionForm data={currentSectionData} onChange={(newData: any) => setContent({ ...content, organizacion: newData })} />}
                    {activeTab === 'paises' && <PaisesForm data={currentSectionData} onChange={(newData: any) => setContent({ ...content, paises: newData })} />}
                    {activeTab === 'actividades' && <ActividadesForm data={currentSectionData} onChange={(newData: any) => setContent({ ...content, actividades: newData })} />}
                    {activeTab === 'formacion' && <FormacionForm data={currentSectionData} onChange={(newData: any) => setContent({ ...content, formacion: newData })} />}
                    {activeTab === 'investigacion' && <InvestigacionForm data={currentSectionData} onChange={(newData: any) => setContent({ ...content, investigacion: newData })} />}
                    {activeTab === 'galeria' && <GaleriaForm data={currentSectionData} onChange={(newData: any) => setContent({ ...content, galeria: newData })} />}
                    {activeTab === 'noticias' && <NoticiasForm data={currentSectionData} onChange={(newData: any) => setContent({ ...content, noticias: newData })} />}
                    { activeTab === 'afiliacion' && <AfiliacionForm data={currentSectionData} onChange={(newData: any) => setContent({ ...content, afiliacion: newData })} />}

                    {/* Fallback para los que aún no tienen componente */}
                    {![
                        'hero', 'quienes_somos', 'organizacion', 'paises', 'actividades',
                        'formacion', 'investigacion', 'galeria', 'noticias', 'afiliacion'
                    ].includes(activeTab) && (
                        <div className="text-gray-500 italic">Componente de formulario para "{activeTab}" en desarrollo... Se puede editar el JSON directamente.</div>
                    )}
                </div>
            </main>
        </div>
    );
}
