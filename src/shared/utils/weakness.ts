const TYPE_WEAKNESS = {
  normal: ["rock", "steel", "fighting"],
  fighting: ["flying", "poison", "psychic", "bug", "ghost", "fairy"],
  flying: ["rock", "steel", "electric"],
  poison: ["poison", "ground", "rock", "ghost", "steel"],
  ground: ["flying", "bug", "grass"],
  rock: ["fighting", "ground", "steel"],
  bug: ["fighting", "flying", "poison", "ghost", "steel", "fire", "fairy"],
  ghost: ["normal", "dark", "ghost"],
  steel: ["steel", "fire", "water", "electric"],
  fire: ["rock", "fire", "water", "dragon"],
  water: ["water", "grass", "dragon"],
  grass: ["flying", "poison", "bug", "steel", "fire", "grass", "dragon"],
  electric: ["ground", "grass", "electric", "dragon"],
  psychic: ["steel", "psychic", "dark"],
  ice: ["steel", "fire", "water", "ice"],
  dragon: ["steel", "fairy"],
  dark: ["fighting", "dark", "fairy"],
  fairy: ["poison", "steel", "fire"],
};

// Helper functions to extract types and display as string from a pokemon object.
type PokemonType = { type: { name: string } };
type Pokemon = { types: PokemonType[] };

// Get types as ["grass", "poison"]
export function getPokemonTypes(pokemon: Pokemon): string[] {
  return pokemon.types.map((t) => t.type.name);
}

// Get types as "grass, poison"
export function getPokemonTypesDisplay(pokemon: Pokemon): string {
  return pokemon.types.map((t) => t.type.name).join(", ");
}

export function getWeaknessesForType(type: string): string[] {
  return TYPE_WEAKNESS[type as keyof typeof TYPE_WEAKNESS] ?? [];
}

export function getPokemonWeaknesses(pokemon: Pokemon): string[] {
  const weaknesses = getPokemonTypes(pokemon).flatMap(getWeaknessesForType);
  return [...new Set(weaknesses)];
}

export function getWeaknessMessage(type: string): string {
  const weaknesses = getWeaknessesForType(type);
  if (weaknesses.length === 0) return `${type} type not found`;
  return `${weaknesses.join(", ")}`;
}

export function getPokemonWeaknessMessage(pokemon: Pokemon): string {
  const weaknesses = getPokemonWeaknesses(pokemon);
  if (weaknesses.length === 0) return "No weaknesses found";
  return `${weaknesses.join(", ")}`;
}
