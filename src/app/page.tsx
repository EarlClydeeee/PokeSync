"use client";

import { useEffect, useState } from "react";
import {
  fetchPokemonBatch,
} from "@/src/module/services/pokeapi";
import { NextButton, PreviousButton } from "@/src/shared/components/Button";
import { getPokemonImageUrl, formatPokemonId } from "@/src/shared/utils/pokemon";

const LIMIT = 10;

export default function Home() {
  const [pokemon, setPokemon] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  async function loadPage(newOffset: number) {
    setLoading(true);
    const result = await fetchPokemonBatch(newOffset, LIMIT);
    setPokemon(result.pokemon);
    setOffset(newOffset);
    setHasMore(result.hasMore);
    setLoading(false);
  }

  useEffect(() => {
    loadPage(0);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pokédex</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {pokemon.map((p) => (
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