import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { getMenu } from "../services/menuService.js";
import MenuCard from "../components/menu/MenuCard.jsx";
import MenuFilters from "../components/menu/MenuFilters.jsx";
import Button from "../components/ui/Button.jsx";

function MenuSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="h-64 animate-pulse rounded-2xl border-2 border-cocoa-900/20 bg-cream-dark" />
      ))}
    </div>
  );
}

export default function Menu() {
  const [menu, setMenu] = useState({ categories: [], items: [] });
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [vegFilter, setVegFilter] = useState("all");

  const load = useCallback(async (signal) => {
    setStatus("loading");
    try {
      setMenu(await getMenu(signal));
      setStatus("ready");
    } catch (err) {
      if (err.name === "AbortError") return;
      setErrorMsg(err.message);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return menu.items.filter((item) => {
      if (category !== "All" && item.category !== category) return false;
      if (vegFilter === "veg" && !item.veg) return false;
      if (vegFilter === "nonveg" && item.veg) return false;
      if (q && !`${item.name} ${item.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [menu.items, search, category, vegFilter]);

  const grouped = useMemo(
    () =>
      menu.categories
        .map((cat) => ({ cat, items: filtered.filter((i) => i.category === cat) }))
        .filter((g) => g.items.length > 0),
    [menu.categories, filtered]
  );

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setVegFilter("all");
  };

  return (
    <section className="section pt-8 sm:pt-10">
      <div className="container-page">
        <div className="mb-6 text-center">
          <h1 className="text-4xl sm:text-5xl">Our Menu</h1>
          <p className="mt-2 text-ink/70">Order dene ke liye staff ko batayein. Jo items abhi available nahi hain wo dhundhle dikhte hain.</p>
        </div>

        {status === "loading" && <MenuSkeleton />}

        {status === "error" && (
          <div className="mt-8 rounded-2xl border-2 border-dashed border-chili p-10 text-center" role="alert">
            <AlertTriangle className="mx-auto h-8 w-8 text-chili" aria-hidden="true" />
            <p className="mt-2 font-display text-xl font-extrabold">Menu load nahi ho paya</p>
            <p className="mt-1 text-sm text-ink/70">{errorMsg}</p>
            <Button variant="dark" className="mt-4" onClick={() => load()}>Dobara try karein</Button>
          </div>
        )}

        {status === "ready" && (
          <>
            <MenuFilters
              search={search}
              onSearch={setSearch}
              category={category}
              onCategory={setCategory}
              categories={menu.categories}
              vegFilter={vegFilter}
              onVegFilter={setVegFilter}
            />

            <p className="mt-4 text-sm text-ink/60" aria-live="polite">
              {filtered.length} item{filtered.length === 1 ? "" : "s"} found
            </p>

            {filtered.length === 0 ? (
              <div className="mt-8 rounded-2xl border-2 border-dashed border-cocoa-900/40 p-10 text-center">
                <p className="font-display text-xl font-extrabold">Kuch nahi mila</p>
                <p className="mt-2 text-sm text-ink/70">Doosra naam ya filter try karein.</p>
                <Button variant="dark" className="mt-4" onClick={resetFilters}>Filters hatayein</Button>
              </div>
            ) : (
              <div className="mt-6 space-y-10">
                {grouped.map((g) => (
                  <div key={g.cat}>
                    <h2 className="mb-4 text-2xl">{g.cat}</h2>
                    <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3">
                      {g.items.map((item) => (
                        <MenuCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}