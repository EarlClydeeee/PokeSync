export function PokedexHeader() {
  return (
    <header
      data-testid="pokedex-header"
      className="bg-pokedex-header text-white px-4 py-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="inline-block w-5 h-5 border-2 border-white rounded-sm" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">PokéSync</h1>
          </div>
          <p className="mt-1 text-sm sm:text-base text-white/90">
            Browse the National Dex | Search, sort, and view details
          </p>
        </div>
        <div
          aria-hidden="true"
          className="hidden sm:flex items-center justify-center rounded-lg bg-pokedex-header-dark px-3 py-2 text-xs font-semibold uppercase tracking-wider"
        >
          Dex
        </div>
      </div>
    </header>
  );
}
