import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Página não encontrada</h2>
        <p className="text-gray-600 mb-6">
          Desculpe, a página que você está procurando não existe.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
        >
          Voltar para home
        </Link>
      </div>
    </div>
  );
}
