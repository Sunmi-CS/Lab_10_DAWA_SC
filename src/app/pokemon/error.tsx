'use client';

import { useEffect } from 'react';
import { IoAlertCircleOutline, IoRefreshOutline } from 'react-icons/io5';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Opcional: Registrar el error en un servicio de monitoreo
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-white">
      <IoAlertCircleOutline size={80} className="text-red-500 mb-4 animate-pulse" />
      <h2 className="text-3xl font-bold mb-2">¡Algo salió mal!</h2>
      <p className="text-purple-200 mb-8 text-center max-w-md">
        No pudimos cargar la información de los Pokémon en este momento. 
        Por favor, intenta de nuevo.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 bg-white text-purple-700 px-6 py-3 rounded-full font-bold hover:bg-purple-100 transition-all shadow-lg"
      >
        <IoRefreshOutline size={20} />
        Reintentar
      </button>
    </div>
  );
}