const BASE = "https://pokeapi.co/api/v2";

export async function fetchPokemonBatch(offset = 0, limit = 10) {
  try {
    const res = await fetch(`${BASE}/pokemon?limit=${limit}&offset=${offset}`);
    if (!res.ok) throw new Error("Failed to fetch pokemon list");

    const data = await res.json();

    const pokemonDetails = await Promise.all(
      data.results.map((p: { url: string }) =>
        fetch(p.url).then(async (r) => {
          if (!r.ok) throw new Error(`Failed to fetch ${p.url}`);
          return r.json();
        })
      )
    );

    return {
      pokemon: pokemonDetails,
      hasMore: data.next !== null,
      nextOffset: offset + limit,
    };
  } catch (error) {
    console.error("Error fetching Pokemon details:", error);
    return { pokemon: [], hasMore: false, nextOffset: offset };
  }
}

export function formatPokemonId(id: number): string {
    return String(id).padStart(3, "0");
  }
  
  export function getPokemonImageUrl(id: number): string {
    return `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${formatPokemonId(id)}.png`;
  }