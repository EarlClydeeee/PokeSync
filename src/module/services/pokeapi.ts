const BASE = "https://pokeapi.co/api/v2";

export async function fetchAllPokemon(limit = 1000) {
  let offset = 0;
  let allPokemon: any[] = [];
  let hasMore = true;

  try {
    while (hasMore) {
      const res = await fetch(`${BASE}/pokemon?limit=${limit}&offset=${offset}`);
      if (!res.ok) throw new Error("Failed to fetch pokemon list");

      const data = await res.json();

      // Fetch details for this batch
      const pokemonDetails = await Promise.all(
        data.results.map((p: { url: string }) =>
          fetch(p.url).then(async (r) => {
            if (!r.ok) throw new Error(`Failed to fetch ${p.url}`);
            return r.json();
          })
        )
      );

      allPokemon = [...allPokemon, ...pokemonDetails];
      hasMore = data.next !== null;
      offset += limit;
    }

    return allPokemon;
  } catch (error) {
    console.error("Error fetching all Pokemon:", error);
    return [];
  }
}
