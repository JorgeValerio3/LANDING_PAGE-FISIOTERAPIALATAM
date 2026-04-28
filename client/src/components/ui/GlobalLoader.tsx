import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function GlobalLoader() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const isSlow = seconds >= 3;
  const isVerySlow = seconds >= 10;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-opacity duration-500">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-24 w-24 rounded-full border-4 border-ufaal-blue/20 animate-ping" />
        <div className="relative p-4 bg-white rounded-full shadow-xl">
          <img
            src="./images/ufaal.png"
            alt="Loading..."
            className="h-16 w-16 object-contain animate-pulse"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center max-w-xs text-center px-4">
        <h2 className="text-lg font-medium text-gray-800 animate-pulse">UFAAL</h2>

        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>
            {isSlow ? 'Conectando con el servidor...' : 'Cargando experiencia...'}
          </span>
        </div>

        {isSlow && (
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700 leading-relaxed animate-in fade-in duration-500">
            {isVerySlow
              ? '⏳ Esto está tardando más de lo normal. Nuestro servidor gratuito puede estar iniciando desde cero. Espera unos segundos más...'
              : '☕ Estamos despertando nuestro servidor para servirte mejor. Tarda unos segundos la primera visita del día...'}
          </div>
        )}

        {isVerySlow && (
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-xs text-gray-400 underline hover:text-gray-600 transition-colors"
          >
            Recargar página
          </button>
        )}
      </div>
    </div>
  );
}
