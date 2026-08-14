type PokemonCardModalProps = {
    pokemon: any;
    onClose: () => void;
  };
  
  export function PokemonCardModal({ pokemon, onClose }: PokemonCardModalProps) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={onClose}  // click backdrop = close
      >
        <div
          className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()}  // click inside ≠ close
        >
          <button
            type="button"
            onClick={onClose}
            className="float-right text-gray-500 hover:text-black"
          >
            ✕
          </button>
  
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
            alt={pokemon.name}
            width={120}
            height={120}
          />
          <h2 className="text-2xl font-bold capitalize">{pokemon.name}</h2>
          <p>#{String(pokemon.id).padStart(3, "0")}</p>
          <p>Types: {pokemon.types.map((t: any) => t.type.name).join(", ")}</p>
          <p>Height: {(pokemon.height / 10).toFixed(1)} m</p>
          <p>Weight: {(pokemon.weight / 10).toFixed(1)} kg</p>
  
          {/* stats, weaknesses, etc. */}
        </div>
      </div>
    );
  }