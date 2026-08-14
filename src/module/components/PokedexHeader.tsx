export function PokedexHeader() {
  return (
    <header
      data-testid="pokedex-header"
      className="bg-pokedex-header text-white px-4 py-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">PokéSync</h1>
      </div>
    </header>
  );
}
