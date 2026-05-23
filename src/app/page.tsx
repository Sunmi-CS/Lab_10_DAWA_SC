import Image from "next/image";
import Link from "next/link";
import { IoPlanet, IoGameController } from "react-icons/io5";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-center py-24 px-8 gap-12">
        {/* Logo Next.js */}
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={120}
          height={24}
          priority
        />

        <div className="text-center">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-3">
            Next.js — SSG · ISR · CSR
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
            Exploración de estrategias de rendering con Next.js App Router
          </p>
        </div>

        {/* Tarjetas de secciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Pokémon */}
          <Link
            href="/pokemon"
            className="group flex items-center gap-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm hover:shadow-lg hover:border-yellow-400/60 dark:hover:border-yellow-500/40 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-yellow-100 dark:bg-yellow-950/50 flex items-center justify-center text-3xl">
              <IoGameController className="text-yellow-500" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-black dark:text-white group-hover:text-yellow-500 transition-colors">
                Pokédex ISR
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                Lista de Pokémon con rutas dinámicas (ISR 24h)
              </p>
              <span className="inline-block mt-2 text-xs bg-yellow-100 dark:bg-yellow-950/70 text-yellow-700 dark:text-yellow-400 rounded-full px-2.5 py-0.5 font-semibold border border-yellow-200 dark:border-yellow-800">
                ISR · SSG
              </span>
            </div>
          </Link>

          {/* Rick & Morty */}
          <Link
            href="/rickandmorty"
            className="group flex items-center gap-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm hover:shadow-lg hover:border-cyan-400/60 dark:hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-cyan-100 dark:bg-cyan-950/50 flex items-center justify-center text-3xl">
              <IoPlanet className="text-cyan-500" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-black dark:text-white group-hover:text-cyan-400 transition-colors">
                Rick &amp; Morty
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                SSG · ISR (10 días) · CSR en tiempo real
              </p>
              <span className="inline-block mt-2 text-xs bg-cyan-100 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-400 rounded-full px-2.5 py-0.5 font-semibold border border-cyan-200 dark:border-cyan-800">
                SSG · ISR · CSR
              </span>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
