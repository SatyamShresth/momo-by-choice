import { useState } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import * as admin from "../../services/adminService.js";

export default function CategoryPanel({ token, categories, counts, onChange, onError }) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const add = async (e) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error("Category ka naam kam se kam 2 characters ka ho.");
      return;
    }
    setBusy(true);
    try {
      await admin.createCategory(token, { name: name.trim() });
      setName("");
      toast.success("Category ban gayi");
      await onChange();
    } catch (err) {
      onError(err);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (c) => {
    if (!window.confirm(`Category "${c.name}" delete karein?`)) return;
    try {
      await admin.deleteCategory(token, c.id);
      toast.success("Category delete ho gayi");
      await onChange();
    } catch (err) {
      onError(err);
    }
  };

  return (
    <details className="rounded-2xl border-2 border-cocoa-900 bg-white p-4 shadow-pop">
      <summary className="cursor-pointer text-sm font-bold">Categories manage karein ({categories.length})</summary>

      <ul className="mt-3 divide-y divide-cocoa-900/10">
        {categories.map((c) => {
          const n = counts[c.id] || 0;
          return (
            <li key={c.id} className="flex items-center justify-between gap-3 py-2 text-sm">
              <span>{c.name} <span className="text-ink/50">({n} item{n === 1 ? "" : "s"})</span></span>
              <button
                type="button"
                onClick={() => remove(c)}
                disabled={n > 0}
                title={n > 0 ? "Pehle is category ke items delete karein" : "Delete"}
                aria-label={`Delete category ${c.name}`}
                className="rounded-full border-2 border-cocoa-900 p-1.5 hover:bg-chili hover:text-cream disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>

      <form onSubmit={add} className="mt-3 flex gap-2">
        <label htmlFor="new-cat" className="sr-only">Nayi category ka naam</label>
        <input
          id="new-cat"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          placeholder="Nayi category, jaise Combos"
          className="min-w-0 flex-1 rounded-xl border-2 border-cocoa-900 px-3 py-2 text-sm outline-none focus:border-chili"
        />
        <button type="submit" disabled={busy} className="rounded-xl border-2 border-cocoa-900 bg-spice px-4 py-2 text-sm font-bold disabled:opacity-60">
          Add
        </button>
      </form>
    </details>
  );
}