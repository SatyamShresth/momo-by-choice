import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import * as admin from "../../services/adminService.js";
import Button from "../ui/Button.jsx";

const field = "w-full rounded-xl border-2 border-cocoa-900 bg-white px-4 py-2.5 text-sm outline-none focus:border-chili";
const err = "mt-1 text-xs font-bold text-chili";

export default function ItemFormModal({ item, categories, token, onClose, onSaved, onError }) {
  const isEdit = Boolean(item);
  const [form, setForm] = useState({
    name: item?.name ?? "",
    category: item?.category ?? categories[0]?.id ?? "",
    price: item ? String(item.price) : "",
    description: item?.description ?? "",
    veg: item?.veg ?? true,
    bestseller: item?.bestseller ?? false,
    recommended: item?.recommended ?? false,
    available: item?.available ?? true,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const validate = () => {
    const e = {};
    const p = Number(form.price);
    if (form.name.trim().length < 2) e.name = "Naam kam se kam 2 characters ka ho.";
    if (!form.category) e.category = "Category chunein.";
    if (form.price === "" || !Number.isInteger(p) || p < 0 || p > 100000) e.price = "Price poore rupaye mein likhein (0 se 100000).";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      description: form.description.trim(),
      veg: form.veg,
      bestseller: form.bestseller,
      recommended: form.recommended,
      available: form.available,
    };

    setSaving(true);
    try {
      const res = isEdit ? await admin.updateItem(token, item.id, payload) : await admin.createItem(token, payload);
      onSaved(res.item);
      toast.success(isEdit ? "Item update ho gaya" : "Item add ho gaya");
      onClose();
    } catch (error) {
      if (error.status === 400 && error.details) {
        const fe = {};
        error.details.forEach((d) => (fe[d.field] = d.message));
        setErrors(fe);
      } else if (error.status === 409) {
        setErrors({ name: error.message });
      } else {
        onError(error);
      }
    } finally {
      setSaving(false);
    }
  };

  const check = (key, label) => (
    <label className="flex cursor-pointer items-center gap-2 text-sm font-bold">
      <input type="checkbox" checked={form[key]} onChange={(e) => set(key, e.target.checked)} className="h-4 w-4 accent-chili" />
      {label}
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-cocoa-950/60" onClick={onClose} aria-hidden="true" />

      <div role="dialog" aria-modal="true" aria-label={isEdit ? "Item edit karein" : "Naya item"} className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border-2 border-cocoa-900 bg-cream p-6 sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl">{isEdit ? "Item edit karein" : "Naya item"}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full border-2 border-cocoa-900 p-1.5 hover:bg-spice">
            <X className="h-5 w-5" />
          </button>
        </div>

        {categories.length === 0 ? (
          <p className="text-sm">Pehle ek category banayein (page ke upar "Categories manage karein").</p>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="it-name" className="mb-1 block text-sm font-bold">Item ka naam</label>
              <input id="it-name" autoFocus value={form.name} onChange={(e) => set("name", e.target.value)} maxLength={80} className={field} />
              {errors.name && <p className={err} role="alert">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="it-cat" className="mb-1 block text-sm font-bold">Category</label>
                <select id="it-cat" value={form.category} onChange={(e) => set("category", e.target.value)} className={field}>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.category && <p className={err} role="alert">{errors.category}</p>}
              </div>
              <div>
                <label htmlFor="it-price" className="mb-1 block text-sm font-bold">Price (₹)</label>
                <input id="it-price" type="number" inputMode="numeric" min="0" step="1" value={form.price} onChange={(e) => set("price", e.target.value)} className={field} />
                {errors.price && <p className={err} role="alert">{errors.price}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="it-desc" className="mb-1 block text-sm font-bold">Description <span className="font-normal text-ink/60">(optional)</span></label>
              <textarea id="it-desc" rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} maxLength={300} className={field} />
              {errors.description && <p className={err} role="alert">{errors.description}</p>}
            </div>

            <fieldset>
              <legend className="mb-1 text-sm font-bold">Type</legend>
              <div className="flex gap-4 text-sm font-bold">
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="radio" name="veg" checked={form.veg} onChange={() => set("veg", true)} className="accent-green-600" /> Veg
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="radio" name="veg" checked={!form.veg} onChange={() => set("veg", false)} className="accent-red-700" /> Non-veg
                </label>
              </div>
            </fieldset>

            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {check("available", "Available hai")}
              {check("bestseller", "Bestseller")}
              {check("recommended", "Recommended")}
            </div>

            <Button type="submit" disabled={saving} className="w-full disabled:opacity-60">
              {saving ? "Save ho raha hai..." : isEdit ? "Update karein" : "Item add karein"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}