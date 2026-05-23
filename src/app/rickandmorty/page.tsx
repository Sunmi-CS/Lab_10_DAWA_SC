// ============================================================
// PÁGINA PRINCIPAL - Lista de Personajes
// Estrategia: SSG con cache forzado (force-cache)
// Justificación: Los personajes de Rick & Morty son datos
// estables que no cambian frecuentemente. Usar SSG garantiza
// tiempos de carga ultrarrápidos sirviendo HTML pre-generado
// desde el CDN. force-cache almacena la respuesta
// indefinidamente hasta que se invalide manualmente.
// ============================================================

import { CharacterListResponse } from "@/types/rickandmorty";
import Link from "next/link";
import Image from "next/image";
import { IoSearch, IoTv, IoPlanet } from "react-icons/io5";

async function getAllCharacters(): Promise<CharacterListResponse> {
  // SSG: force-cache almacena en caché permanentemente (build time)
  const res = await fetch("https://rickandmortyapi.com/api/character", {
    cache: "force-cache",
  });
  if (!res.ok) throw new Error("Error al cargar los personajes");
  return res.json();
}

const STATUS_COLORS: Record<string, string> = {
  Alive: "bg-emerald-400",
  Dead: "bg-red-500",
  unknown: "bg-gray-400",
};

const STATUS_LABELS: Record<string, string> = {
  Alive: "Vivo",
  Dead: "Muerto",
  unknown: "Desconocido",
};

export default async function RickAndMortyPage() {
  const data = await getAllCharacters();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d1a] via-[#111827] to-[#0a1628]">
      {/* HERO HEADER */}
      <header className="relative overflow-hidden border-b border-cyan-900/30 bg-black/40 backdrop-blur-sm">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 py-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <IoPlanet className="text-cyan-400 text-5xl animate-spin-slow" />
            <h1 className="text-5xl md:text-6xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-green-400 to-emerald-300 bg-clip-text text-transparent">
                Rick &amp; Morty
              </span>
            </h1>
            <IoTv className="text-green-400 text-5xl" />
          </div>
          <p className="text-cyan-300/70 text-lg max-w-xl mx-auto leading-relaxed">
            Explora el universo multidimensional · {data.info.count} personajes
          </p>

          {/* Botón de búsqueda */}
          <Link
            href="/rickandmorty/buscar"
            className="inline-flex items-center gap-2 mt-8 px-7 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold text-sm shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/60 hover:scale-105 transition-all duration-300"
          >
            <IoSearch size={18} />
            Buscar Personajes
          </Link>
        </div>
      </header>

      {/* STATS BAR */}
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-3 gap-4">
        {[
          { label: "Total Personajes", value: data.info.count, color: "cyan" },
          { label: "Páginas", value: data.info.pages, color: "green" },
          {
            label: "En esta página",
            value: data.results.length,
            color: "emerald",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-cyan-800/30 bg-black/30 backdrop-blur-sm p-4 text-center"
          >
            <p className={`text-3xl font-black text-${s.color}-400`}>
              {s.value}
            </p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* GRID DE PERSONAJES */}
      <main className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {data.results.map((character) => (
            <Link
              key={character.id}
              href={`/rickandmorty/${character.id}`}
              className="group relative rounded-2xl overflow-hidden border border-cyan-900/30 bg-black/40 backdrop-blur-sm hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1"
            >
              {/* IMAGEN con Lazy Loading */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={character.image}
                  alt={character.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Overlay degradado */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                {/* Status badge */}
                <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/70 rounded-full px-2 py-1">
                  <span
                    className={`w-2 h-2 rounded-full ${STATUS_COLORS[character.status] ?? "bg-gray-400"}`}
                  />
                  <span className="text-[10px] font-semibold text-white">
                    {STATUS_LABELS[character.status] ?? character.status}
                  </span>
                </div>
              </div>

              {/* INFO */}
              <div className="p-3">
                <h2 className="text-white font-bold text-sm leading-tight line-clamp-1 group-hover:text-cyan-300 transition-colors">
                  {character.name}
                </h2>
                <p className="text-gray-400 text-xs mt-1">{character.species}</p>
                <p className="text-cyan-600 text-xs font-mono mt-0.5">
                  #{character.id.toString().padStart(3, "0")}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* NOTA TÉCNICA */}
        <div className="mt-12 rounded-2xl border border-cyan-900/30 bg-black/30 p-6">
          <h3 className="text-cyan-400 font-bold mb-2 text-sm uppercase tracking-widest">
            📋 Estrategia de Rendering
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            <strong className="text-white">SSG (Static Site Generation)</strong>{" "}
            con <code className="text-cyan-300 bg-cyan-950/50 px-1 rounded">cache: &ldquo;force-cache&rdquo;</code> — El HTML se
            genera en tiempo de build y se sirve desde el CDN. Ideal para datos
            estables como el catálogo de personajes. Las imágenes usan{" "}
            <code className="text-green-300 bg-green-950/50 px-1 rounded">loading=&ldquo;lazy&rdquo;</code> para carga bajo demanda.
          </p>
        </div>
      </main>
    </div>
  );
}
