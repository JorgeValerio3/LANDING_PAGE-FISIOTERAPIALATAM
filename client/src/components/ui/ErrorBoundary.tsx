import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`ErrorBoundary caught error in [${this.props.name || 'Unknown'}]:`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="p-8 my-4 bg-red-50 border border-red-100 rounded-[2rem] text-center">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-red-800 mb-2">Sección temporalmente no disponible</h3>
          <p className="text-red-600/70 text-sm mb-6 max-w-md mx-auto">
            Lo sentimos, ha ocurrido un error al cargar este contenido. Estamos trabajando para solucionarlo.
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all mx-auto shadow-lg shadow-red-600/20"
          >
            <RefreshCw className="w-4 h-4" /> Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
