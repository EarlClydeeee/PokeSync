const BASE = "https://pokeapi.co/api/v2";

export type PokemonListItem = {
  name: string;
  url: string;
};

export async function fetchPokemonList(): Promise<PokemonListItem[]> {
  try {
    const res = await fetch(`${BASE}/pokemon?limit=2000`);
    if (!res.ok) throw new Error("Failed to fetch pokemon list");

    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching Pokemon list:", error);
    return []; 
  }
}

export async function fetchPokemonDetails(items: PokemonListItem[]) {
  try {
    return await Promise.all(
      items.map((p) =>
        fetch(p.url).then(async (r) => {
          if (!r.ok) throw new Error(`Failed to fetch ${p.url}`);
          return r.json();
        })
      )
    );
  } catch (error) {
    console.error("Error fetching Pokemon details:", error);
    return [];
  }
}

export async function fetchPokemonById(id: number) {
  try {
    const res = await fetch(`${BASE}/pokemon/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch pokemon ${id}`);
    return res.json();
  } catch (error) {
    console.error(`Error fetching Pokemon ${id}:`, error);
    return null;
  }
}
