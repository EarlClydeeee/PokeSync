"use client";

import { fetchPokemonBatch } from "@/src/module/services/pokeapi";
import { NextButton } from "@/src/shared/components/Button";
import { PreviousButton } from "@/src/shared/components/Button";

export default async function Home() {
  const { pokemon, hasMore, nextOffset } = await fetchPokemonBatch();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pokédex</h1>
      <p>Loaded: {pokemon.length} | Has more: {String(hasMore)} | Next offset: {nextOffset}</p>
      <ul className="mt-4 space-y-2">
        {pokemon.map((p) => (
          <li key={p.id}>
            #{p.id} {p.name} — {p.types.map((t: any) => t.type.name).join(", ")}
          </li>
        ))}
        <NextButton onClick={() => {}} />
        <PreviousButton onClick={() => {}} disabled={true} />
      </ul>
    </div>
  );
}