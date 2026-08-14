import { fetchPokemonById } from "@/src/module/services/pokeapi";
import { useEffect, useState } from "react";

const MAX_POKEMON_ID = 1025; // or derive from allList.length

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