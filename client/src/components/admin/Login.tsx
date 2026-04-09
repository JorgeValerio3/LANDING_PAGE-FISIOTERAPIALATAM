import { useState } from 'react';
import { Mail, Lock, LogIn, ShieldAlert, Loader2 } from 'lucide-react';
import { fetchClient } from '../../api';

interface LoginProps {
    onLogin: (token: string) => void;
}

export function Login({ onLogin }: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // QA: Limpia el error cuando el usuario intenta de nuevo
    const handleInputChange = (setter: (val: string) => void, value: string) => {
        setter(value);
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // QA: Validación mínima local y limpieza
        const cleanUsername = username.trim();
        const cleanPassword = password.trim();

        if (cleanUsername.length < 3) {
            setError('El usuario es demasiado corto');
            return;
        }

        if (cleanPassword.length < 4) {
            setError('La contraseña debe tener al menos 4 caracteres');
            return;
        }

        setError('');
        setLoading(true);

        try {
            await fetchClient('/admin/login', {
                method: 'POST',
                body: { username: cleanUsername, password: cleanPassword },
            });

            onLogin('success'); 
        } catch (err: any) {
            console.error('QA Error [Login]:', err);
            setError(err.message || 'Credenciales inválidas o error de servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-ufaal-blue/5">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100/50 animate-in zoom-in duration-300">
                <div className="bg-ufaal-blue px-8 py-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mt-20 -mr-20"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-ufaal-blue-light/20 rounded-full blur-2xl -mb-10 -ml-10"></div>
                    
                    <h2 className="text-3xl font-black relative z-10 flex items-center gap-3 tracking-tight uppercase italic">
                        <LogIn className="w-8 h-8" /> Panel Admin
                    </h2>
                    <p className="text-white/80 mt-2 font-medium relative z-10">Gestión de Contenidos UFAAL</p>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 py-4 px-5 rounded-r-2xl flex items-center gap-4 text-red-700 text-sm font-semibold animate-in slide-in-from-left-2">
                            <ShieldAlert className="w-5 h-5 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="block text-xs font-black text-ufaal-text uppercase tracking-widest ml-1">Usuario</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-ufaal-blue transition-colors" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => handleInputChange(setUsername, e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-ufaal-blue/10 focus:bg-white focus:border-ufaal-blue/30 transition-all font-medium"
                                    placeholder="admin_ufaal"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-black text-ufaal-text uppercase tracking-widest ml-1">Contraseña</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-ufaal-blue transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => handleInputChange(setPassword, e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-ufaal-blue/10 focus:bg-white focus:border-ufaal-blue/30 transition-all font-medium"
                                    placeholder="••••••••"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-ufaal-blue hover:bg-ufaal-blue-dark text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-ufaal-blue/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Verificando...
                            </>
                        ) : (
                            <>
                                <LogIn className="w-5 h-5" />
                                Acceder al Panel
                            </>
                        )}
                    </button>
                    
                    <div className="pt-4 flex flex-col items-center gap-2">
                         <div className="w-12 h-1 bg-gray-100 rounded-full"></div>
                         <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                            Acceso Protegido por SSL y JWT
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
