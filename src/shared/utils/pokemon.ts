export function formatPokemonId(id: number): string {
    return String(id).padStart(3, "0");
  }
  
  export function getPokemonImageUrl(id: number): string {
    return `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${formatPokemonId(id)}.png`;
  }