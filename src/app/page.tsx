"use client";

import { useEffect, useState, useMemo } from "react";
import {
  fetchPokemonList,
  fetchPokemonDetails,
  fetchPokemonById,
  fetchPokemonSpecies,
  type PokemonListItem,
} from "@/src/module/services/pokeapi";
import { getPokemonImageUrl, formatPokemonId } from "@/src/shared/utils/pokemon";
import { filterPokemon } from "@/src/shared/utils/filterPokemon";
import { sortPokemon } from "@/src/shared/utils/sortPokemon";
import { PokemonCardModal } from "@/src/module/components/PokemonCardModal";

const LIMIT = 10;

type PokemonDetail = Awaited<ReturnType<typeof fetchPokemonById>>;

export default function Home() {
  const [allList, setAllList] = useState<PokemonListItem[]>([]);
  const [pokemon, setPokemon] = useState<NonNullable<PokemonDetail>[]>([]);
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState(LIMIT);
  const [listLoading, setListLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"id" | "name">("id");
  const [modalPokemon, setModalPokemon] = useState<NonNullable<PokemonDetail> | null>(null);
  const [modalCategory, setModalCategory] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchPokemonList()
      .then(setAllList)
      .finally(() => setListLoading(false));
  }, []);

  useEffect(() => {
    setDisplayCount(LIMIT);
    setSelectedPokemonId(null);
  }, [search, sortBy]);

  const filteredSorted = useMemo(() => {
    const filtered = filterPokemon(allList, search);
    return sortPokemon([...filtered], sortBy);
  }, [allList, search, sortBy]);

  const visibleSlice = useMemo(
    () => filteredSorted.slice(0, displayCount),
    [filteredSorted, displayCount]
  );

  const hasMore = displayCount < filteredSorted.length;

  const MAX_POKEMON_ID = useMemo(() => {
    return allList.reduce((max, p) => {
      const id = parseInt(p.url.match(/\/(\d+)\/?$/)?.[1] ?? "0", 10);
      return Math.max(max, id);
    }, 0);
  }, [allList]);

  useEffect(() => {
    if (selectedPokemonId == null) {
      setModalPokemon(null);
      setModalCategory(null);
      return;
    }

    const cached = pokemon.find((p) => p.id === selectedPokemonId);
    if (cached) {
      setModalPokemon(cached);
      setModalLoading(false);
      fetchPokemonSpecies(selectedPokemonId).then((species) => {
        const category =
          species?.genera?.find((g: { language: { name: string } }) => g.language.name === "en")
            ?.genus ?? null;
        setModalCategory(category);
      });
      return;
    }

    setModalLoading(true);
    Promise.all([
      fetchPokemonById(selectedPokemonId),
      fetchPokemonSpecies(selectedPokemonId),
    ])
      .then(([data, species]) => {
        if (data) setModalPokemon(data);
        const category =
          species?.genera?.find((g: { language: { name: string } }) => g.language.name === "en")
            ?.genus ?? null;
        setModalCategory(category);
      })
      .finally(() => setModalLoading(false));
  }, [selectedPokemonId, pokemon]);

  useEffect(() => {
    if (visibleSlice.length === 0) {
      setPokemon([]);
      return;
    }

    setDetailsLoading(true);
    fetchPokemonDetails(visibleSlice)
      .then((results) => setPokemon(results.filter(Boolean)))
      .finally(() => setDetailsLoading(false));
  }, [visibleSlice]);

  const loading = listLoading || detailsLoading;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Pokédex</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by ID or name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="search-input"
          className="p-2 border border-gray-300 rounded w-full"
        />
        <select
          className="rounded-lg border px-4 py-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "id" | "name")}
          data-testid="sort-select"
        >
          <option value="id">Sort: ID</option>
          <option value="name">Sort: Name</option>
        </select>
      </div>

      {loading && pokemon.length === 0 ? (
        <p data-testid="loading-indicator">Loading...</p>
      ) : pokemon.length > 0 ? (
        <ul
          data-testid="pokemon-list"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {pokemon.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setSelectedPokemonId(p.id)}
                data-testid={`pokemon-card-${p.id}`}
                className="flex flex-col items-center w-full border rounded-lg p-4 hover:bg-gray-50 hover:shadow-md transition-shadow text-left"
              >
                <img
                  src={getPokemonImageUrl(p.id)}
                  alt={p.name}
                  width={96}
                  height={96}
                  className="object-contain"
                />
                <p className="font-semibold capitalize mt-2">
                  #{formatPokemonId(p.id)} {p.name}
                </p>
                <p className="text-sm text-gray-600 capitalize">
                  {p.types.map((t: { type: { name: string } }) => t.type.name).join(", ")}
                </p>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p data-testid="empty-state">No Pokémon found matching your search</p>
      )}

      {hasMore && !loading && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setDisplayCount((c) => c + LIMIT)}
            data-testid="load-more-button"
            className="rounded-lg border px-6 py-2 hover:bg-gray-50"
          >
            Load More
          </button>
        </div>
      )}

      {selectedPokemonId != null && (
        <PokemonCardModal
          pokemon={modalPokemon}
          category={modalCategory}
          onClose={() => setSelectedPokemonId(null)}
          isLoading={modalLoading}
          onPrevious={() => setSelectedPokemonId(selectedPokemonId - 1)}
          onNext={() => setSelectedPokemonId(selectedPokemonId + 1)}
          hasPrevious={selectedPokemonId > 1}
          hasNext={selectedPokemonId < MAX_POKEMON_ID}
        />
      )}
    </div>
  );
}
