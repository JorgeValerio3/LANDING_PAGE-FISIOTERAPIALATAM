import { Loader2 } from "lucide-react";

export function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-opacity duration-500">
      <div className="relative flex items-center justify-center">
        {/* Animated outer ring */}
        <div className="absolute h-24 w-24 rounded-full border-4 border-ufaal-blue/20 animate-ping" />
        {/* Logo or specialized spinner */}
        <div className="relative p-4 bg-white dark:bg-gray-900 rounded-full shadow-xl">
           <img 
              src="./images/ufaal.png" 
              alt="Loading..." 
              className="h-16 w-16 object-contain animate-pulse"
           />
        </div>
      </div>
      
      <div className="mt-8 flex flex-col items-center">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100 animate-pulse">
          UFAAL
        </h2>
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Cargando experiencia...</span>
        </div>
      </div>
    </div>
  );
}
