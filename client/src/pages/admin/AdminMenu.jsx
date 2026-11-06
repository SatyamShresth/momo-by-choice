import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ExternalLink, LogOut, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import * as admin from "../../services/adminService.js";
import VegMark from "../../components/ui/VegMark.jsx";
import Button from "../../components/ui/Button.jsx";
import ItemFormModal from "../../components/admin/ItemFormModal.jsx";
import CategoryPanel from "../../components/admin/CategoryPanel.jsx";

export default function AdminMenu() {
  const { token, user, logout } = useAuth();
  const [data, setData] = useState({ categories: [], items: [] });
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // null | "new" | item object
  const [busyId, setBusyId] = useState(null);

  const handleError = useCallback(
    (err) => {
      if (err.status === 401) {
        toast.error("Session khatam ho gaya. Dobara login karein.");
        logout();
        return;
      }
      toast.error(err.message);
    },
    [logout]
  );

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setStatus("loading");
      try {
        setData(await admin.getAdminMenu(token));
        setStatus("ready");
      } catch (err) {
        if (err.status === 401) return logout();
        setStatus("error");
      }
    },
    [token, logout]
  );

  useEffect(() => {
    load();
  }, [load]);

  const toggleAvailable = async (item) => {
    setBusyId(item.id);
    try {
      const { item: updated } = await admin.updateItem(token, item.id, { available: !item.available });
      setData((d) => ({ ...d, items: d.items.map((i) => (i.id === updated.id ? updated : i)) }));
      toast.success(`${updated.name}: ${updated.available ? "available" : "unavailable"}`, { duration: 1500 });
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`"${item.name}" hamesha ke liye delete karein?`)) return;
    setBusyId(item.id);
    try {
      await admin.deleteItem(token, item.id);
      setData((d) => ({ ...d, items: d.items.filter((i) => i.id !== item.id) }));
      toast.success("Item delete ho gaya");
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId(null);
    }
  };

  const onSaved = (saved) =>
    setData((d) => ({
      ...d,
      items: d.items.some((i) => i.id === saved.id)
        ? d.items.map((i) => (i.id === saved.id ? saved : i))
        : [...d.items, saved],
    }));

  const counts = useMemo(() => {
    const c = {};
    data.items.forEach((i) => (c[i.category] = (c[i.category] || 0) + 1));
    return c;
  }, [data.items]);

  const unavailableCount = data.items.filter((i) => !i.available).length;

  const groups = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.categories
      .map((c) => ({
        c,
        items: data.items.filter((i) => i.category === c.id && (!q || i.name.toLowerCase().includes(q))),
      }))
      .filter((g) => !q || g.items.length > 0);
  }, [data, search]);

  return (
    <div className="min-h-screen bg-cream-dark">
      <header className="border-b-2 border-cocoa-900 bg-cream">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3">
          <div>
            <h1 className="text-xl sm:text-2xl">Menu Manager</h1>
            <p className="text-xs text-ink/60">{user?.name} · {user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/menu" target="_blank" className="inline-flex items-center gap-1 text-sm font-bold text-chili hover:underline">
              Public menu <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </Link>
            <button type="button" onClick={logout} className="inline-flex items-center gap-1 rounded-full border-2 border-cocoa-900 px-3 py-1.5 text-sm font-bold hover:bg-spice">
              <LogOut className="h-4 w-4" aria-hidden="true" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container-page space-y-5 py-6">
        {status === "loading" && <p role="status" className="text-center text-sm font-bold text-ink/60">Menu load ho raha hai...</p>}

        {status === "error" && (
          <div className="rounded-2xl border-2 border-dashed border-chili p-8 text-center" role="alert">
            <p className="font-display text-xl font-extrabold">Menu load nahi ho paya</p>
            <Button variant="dark" className="mt-4" onClick={() => load()}>Dobara try karein</Button>
          </div>
        )}

        {status === "ready" && (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[200px] flex-1">
                <label htmlFor="ad-search" className="sr-only">Item search karein</label>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" aria-hidden="true" />
                <input
                  id="ad-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Item search karein..."
                  className="w-full rounded-full border-2 border-cocoa-900 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-chili"
                />
              </div>
              <Button onClick={() => setEditing("new")}><Plus className="h-4 w-4" aria-hidden="true" /> Naya item</Button>
            </div>

            <p className="text-sm text-ink/70" aria-live="polite">
              {data.items.length} items · <span className="font-bold text-chili">{unavailableCount} unavailable</span>
            </p>

            <CategoryPanel token={token} categories={data.categories} counts={counts} onChange={() => load(true)} onError={handleError} />

            {groups.length === 0 && <p className="py-8 text-center text-sm text-ink/60">Kuch nahi mila.</p>}

            {groups.map(({ c, items }) => (
              <section key={c.id} aria-label={c.name}>
                <h2 className="mb-2 text-lg">{c.name}</h2>
                {items.length === 0 ? (
                  <p className="rounded-xl border-2 border-dashed border-cocoa-900/30 p-4 text-center text-sm text-ink/60">Is category mein abhi koi item nahi.</p>
                ) : (
                  <ul className="divide-y divide-cocoa-900/10 overflow-hidden rounded-2xl border-2 border-cocoa-900 bg-white shadow-pop">
                    {items.map((i) => (
                      <li key={i.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <VegMark veg={i.veg} />
                          <div className="min-w-0">
                            <p className={`truncate font-bold ${i.available ? "" : "text-ink/50"}`}>{i.name}</p>
                            <p className="text-xs text-ink/60">₹{i.price}{!i.available && <span className="ml-2 font-bold text-chili">Unavailable</span>}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={i.available}
                          aria-label={`${i.name} available hai`}
                          disabled={busyId === i.id}
                          onClick={() => toggleAvailable(i)}
                          className={`relative h-7 w-12 shrink-0 rounded-full border-2 border-cocoa-900 transition-colors disabled:opacity-50 ${i.available ? "bg-green-500" : "bg-cream-deeper"}`}
                        >
                          <span className={`absolute top-1 h-4 w-4 rounded-full bg-cocoa-900 transition-all ${i.available ? "left-6" : "left-1"}`} />
                        </button>

                        <button type="button" onClick={() => setEditing(i)} aria-label={`Edit ${i.name}`} className="rounded-full border-2 border-cocoa-900 p-1.5 hover:bg-spice">
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button type="button" onClick={() => remove(i)} disabled={busyId === i.id} aria-label={`Delete ${i.name}`} className="rounded-full border-2 border-cocoa-900 p-1.5 hover:bg-chili hover:text-cream disabled:opacity-50">
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </>
        )}
      </main>

      {editing && (
        <ItemFormModal
          item={editing === "new" ? null : editing}
          categories={data.categories}
          token={token}
          onClose={() => setEditing(null)}
          onSaved={onSaved}
          onError={handleError}
        />
      )}
    </div>
  );
}