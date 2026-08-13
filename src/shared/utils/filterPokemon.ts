export function filterPokemonByName(pokemon: any[], name: string) {
    return pokemon.filter((p) => p.name.toLowerCase().includes(name.toLowerCase()));
}

export function filterPokemonById(pokemon: any[], id: string) {
    return pokemon.filter((p) => String(p.id).includes(id));
}

export function filterPokemon(pokemon: any[], query: string) {
    const q = query.trim().toLowerCase();
    if (!q) return pokemon;
  
    return pokemon.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        String(p.id).includes(q) ||
        String(p.id).padStart(3, "0").includes(q)
    );
  }