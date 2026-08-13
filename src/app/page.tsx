  "use client";

  import { useEffect, useState, useMemo } from "react";
  import {
    fetchAllPokemon,
  } from "@/src/module/services/pokeapi";
  import { NextButton, PreviousButton } from "@/src/shared/components/Button";
  import { getPokemonImageUrl, formatPokemonId } from "@/src/shared/utils/pokemon";
  import { filterPokemon } from "@/src/shared/utils/filterPokemon";
  import { sortPokemon } from "@/src/shared/utils/sortPokemon";

  const LIMIT = 10;

  export default function Home() {
    const [pokemon, setPokemon] = useState<any[]>([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<"id" | "name">("id");

    async function loadPage(newOffset: number) {
      setLoading(true);
      const result = await fetchAllPokemon();
      setPokemon(result);
      setOffset(0);
      setHasMore(true);
      setLoading(false);
    }

    useEffect(() => {
      loadPage(0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredAndSortedPokemon = useMemo(() => {
      const filtered = filterPokemon(pokemon, search);
      return sortPokemon([...filtered], sortBy);
    }, [pokemon, search, sortBy]);

    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Pokédex</h1>

        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Search Pokémon"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
          />
          <select
            className="rounded-lg border px-4 py-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "id" | "name")}
          >
            <option value="id">Sort: ID</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          filteredAndSortedPokemon.length > 0 ? (
            <ul className="space-y-2">
              {filteredAndSortedPokemon.map((p) => (
                <li key={p.id} className="flex items-center gap-4 border p-3 rounded-lg">
                  <img
                    src={getPokemonImageUrl(p.id)}
                    alt={p.name}
                    width={96}
                    height={96}
                  />
                  <div>
                    <p>#{formatPokemonId(p.id)} {p.name}</p>
                    <p>{p.types.map((t: any) => t.type.name).join(", ")}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No Pokémon found matching your search</p>
          )
        )}

        <div className="mt-4 flex gap-2">
          <PreviousButton
            onClick={() => loadPage(offset - LIMIT)}
            disabled={offset === 0 || loading}
          />
          <NextButton
            onClick={() => loadPage(offset + LIMIT)}
            disabled={!hasMore || loading}
          />
        </div>
      </div>
    );
  }