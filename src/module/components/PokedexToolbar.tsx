type PokedexToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: "id" | "name";
  onSortChange: (value: "id" | "name") => void;
};

export function PokedexToolbar({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
}: PokedexToolbarProps) {
  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        placeholder="Search by ID or name"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        data-testid="search-input"
        className="p-2 border border-pokedex-header/30 rounded-[var(--radius-pokedex-card)] w-full bg-pokedex-card text-pokedex-text placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pokedex-header/40"
      />
      <select
        className="rounded-[var(--radius-pokedex-card)] border border-pokedex-header/30 px-4 py-2 bg-pokedex-card text-pokedex-text focus:outline-none focus:ring-2 focus:ring-pokedex-header/40"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as "id" | "name")}
        data-testid="sort-select"
      >
        <option value="id">Sort: ID</option>
        <option value="name">Sort: Name</option>
      </select>
    </div>
  );
}
