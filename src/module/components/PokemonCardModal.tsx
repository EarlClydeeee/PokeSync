import { NextButton, PreviousButton } from "@/src/shared/components/Button";
import { formatPokemonId, getPokemonImageUrl } from "@/src/shared/utils/pokemon";
import {
  getPokemonTypesDisplay,
  getPokemonWeaknessMessage,
} from "@/src/shared/utils/weakness";

type PokemonCardModalProps = {
  pokemon: any;
  category: string | null;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  isLoading: boolean;
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
  category,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  isLoading,
}: PokemonCardModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      data-testid="pokemon-modal"
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
          data-testid="modal-close"
        >
          ✕
        </button>

        {isLoading || !pokemon ? (
          <p data-testid="modal-loading" className="py-8 text-center">
            Loading...
          </p>
        ) : (
          <>
            <div className="flex flex-col items-center gap-2 mb-4">
              <img
                src={getPokemonImageUrl(pokemon.id)}
                alt={pokemon.name}
                width={120}
                height={120}
              />
              <h2
                className="text-2xl font-bold capitalize"
                data-testid="modal-pokemon-name"
              >
                {pokemon.name}
              </h2>
              <p className="text-gray-500" data-testid="modal-pokemon-id">
                #{formatPokemonId(pokemon.id)}
              </p>
            </div>

            <div className="space-y-2 mb-4">
              <p>
                <span className="font-medium">Types:</span>{" "}
                <span data-testid="modal-types">{getPokemonTypesDisplay(pokemon)}</span>
              </p>
              <p>
                <span className="font-medium">Weakness:</span>{" "}
                <span data-testid="modal-weakness">
                  {getPokemonWeaknessMessage(pokemon)}
                </span>
              </p>
              {category && (
                <p>
                  <span className="font-medium">Category:</span>{" "}
                  <span data-testid="modal-category">{category}</span>
                </p>
              )}
              <p>
                <span className="font-medium">Height:</span>{" "}
                <span data-testid="modal-height">
                  {(pokemon.height / 10).toFixed(1)} m
                </span>
              </p>
              <p>
                <span className="font-medium">Weight:</span>{" "}
                <span data-testid="modal-weight">
                  {(pokemon.weight / 10).toFixed(1)} kg
                </span>
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
              <div className="space-y-2" data-testid="modal-stats">
                {pokemon.stats.map((s: any) => (
                  <div key={s.stat.name} className="flex items-center gap-3">
                    <span className="w-20 text-sm">
                      {STAT_LABELS[s.stat.name] ?? s.stat.name}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(s.base_stat / Math.max(...pokemon.stats.map((st: any) => st.base_stat), 1)) * 100}%` }}
                      />
                    </div>
                    <span className="w-8 text-sm text-right">{s.base_stat}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex items-center justify-center gap-4 pt-4 border-t">
          <PreviousButton
            onClick={onPrevious}
            disabled={!hasPrevious}
            data-testid="modal-previous"
          />
          <NextButton onClick={onNext} disabled={!hasNext} data-testid="modal-next" />
        </div>
      </div>
    </div>
  );
}
