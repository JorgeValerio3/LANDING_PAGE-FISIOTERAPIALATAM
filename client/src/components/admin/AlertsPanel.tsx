import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, ChevronRight, RefreshCw, Globe } from 'lucide-react';
import { fetchClient } from '../../api';

interface AlertsPanelProps {
    onNavigate: (lang: string, section: string) => void;
}

const SECTION_LABELS: Record<string, string> = {
    hero: 'Inicio (Hero)',
    quienes_somos: 'Quiénes Somos',
    organizacion: 'Estructura',
    paises: 'Países Miembros',
    actividades: 'Actividades',
    formacion: 'Formación',
    investigacion: 'Investigación',
    galeria: 'Galería',
    noticias: 'Noticias',
    afiliacion: 'Afiliación',
    contacto: 'Contacto',
    historia: 'Historia',
    colaboradores: 'Colaboradores',
    footer: 'Pie de Página',
};

const LANG_FLAGS: Record<string, string> = {
    en: '🇺🇸',
    fr: '🇫🇷',
    pt: '🇧🇷',
};

const STATUS_LABELS: Record<string, string> = {
    not_saved: 'No guardado en este idioma',
    untranslated: 'Posiblemente sin traducir',
    empty: 'Sin contenido',
};

export function AlertsPanel({ onNavigate }: AlertsPanelProps) {
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStatus = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchClient('/admin/content-status');
            setStatus(data);
        } catch (err: any) {
            setError(err.message || 'Error al cargar estado');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 border-2 border-ufaal-blue border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !status) {
        return (
            <div className="text-center py-10 text-red-500 text-sm">{error || 'Sin datos'}</div>
        );
    }

    type LangAlert =
        | { type: 'no_document' }
        | { type: 'section_issues'; sections: Array<{ section: string; issueType: string }> };

    const langAlerts: Record<string, LangAlert> = {};

    for (const lang of ['en', 'fr', 'pt']) {
        const langStatus = status[lang];
        if (!langStatus) continue;

        if (langStatus.source !== 'db_exact') {
            langAlerts[lang] = { type: 'no_document' };
        } else {
            const problemSections = Object.entries<string>(langStatus.sections || {})
                .filter(([, s]) => s !== 'ok')
                .map(([section, issueType]) => ({ section, issueType }));

            if (problemSections.length > 0) {
                langAlerts[lang] = { type: 'section_issues', sections: problemSections };
            }
        }
    }

    const totalAlerts = Object.values(langAlerts).reduce((acc, a) => {
        if (a.type === 'no_document') return acc + Object.keys(SECTION_LABELS).length;
        return acc + a.sections.length;
    }, 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-black text-ufaal-text">Panel de Avisos</h2>
                    <p className="text-sm text-gray-400 mt-1">Secciones con contenido pendiente por idioma</p>
                </div>
                <button
                    onClick={fetchStatus}
                    className="flex items-center gap-2 text-xs text-gray-400 hover:text-ufaal-blue px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Actualizar
                </button>
            </div>

            {/* Resumen por idioma */}
            <div className="grid grid-cols-3 gap-4">
                {(['en', 'fr', 'pt'] as const).map(lang => {
                    const alert = langAlerts[lang];
                    const hasIssues = !!alert;
                    const langStatus = status[lang];

                    let issueCount = 0;
                    if (alert?.type === 'no_document') issueCount = Object.keys(SECTION_LABELS).length;
                    else if (alert?.type === 'section_issues') issueCount = alert.sections.length;

                    return (
                        <div
                            key={lang}
                            className={`rounded-xl p-4 border ${hasIssues ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">{LANG_FLAGS[lang]}</span>
                                <span className="font-black text-sm">{lang.toUpperCase()}</span>
                            </div>
                            {!hasIssues ? (
                                <p className="text-emerald-700 text-xs font-medium flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Todo completo
                                </p>
                            ) : (
                                <p className="text-amber-700 text-xs font-medium">
                                    {issueCount} sección{issueCount !== 1 ? 'es' : ''} pendiente{issueCount !== 1 ? 's' : ''}
                                </p>
                            )}
                            {langStatus?.source !== 'db_exact' && (
                                <p className="text-amber-600 text-[10px] mt-1 flex items-center gap-1">
                                    <Globe className="w-3 h-3" /> Sin documento en MongoDB
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Lista de avisos */}
            {totalAlerts === 0 ? (
                <div className="text-center py-12 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                    <p className="text-emerald-700 font-bold">Todo el contenido está completo</p>
                    <p className="text-emerald-600 text-sm mt-1">Todos los idiomas tienen su contenido guardado</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {(['en', 'fr', 'pt'] as const).map(lang => {
                        const alert = langAlerts[lang];
                        if (!alert) return null;

                        if (alert.type === 'no_document') {
                            return (
                                <div key={lang} className="bg-white border border-amber-200 rounded-xl p-5">
                                    <div className="flex items-start gap-3 mb-4">
                                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-bold text-sm text-ufaal-text">
                                                {LANG_FLAGS[lang]} {lang.toUpperCase()} — Sin documento guardado
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                Este idioma nunca ha sido guardado en MongoDB. Todas las secciones están pendientes.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(SECTION_LABELS).map(([section, label]) => (
                                            <button
                                                key={section}
                                                onClick={() => onNavigate(lang, section)}
                                                className="flex items-center justify-between gap-2 px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg text-left transition-colors group"
                                            >
                                                <span className="text-xs font-medium text-amber-800 truncate">{label}</span>
                                                <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-600 shrink-0" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={lang} className="bg-white border border-gray-100 rounded-xl p-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                                    <p className="font-bold text-sm text-ufaal-text">
                                        {LANG_FLAGS[lang]} {lang.toUpperCase()} — {alert.sections.length} sección{alert.sections.length !== 1 ? 'es' : ''} pendiente{alert.sections.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    {alert.sections.map(({ section, issueType }) => (
                                        <button
                                            key={section}
                                            onClick={() => onNavigate(lang, section)}
                                            className="w-full flex items-center gap-4 px-4 py-3 bg-gray-50 hover:bg-ufaal-blue/5 border border-gray-100 hover:border-ufaal-blue/20 rounded-xl text-left transition-all group"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-ufaal-text">
                                                    {SECTION_LABELS[section] || section}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {STATUS_LABELS[issueType] || issueType}
                                                </p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-ufaal-blue shrink-0 transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
