import Link from 'next/link';
import { IoHelpCircleOutline, IoArrowBack } from 'react-icons/io5';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-slate-800 p-10 rounded-2xl shadow-2xl border border-slate-700 max-w-lg">
        <IoHelpCircleOutline size={100} className="text-yellow-400 mx-auto mb-6" />
        <h1 className="text-6xl font-black text-white mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-300 mb-4">
          ¡Entrenador, te has perdido!
        </h2>
        <p className="text-slate-400 mb-8">
          La página que buscas no existe en nuestra base de datos Pokémon. 
          Tal vez fue obra de un Abra usando Teletransporte.
        </p>
        <Link
          href="/pokemon"
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-xl transition-colors"
        >
          <IoArrowBack size={20} />
          Volver a la Pokédex
        </Link>
      </div>
    </div>
  );
}