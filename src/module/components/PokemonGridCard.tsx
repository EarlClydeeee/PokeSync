import { formatPokemonId, getPokemonImageUrl } from "@/src/shared/utils/pokemon";

type PokemonGridCardProps = {
  id: number;
  name: string;
  types: string;
  onSelect: () => void;
};

export function PokemonGridCard({ id, name, types, onSelect }: PokemonGridCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      data-testid={`pokemon-card-${id}`}
      className="flex flex-col w-full bg-pokedex-card rounded-[var(--radius-pokedex-card)] border border-pokedex-header/15 p-3 hover:shadow-md hover:border-pokedex-header/30 transition-shadow text-left min-h-[140px]"
    >
      <div className="flex items-center gap-2 w-full mb-1">
        <span
          aria-hidden="true"
          className="inline-block w-4 h-4 shrink-0 border-2 border-pokedex-header/50 rounded-sm"
        />
        <p className="font-semibold capitalize text-pokedex-text truncate">
          #{formatPokemonId(id)} {name}
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <img
          src={getPokemonImageUrl(id)}
          alt={name}
          width={80}
          height={80}
          className="object-contain"
        />
      </div>

      <p className="text-xs text-gray-600 capitalize text-center mt-1">{types}</p>
    </button>
  );
}
