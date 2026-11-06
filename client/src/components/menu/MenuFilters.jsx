import { Search, X } from "lucide-react";

const vegOptions = [
  { value: "all", label: "All" },
  { value: "veg", label: "Veg" },
  { value: "nonveg", label: "Non-veg" },
];

export default function MenuFilters({ search, onSearch, category, onCategory, categories, vegFilter, onVegFilter }) {
  return (
    <div className="sticky top-16 z-30 -mx-4 border-b-2 border-cocoa-900 bg-cream/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border-2 sm:px-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <label htmlFor="menu-search" className="sr-only">Search menu</label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" aria-hidden="true" />
          <input
            id="menu-search"
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search momos, soups, drinks..."
            className="w-full rounded-full border-2 border-cocoa-900 bg-white py-2 pl-10 pr-10 text-sm outline-none focus:border-chili"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/60 hover:text-chili"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div role="group" aria-label="Veg or non-veg filter" className="flex gap-2">
          {vegOptions.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => onVegFilter(o.value)}
              aria-pressed={vegFilter === o.value}
              className={`rounded-full border-2 border-cocoa-900 px-4 py-1.5 text-sm font-bold transition-colors ${
                vegFilter === o.value ? "bg-cocoa-900 text-cream" : "bg-white text-cocoa-900 hover:bg-spice/40"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Menu categories">
        {["All", ...categories].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onCategory(c)}
            aria-pressed={category === c}
            className={`shrink-0 rounded-full border-2 border-cocoa-900 px-4 py-1 text-sm font-bold transition-colors ${
              category === c ? "bg-chili text-cream" : "bg-white text-cocoa-900 hover:bg-spice/40"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}