"use client";

import { useEffect, useState, useMemo } from "react";
import {
  fetchPokemonList,
  fetchPokemonDetails,
  fetchPokemonById,
  fetchPokemonSpecies,
  type PokemonListItem,
} from "@/src/module/services/pokeapi";
import { filterPokemon } from "@/src/shared/utils/filterPokemon";
import { sortPokemon } from "@/src/shared/utils/sortPokemon";
import { PokemonCardModal } from "@/src/module/components/PokemonCardModal";
import { PokedexHeader } from "@/src/module/components/PokedexHeader";
import { PokedexToolbar } from "@/src/module/components/PokedexToolbar";
import { PokemonGridCard } from "@/src/module/components/PokemonGridCard";

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
    <div className="min-h-full flex flex-col">
      <PokedexHeader />

      <div className="p-4 max-w-7xl mx-auto w-full flex-1">
        <PokedexToolbar
          search={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {loading && pokemon.length === 0 ? (
          <p data-testid="loading-indicator">Loading...</p>
        ) : pokemon.length > 0 ? (
          <ul
            data-testid="pokemon-list"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-3"
          >
            {pokemon.map((p) => (
              <li key={p.id}>
                <PokemonGridCard
                  id={p.id}
                  name={p.name}
                  types={p.types
                    .map((t: { type: { name: string } }) => t.type.name)
                    .join(", ")}
                  onSelect={() => setSelectedPokemonId(p.id)}
                />
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
              className="rounded-[var(--radius-pokedex-card)] border border-pokedex-header/30 bg-pokedex-card px-6 py-2 hover:shadow-md transition-shadow"
            >
              Load More
            </button>
          </div>
        )}
      </div>

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
