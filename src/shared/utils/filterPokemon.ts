import { getPokemonId } from "./pokemon";

export function filterPokemonByName(pokemon: any[], name: string) {
  return pokemon.filter((p) => p.name.toLowerCase().includes(name.toLowerCase()));
}

export function filterPokemonById(pokemon: any[], id: string) {
  return pokemon.filter((p) => String(getPokemonId(p)).includes(id));
}

export function filterPokemon(pokemon: any[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return pokemon;

  return pokemon.filter((p) => {
    const id = getPokemonId(p);
    return (
      p.name.toLowerCase().includes(q) ||
      String(id).includes(q) ||
      String(id).padStart(3, "0").includes(q)
    );
  });
}