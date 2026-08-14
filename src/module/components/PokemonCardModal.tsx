import { NextButton, PreviousButton } from "@/src/shared/components/Button";
import { formatPokemonId, getPokemonImageUrl } from "@/src/shared/utils/pokemon";

type PokemonCardModalProps = {
  pokemon: any;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
};

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

export function PokemonCardModal({
  pokemon,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: PokemonCardModalProps) {
  if (!pokemon) return null;

  const maxStat = Math.max(
    ...pokemon.stats.map((s: any) => s.base_stat),
    1
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="float-right text-gray-500 hover:text-black"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="flex flex-col items-center gap-2 mb-4">
          <img
            src={getPokemonImageUrl(pokemon.id)}
            alt={pokemon.name}
            width={120}
            height={120}
          />
          <h2 className="text-2xl font-bold capitalize">{pokemon.name}</h2>
          <p className="text-gray-500">#{formatPokemonId(pokemon.id)}</p>
        </div>

        <div className="space-y-2 mb-4">
          <p>
            <span className="font-medium">Types:</span>{" "}
            {pokemon.types.map((t: any) => t.type.name).join(", ")}
          </p>
          <p>
            <span className="font-medium">Height:</span>{" "}
            {(pokemon.height / 10).toFixed(1)} m
          </p>
          <p>
            <span className="font-medium">Weight:</span>{" "}
            {(pokemon.weight / 10).toFixed(1)} kg
          </p>
          <p>
            <span className="font-medium">Abilities:</span>{" "}
            {pokemon.abilities
              .map((a: any) =>
                a.is_hidden ? `${a.ability.name} (Hidden)` : a.ability.name
              )
              .join(", ")}
          </p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Stats</h3>
          <div className="space-y-2">
            {pokemon.stats.map((s: any) => (
              <div key={s.stat.name} className="flex items-center gap-3">
                <span className="w-20 text-sm">
                  {STAT_LABELS[s.stat.name] ?? s.stat.name}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(s.base_stat / maxStat) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-sm text-right">{s.base_stat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 pt-4 border-t">
          <PreviousButton onClick={onPrevious} disabled={!hasPrevious} />
          <NextButton onClick={onNext} disabled={!hasNext} />
        </div>
      </div>
    </div>
  );
}
