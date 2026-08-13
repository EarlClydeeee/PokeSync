export function sortPokemon(pokemon: any[], sort: string) {
    if (sort === "name") {
        return sortPokemonByName(pokemon);
    } else if (sort === "id") {
        return sortPokemonById(pokemon);
    }
    return pokemon;
}

export function sortPokemonByName(pokemon: any[]) {
    return pokemon.sort((a, b) => a.name.localeCompare(b.name));
}

export function sortPokemonById(pokemon: any[]) {
    return pokemon.sort((a, b) => a.id - b.id);
}