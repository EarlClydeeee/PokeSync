export function getPokemonId(p: { id?: number; url?: string }): number {
  if (p.id != null) return p.id;
  const match = p.url?.match(/\/pokemon\/(\d+)\//);
  return match ? parseInt(match[1], 10) : 0;
}

export function formatPokemonId(id: number): string {
  return String(id).padStart(3, "0");
}

export function getPokemonImageUrl(id: number): string {
  return `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${formatPokemonId(id)}.png`;
}