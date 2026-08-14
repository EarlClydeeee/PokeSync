"use client";

import { useEffect, useState, useMemo } from "react";
import {
  fetchPokemonList,
  fetchPokemonDetails,
  type PokemonListItem,
  fetchPokemonById,
} from "@/src/module/services/pokeapi";
import { NextButton, PreviousButton } from "@/src/shared/components/Button";
import { getPokemonImageUrl, formatPokemonId } from "@/src/shared/utils/pokemon";
import { filterPokemon } from "@/src/shared/utils/filterPokemon";
import { sortPokemon } from "@/src/shared/utils/sortPokemon";
import { PokemonCardModal } from "@/src/module/components/PokemonCardModal";

const LIMIT = 10;

export default function Home() {
  const [allList, setAllList] = useState<PokemonListItem[]>([]);
  const [pokemon, setPokemon] = useState<any[]>([]);
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [listLoading, setListLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"id" | "name">("id");

  useEffect(() => {
    fetchPokemonList()
      .then(setAllList)
      .finally(() => setListLoading(false));
  }, []);

  useEffect(() => {
    setOffset(0);
    setSelectedPokemonId(null);
  }, [search, sortBy]);

  useEffect(() => {
    setSelectedPokemonId(null);
  }, [offset]);

  const selectedPokemon = useMemo(
    () => pokemon.find((p) => p.id === selectedPokemonId) ?? null,
    [pokemon, selectedPokemonId]
  );

  const selectedIndex = useMemo(
    () => pokemon.findIndex((p) => p.id === selectedPokemonId),
    [pokemon, selectedPokemonId]
  );

  const filteredSorted = useMemo(() => {
    const filtered = filterPokemon(allList, search);
    return sortPokemon([...filtered], sortBy);
  }, [allList, search, sortBy]);

  const pageSlice = useMemo(
    () => filteredSorted.slice(offset, offset + LIMIT),
    [filteredSorted, offset]
  );

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / LIMIT));
  const currentPage = Math.floor(offset / LIMIT) + 1;
  const hasPrev = offset > 0;
  const hasMore = offset + LIMIT < filteredSorted.length;
  const loading = listLoading || detailsLoading;

  const MAX_POKEMON_ID = useMemo(() => {
    return allList.reduce((max, p) => {
      const id = parseInt(p.url.match(/\/(\d+)\/?$/)?.[1] ?? "0", 10);
      return Math.max(max, id);
    }, 0);
  }, [allList]);
  const [modalPokemon, setModalPokemon] = useState<any | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (selectedPokemonId == null) {
      setModalPokemon(null);
      return;
    }
    // Use cached data from current page if available
    const cached = pokemon.find((p) => p.id === selectedPokemonId);
    if (cached) {
      setModalPokemon(cached);
      return;
    }
    // Otherwise fetch by ID
    setModalLoading(true);
    fetchPokemonById(selectedPokemonId)
      .then((data) => setModalPokemon(data))
      .finally(() => setModalLoading(false));
  }, [selectedPokemonId, pokemon]);

  useEffect(() => {
    if (pageSlice.length === 0) {
      setPokemon([]);
      return;
    }

    setDetailsLoading(true);
    fetchPokemonDetails(pageSlice)
      .then(setPokemon)
      .finally(() => setDetailsLoading(false));
  }, [pageSlice]);

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
      ) : pokemon.length > 0 ? (
        <ul className="space-y-2">
          {pokemon.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setSelectedPokemonId(p.id)}
                className="flex w-full items-center gap-4 border p-3 rounded-lg hover:bg-gray-50 text-left"
              >
                <img src={getPokemonImageUrl(p.id)} alt={p.name} width={96} height={96} />
                <div>
                  <p>#{formatPokemonId(p.id)} {p.name}</p>
                  <p>{p.types.map((t: any) => t.type.name).join(", ")}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No Pokémon found matching your search</p>
      )}

      <div className="mt-4 flex items-center gap-4">
        <PreviousButton
          onClick={() => setOffset(offset - LIMIT)}
          disabled={!hasPrev || loading}
        />
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <NextButton
          onClick={() => setOffset(offset + LIMIT)}
          disabled={!hasMore || loading}
        />
      </div>

      {selectedPokemonId != null && (
        <PokemonCardModal
          pokemon={modalPokemon}
          onClose={() => setSelectedPokemonId(null)}
          onPrevious={() => setSelectedPokemonId(selectedPokemonId - 1)}
          onNext={() => setSelectedPokemonId(selectedPokemonId + 1)}
          hasPrevious={selectedPokemonId > 1}
          hasNext={selectedPokemonId < MAX_POKEMON_ID}
        />
      )}
    </div>
  );
}
