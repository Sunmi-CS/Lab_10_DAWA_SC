// ============================================================
// PÁGINA DE BÚSQUEDA CSR (Client-Side Rendering)
// Estrategia: CSR con useState y useEffect
// Justificación: La búsqueda en tiempo real requiere
// interacción del usuario y actualizaciones instantáneas de la
// UI sin recargar la página. CSR es la única estrategia
// viable para manejar input dinámico con debounce y filtros
// combinados que cambian continuamente.
// ============================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import { Character, CharacterFilters } from "@/types/rickandmorty";
import Image from "next/image";
import Link from "next/link";
import { IoSearch, IoClose, IoArrowBack } from "react-icons/io5";

const STATUS_COLORS: Record<string, string> = {
  Alive: "bg-emerald-400",
  Dead: "bg-red-500",
  unknown: "bg-gray-400",
};

const INITIAL_FILTERS: CharacterFilters = {
  name: "",
  status: "",
  type: "",
  gender: "",
};

export default function BuscarPage() {
  const [filters, setFilters] = useState<CharacterFilters>(INITIAL_FILTERS);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [searched, setSearched] = useState(false);

  const buildUrl = useCallback((f: CharacterFilters): string => {
    const params = new URLSearchParams();
    if (f.name) params.set("name", f.name);
    if (f.status) params.set("status", f.status);
    if (f.type) params.set("type", f.type);
    if (f.gender) params.set("gender", f.gender);
    return `https://rickandmortyapi.com/api/character/?${params.toString()}`;
  }, []);

  const fetchCharacters = useCallback(
    async (f: CharacterFilters) => {
      setLoading(true);
      setError(null);
      setSearched(true);
      try {
        const url = buildUrl(f);
        const res = await fetch(url);
        if (res.status === 404) {
          setCharacters([]);
          setTotalCount(0);
          return;
        }
        if (!res.ok) throw new Error("Error de red");
        const data = await res.json();
        setCharacters(data.results ?? []);
        setTotalCount(data.info?.count ?? 0);
      } catch {
        setError("No se encontraron personajes con esos filtros.");
        setCharacters([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    },
    [buildUrl]
  );

  // Debounce: buscar 500 ms después del último cambio
  useEffect(() => {
    const hasFilter = Object.values(filters).some((v) => v !== "");
    if (!hasFilter) {
      setCharacters([]);
      setSearched(false);
      setTotalCount(null);
      return;
    }
    const timer = setTimeout(() => fetchCharacters(filters), 500);
    return () => clearTimeout(timer);
  }, [filters, fetchCharacters]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setCharacters([]);
    setSearched(false);
    setTotalCount(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d1a] via-[#111827] to-[#0a1628]">
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-black/60 backdrop-blur-md border-b border-cyan-900/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/rickandmorty"
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
          >
            <IoArrowBack size={20} />
            Volver
          </Link>
          <div className="flex items-center gap-2">
            <IoSearch className="text-cyan-400" size={22} />
            <h1 className="text-white font-black text-xl">
              Buscar{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                Personajes
              </span>
            </h1>
          </div>
          <div className="ml-auto">
            <span className="text-xs bg-purple-900/50 text-purple-300 border border-purple-700/50 rounded-full px-3 py-1 font-semibold">
              CSR — Tiempo Real
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* PANEL DE FILTROS */}
        <div className="rounded-2xl border border-cyan-800/30 bg-black/40 backdrop-blur-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Nombre */}
            <div className="relative">
              <label className="block text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-2">
                Nombre
              </label>
              <div className="relative">
                <IoSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={16}
                />
                <input
                  type="text"
                  name="name"
                  value={filters.name}
                  onChange={handleChange}
                  placeholder="Rick, Morty, Beth..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-900/80 border border-cyan-900/40 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-2">
                Estado
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-cyan-900/40 text-white text-sm focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/30 transition-all appearance-none cursor-pointer"
              >
                <option value="">Todos</option>
                <option value="alive">Vivo</option>
                <option value="dead">Muerto</option>
                <option value="unknown">Desconocido</option>
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-2">
                Tipo / Especie
              </label>
              <input
                type="text"
                name="type"
                value={filters.type}
                onChange={handleChange}
                placeholder="Cronenberg, Fish..."
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-cyan-900/40 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/30 transition-all"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-2">
                Género
              </label>
              <select
                name="gender"
                value={filters.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-cyan-900/40 text-white text-sm focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/30 transition-all appearance-none cursor-pointer"
              >
                <option value="">Todos</option>
                <option value="female">Femenino</option>
                <option value="male">Masculino</option>
                <option value="genderless">Sin género</option>
                <option value="unknown">Desconocido</option>
              </select>
            </div>
          </div>

          {/* Resultados y limpiar */}
          <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
            <div className="text-sm text-gray-400">
              {loading && (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                  Buscando...
                </span>
              )}
              {!loading && totalCount !== null && (
                <span>
                  <strong className="text-cyan-300">{totalCount}</strong>{" "}
                  resultado(s) encontrado(s)
                </span>
              )}
              {!loading && !searched && (
                <span className="text-gray-500 italic">
                  Escribe para buscar en tiempo real...
                </span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-1.5 transition-all"
            >
              <IoClose size={14} />
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* RESULTADOS */}
        {error && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🛸</p>
            <p className="text-gray-400 text-lg">{error}</p>
          </div>
        )}

        {!error && characters.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {characters.map((character) => (
              <Link
                key={character.id}
                href={`/rickandmorty/${character.id}`}
                className="group relative rounded-2xl overflow-hidden border border-cyan-900/30 bg-black/40 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={character.image}
                    alt={character.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 20vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/70 rounded-full px-2 py-1">
                    <span
                      className={`w-2 h-2 rounded-full ${STATUS_COLORS[character.status] ?? "bg-gray-400"}`}
                    />
                    <span className="text-[10px] font-semibold text-white">
                      {character.status}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <h2 className="text-white font-bold text-sm leading-tight line-clamp-1 group-hover:text-cyan-300 transition-colors">
                    {character.name}
                  </h2>
                  <p className="text-gray-400 text-xs mt-1">
                    {character.species}
                  </p>
                  <p className="text-cyan-600 text-xs font-mono mt-0.5">
                    #{character.id.toString().padStart(3, "0")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* NOTA TÉCNICA */}
        <div className="mt-12 rounded-2xl border border-purple-900/30 bg-black/30 p-6">
          <h3 className="text-purple-400 font-bold mb-2 text-sm uppercase tracking-widest">
            📋 Estrategia de Rendering
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            <strong className="text-white">CSR (Client-Side Rendering)</strong>{" "}
            con <code className="text-purple-300 bg-purple-950/50 px-1 rounded">useState</code> y{" "}
            <code className="text-purple-300 bg-purple-950/50 px-1 rounded">useEffect</code> — Se ejecuta
            íntegramente en el navegador. El hook useEffect monitorea los filtros
            y dispara el fetch con un debounce de 500 ms para no saturar la API.
            Esencial para interacciones dinámicas que cambian con cada tecla.
          </p>
        </div>
      </main>
    </div>
  );
}
