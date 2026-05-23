// ============================================================
// TIPOS COMPLETOS DE LA API RICK AND MORTY
// Mapea todos los campos del response de la API
// ============================================================

export type CharacterStatus = "Alive" | "Dead" | "unknown";
export type CharacterGender = "Female" | "Male" | "Genderless" | "unknown";

export interface CharacterLocation {
  name: string;
  url: string;
}

export interface CharacterOrigin {
  name: string;
  url: string;
}

/** Personaje completo de la API de Rick and Morty */
export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string;
  gender: CharacterGender;
  origin: CharacterOrigin;
  location: CharacterLocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

/** Información de paginación */
export interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

/** Respuesta completa del endpoint /character */
export interface CharacterListResponse {
  info: ApiInfo;
  results: Character[];
}

/** Filtros de búsqueda disponibles */
export interface CharacterFilters {
  name?: string;
  status?: CharacterStatus | "";
  species?: string;
  type?: string;
  gender?: CharacterGender | "";
}
