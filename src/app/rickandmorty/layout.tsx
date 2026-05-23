import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rick & Morty Universe",
  description:
    "Explora todos los personajes del universo multidimensional de Rick and Morty. SSG, ISR y CSR con Next.js App Router.",
};

export default function RickAndMortyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}
