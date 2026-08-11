'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Erro na página
        </h1>
        <p className="text-gray-600 mb-4">
          Desculpe, ocorreu um erro ao carregar esta página. Por favor, tente novamente.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <details className="bg-gray-100 p-3 rounded text-sm mb-4">
            <summary className="cursor-pointer font-mono text-gray-700">
              Detalhes do erro
            </summary>
            <pre className="mt-2 text-xs overflow-auto text-gray-600">
              {error.message}
            </pre>
          </details>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => reset()}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Tentar novamente
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition"
          >
            Ir para home
          </button>
        </div>
      </div>
    </div>
  );
}
