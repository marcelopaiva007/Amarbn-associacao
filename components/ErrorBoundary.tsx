'use client';

import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-red-600 mb-4">
                Algo deu errado
              </h1>
              <p className="text-gray-600 mb-4">
                Desculpe, ocorreu um erro inesperado. Por favor, tente recarregar a página.
              </p>
              {process.env.NODE_ENV === 'development' && (
                <details className="bg-gray-100 p-3 rounded text-sm">
                  <summary className="cursor-pointer font-mono text-gray-700">
                    Detalhes do erro
                  </summary>
                  <pre className="mt-2 text-xs overflow-auto text-gray-600">
                    {this.state.error?.toString()}
                  </pre>
                </details>
              )}
              <button
                onClick={() => window.location.reload()}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Recarregar página
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
