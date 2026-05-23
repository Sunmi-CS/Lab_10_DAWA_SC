// ============================================================
// PÁGINA DE DETALLE - Personaje por ID  [ISR]
// Estrategia: ISR (Incremental Static Regeneration)
// Justificación: Generamos rutas estáticas con
// generateStaticParams para todos los personajes en build time,
// pero con revalidate: 864000 (10 días) permitimos que los
// datos se actualicen periódicamente sin necesidad de un
// rebuild completo. Ideal para páginas de detalle que rara vez
// cambian pero deben reflejar actualizaciones eventuales.
// ============================================================

import { Character, CharacterListResponse } from "@/types/rickandmorty";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  IoArrowBack,
  IoHeartCircle,
  IoSkullOutline,
  IoHelpCircle,
  IoLocation,
  IoPlanet,
  IoTv,
  IoCalendar,
  IoPerson,
  IoFlash,
} from "react-icons/io5";

// ISR: Revalidar cada 10 días (864000 seg)
export const revalidate = 864000;

// ✅ generateStaticParams: Solución definitiva para el firewall de Render
// Al devolver un arreglo vacío, no se descarga nada en tiempo de build, evitando bloqueos.
// Todos los personajes se generarán de manera incremental (ISR) cuando los usuarios entren a la web.
export async function generateStaticParams() {
  return [];
}
async function getCharacter(id: string): Promise<Character> {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`, {
    next: { revalidate: 864000 }, // ISR: 10 días
  });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error("Error al cargar el personaje");
  return res.json();
}

// Metadatos dinámicos SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await getCharacter(id);
  return {
    title: `${character.name} | Rick & Morty`,
    description: `${character.name} — ${character.species} ${character.status}. Originario de ${character.origin.name}.`,
  };
}

// Colores y etiquetas para status
const STATUS_CONFIG: Record<
  string,
  { color: string; bg: string; icon: React.ComponentType<{ size?: number }>; label: string }
> = {
  Alive: {
    color: "text-emerald-400",
    bg: "bg-emerald-950/50 border-emerald-700/50",
    icon: IoHeartCircle,
    label: "Vivo",
  },
  Dead: {
    color: "text-red-400",
    bg: "bg-red-950/50 border-red-700/50",
    icon: IoSkullOutline,
    label: "Muerto",
  },
  unknown: {
    color: "text-gray-400",
    bg: "bg-gray-900/50 border-gray-700/50",
    icon: IoHelpCircle,
    label: "Desconocido",
  },
};

const GENDER_LABELS: Record<string, string> = {
  Female: "Femenino",
  Male: "Masculino",
  Genderless: "Sin género",
  unknown: "Desconocido",
};

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await getCharacter(id);

  const statusConfig =
    STATUS_CONFIG[character.status] ?? STATUS_CONFIG["unknown"];
  const StatusIcon = statusConfig.icon;

  const createdDate = new Date(character.created).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const episodeCount = character.episode.length;
  // Extraer número de episodio del URL
  const lastEpisodeNum = character.episode[episodeCount - 1]?.split("/").pop();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d1a] via-[#111827] to-[#0a1628]">
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-black/60 backdrop-blur-md border-b border-cyan-900/30">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link
            href="/rickandmorty"
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
          >
            <IoArrowBack size={20} />
            Todos los personajes
          </Link>
          <div className="flex gap-2">
            <Link
              href="/rickandmorty/buscar"
              className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-1.5 transition-all"
            >
              Buscar
            </Link>
            <span className="text-xs bg-green-900/50 text-green-300 border border-green-700/50 rounded-full px-3 py-1 font-semibold">
              ISR — 10 días
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* COLUMNA IMAGEN */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="relative rounded-3xl overflow-hidden border-2 border-cyan-700/40 shadow-2xl shadow-cyan-900/30">
              <Image
                src={character.image}
                alt={character.name}
                width={400}
                height={400}
                className="w-full object-cover"
                priority
              />
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {/* ID badge */}
              <div className="absolute bottom-3 left-3 bg-black/80 border border-cyan-700/50 rounded-full px-3 py-1.5">
                <span className="text-cyan-300 font-mono font-bold text-sm">
                  #{character.id.toString().padStart(3, "0")}
                </span>
              </div>
            </div>

            {/* STATUS card */}
            <div
              className={`rounded-2xl border p-4 flex items-center gap-3 ${statusConfig.bg}`}
            >
              <StatusIcon size={28} />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest">
                  Estado
                </p>
                <p className={`font-black text-lg ${statusConfig.color}`}>
                  {statusConfig.label}
                </p>
              </div>
            </div>

            {/* Episodios */}
            <div className="rounded-2xl border border-cyan-900/30 bg-black/30 p-4 flex items-center gap-3">
              <IoTv className="text-cyan-400" size={28} />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest">
                  Episodios
                </p>
                <p className="font-black text-xl text-white">{episodeCount}</p>
                <p className="text-xs text-gray-500">
                  Último: EP {lastEpisodeNum}
                </p>
              </div>
            </div>
          </div>

          {/* COLUMNA DETALLE */}
          <div className="md:col-span-3 flex flex-col gap-5">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                {character.name}
              </h1>
              <p className="text-cyan-400 text-lg mt-1">{character.species}</p>
            </div>

            {/* GRID DE CAMPOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Especie */}
              <FieldCard
                icon={<IoFlash className="text-yellow-400" size={20} />}
                label="Especie"
                value={character.species}
              />

              {/* Tipo */}
              <FieldCard
                icon={<IoFlash className="text-orange-400" size={20} />}
                label="Tipo"
                value={character.type || "N/A"}
              />

              {/* Género */}
              <FieldCard
                icon={<IoPerson className="text-pink-400" size={20} />}
                label="Género"
                value={GENDER_LABELS[character.gender] ?? character.gender}
              />

              {/* Estado */}
              <FieldCard
                icon={<StatusIcon size={20} />}
                label="Estado"
                value={statusConfig.label}
                valueClass={statusConfig.color}
              />

              {/* Origen */}
              <div className="sm:col-span-2 rounded-2xl border border-cyan-900/30 bg-black/30 p-4 flex items-start gap-3">
                <IoPlanet className="text-blue-400 mt-0.5 shrink-0" size={22} />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                    Origen
                  </p>
                  <p className="text-white font-semibold truncate">
                    {character.origin.name}
                  </p>
                  {character.origin.url && (
                    <p className="text-xs text-gray-600 font-mono truncate mt-0.5">
                      {character.origin.url}
                    </p>
                  )}
                </div>
              </div>

              {/* Última ubicación */}
              <div className="sm:col-span-2 rounded-2xl border border-cyan-900/30 bg-black/30 p-4 flex items-start gap-3">
                <IoLocation className="text-red-400 mt-0.5 shrink-0" size={22} />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                    Última ubicación
                  </p>
                  <p className="text-white font-semibold truncate">
                    {character.location.name}
                  </p>
                  {character.location.url && (
                    <p className="text-xs text-gray-600 font-mono truncate mt-0.5">
                      {character.location.url}
                    </p>
                  )}
                </div>
              </div>

              {/* Fecha de creación */}
              <div className="sm:col-span-2 rounded-2xl border border-cyan-900/30 bg-black/30 p-4 flex items-center gap-3">
                <IoCalendar className="text-purple-400 shrink-0" size={22} />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                    Registrado en la API
                  </p>
                  <p className="text-white font-semibold">{createdDate}</p>
                  <p className="text-xs text-gray-600 font-mono mt-0.5">
                    {character.created}
                  </p>
                </div>
              </div>
            </div>

            {/* URL de la API */}
            <div className="rounded-2xl border border-gray-800 bg-black/20 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                URL del personaje (API)
              </p>
              <p className="text-cyan-600 font-mono text-xs break-all">
                {character.url}
              </p>
            </div>

            {/* LISTA DE EPISODIOS */}
            <div className="rounded-2xl border border-cyan-900/30 bg-black/30 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <IoTv className="text-cyan-400" />
                Aparece en {episodeCount} episodio(s)
              </p>
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                {character.episode.map((ep) => {
                  const num = ep.split("/").pop();
                  return (
                    <span
                      key={ep}
                      className="text-xs bg-cyan-950/50 text-cyan-300 border border-cyan-800/50 rounded-full px-2.5 py-1 font-mono"
                    >
                      EP {num}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* NOTA TÉCNICA */}
        <div className="mt-10 rounded-2xl border border-green-900/30 bg-black/30 p-6">
          <h3 className="text-green-400 font-bold mb-2 text-sm uppercase tracking-widest">
            📋 Estrategia de Rendering
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            <strong className="text-white">ISR (Incremental Static Regeneration)</strong>{" "}
            con{" "}
            <code className="text-green-300 bg-green-950/50 px-1 rounded">
              revalidate = 864000
            </code>{" "}
            (10 días) y{" "}
            <code className="text-green-300 bg-green-950/50 px-1 rounded">
              generateStaticParams
            </code>
            . Se pre-generan rutas estáticas para{" "}
            <strong className="text-white">todos los personajes</strong> en
            build time. Cada 10 días la página se re-genera en background sin
            interrumpir a los usuarios, combinando rendimiento SSG con
            actualización de datos ISR.
          </p>
        </div>
      </main>
    </div>
  );
}

// Componente auxiliar para mostrar campos
function FieldCard({
  icon,
  label,
  value,
  valueClass = "text-white",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-cyan-900/30 bg-black/30 p-4 flex items-start gap-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className={`font-semibold truncate ${valueClass}`}>{value}</p>
      </div>
    </div>
  );
}
