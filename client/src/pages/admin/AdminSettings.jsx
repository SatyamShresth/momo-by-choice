import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import * as admin from "../../services/adminService.js";
import Button from "../../components/ui/Button.jsx";

const field = "w-full rounded-xl border-2 border-cocoa-900 bg-white px-4 py-2.5 text-sm outline-none focus:border-chili";
const card = "space-y-4 rounded-2xl border-2 border-cocoa-900 bg-white p-6 shadow-pop";

function Field({ id, label, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-bold">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-ink/60">{hint}</p>}
    </div>
  );
}

export default function AdminSettings() {
  const { token, logout } = useAuth();
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState("loading");
  const [saving, setSaving] = useState(false);
  const [problems, setProblems] = useState([]);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const d = await admin.getAdminSettings(token);
      setForm(d.settings);
      setStatus("ready");
    } catch (err) {
      if (err.status === 401) return logout();
      setStatus("error");
    }
  }, [token, logout]);

  useEffect(() => {
    load();
  }, [load]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setAddr = (k, v) => setForm((f) => ({ ...f, address: { ...f.address, [k]: v } }));
  const setHour = (i, k, v) => setForm((f) => ({ ...f, hours: f.hours.map((h, idx) => (idx === i ? { ...h, [k]: v } : h)) }));
  const addHour = () => setForm((f) => (f.hours.length >= 10 ? f : { ...f, hours: [...f.hours, { day: "", time: "" }] }));
  const removeHour = (i) => setForm((f) => ({ ...f, hours: f.hours.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProblems([]);
    setSaving(true);
    try {
      const res = await admin.updateSettings(token, form);
      setForm(res.settings);
      toast.success("Settings save ho gayi");
    } catch (err) {
      if (err.status === 401) {
        toast.error("Session khatam ho gaya. Dobara login karein.");
        return logout();
      }
      if (err.status === 400 && err.details) setProblems(err.details);
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") return <p role="status" className="text-center text-sm font-bold text-ink/60">Load ho raha hai...</p>;
  if (status === "error") {
    return (
      <div className="rounded-2xl border-2 border-dashed border-chili p-8 text-center" role="alert">
        <p className="font-display text-xl font-extrabold">Settings load nahi ho payi</p>
        <Button variant="dark" className="mt-4" onClick={load}>Dobara try karein</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-2xl space-y-6">
      {problems.length > 0 && (
        <div className="rounded-xl border-2 border-chili bg-chili/10 p-4 text-sm" role="alert">
          <p className="mb-1 font-bold text-chili">In galtiyon ko theek karein:</p>
          <ul className="list-disc pl-5">
            {problems.map((p, i) => <li key={i}><span className="font-bold">{p.field}</span>: {p.message}</li>)}
          </ul>
        </div>
      )}

      <section className={card} aria-label="Restaurant info">
        <h2 className="text-xl">Restaurant info</h2>
        <Field id="st-name" label="Naam">
          <input id="st-name" value={form.name} onChange={(e) => set("name", e.target.value)} maxLength={60} className={field} />
        </Field>
        <Field id="st-tag" label="Tagline">
          <input id="st-tag" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} maxLength={120} className={field} />
        </Field>
        <Field id="st-desc" label="Description">
          <textarea id="st-desc" rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} maxLength={500} className={field} />
        </Field>
      </section>

      <section className={card} aria-label="Contact">
        <h2 className="text-xl">Contact</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="st-phone" label="Phone">
            <input id="st-phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} maxLength={30} className={field} />
          </Field>
          <Field id="st-email" label="Email">
            <input id="st-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} maxLength={120} className={field} />
          </Field>
        </div>
      </section>

      <section className={card} aria-label="Address">
        <h2 className="text-xl">Address</h2>
        <Field id="ad-l1" label="Address line 1">
          <input id="ad-l1" value={form.address.line1} onChange={(e) => setAddr("line1", e.target.value)} maxLength={120} className={field} />
        </Field>
        <Field id="ad-l2" label="Area / Landmark">
          <input id="ad-l2" value={form.address.line2} onChange={(e) => setAddr("line2", e.target.value)} maxLength={120} className={field} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field id="ad-city" label="City">
            <input id="ad-city" value={form.address.city} onChange={(e) => setAddr("city", e.target.value)} maxLength={60} className={field} />
          </Field>
          <Field id="ad-state" label="State">
            <input id="ad-state" value={form.address.state} onChange={(e) => setAddr("state", e.target.value)} maxLength={60} className={field} />
          </Field>
          <Field id="ad-pin" label="PIN code">
            <input id="ad-pin" inputMode="numeric" value={form.address.pincode} onChange={(e) => setAddr("pincode", e.target.value)} maxLength={10} className={field} />
          </Field>
        </div>
      </section>

      <section className={card} aria-label="Opening hours">
        <h2 className="text-xl">Opening hours</h2>
        {form.hours.map((h, i) => (
          <div key={i} className="flex items-center gap-2">
            <input aria-label={`Din ${i + 1}`} placeholder="Din (jaise Mon – Fri)" value={h.day} onChange={(e) => setHour(i, "day", e.target.value)} maxLength={40} className={field} />
            <input aria-label={`Time ${i + 1}`} placeholder="Time (jaise 11 AM – 10 PM)" value={h.time} onChange={(e) => setHour(i, "time", e.target.value)} maxLength={40} className={field} />
            <button type="button" onClick={() => removeHour(i)} aria-label={`Row ${i + 1} hatayein`} className="shrink-0 rounded-full border-2 border-cocoa-900 p-2 hover:bg-chili hover:text-cream">
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
        <button type="button" onClick={addHour} disabled={form.hours.length >= 10} className="inline-flex items-center gap-1 text-sm font-bold text-chili hover:underline disabled:opacity-40">
          <Plus className="h-4 w-4" aria-hidden="true" /> Row jodein
        </button>
      </section>

      <section className={card} aria-label="Map aur website">
        <h2 className="text-xl">Map aur website</h2>
        <Field id="st-maps" label="Google Maps link (Get Directions ke liye)" hint="Google Maps mein restaurant kholein → Share → Copy link.">
          <input id="st-maps" type="url" value={form.mapsLink} onChange={(e) => set("mapsLink", e.target.value)} maxLength={500} className={field} />
        </Field>
        <Field id="st-embed" label="Google Maps embed" hint="Google Maps → Share → Embed a map → HTML copy karke paste karein. Poora <iframe> ya sirf src link, dono chalta hai.">
          <textarea id="st-embed" rows={3} value={form.mapsEmbed} onChange={(e) => set("mapsEmbed", e.target.value)} maxLength={1500} className={field} />
        </Field>
        <Field id="st-site" label="Website URL (QR code ke liye)" hint="Deploy hone ke baad ka asli address, jaise https://momobychoice.vercel.app. Localhost mat likhein.">
          <input id="st-site" type="url" value={form.siteUrl} onChange={(e) => set("siteUrl", e.target.value)} maxLength={200} className={field} />
        </Field>
      </section>

      <Button type="submit" disabled={saving} className="w-full disabled:opacity-60">
        {saving ? "Save ho raha hai..." : "Settings save karein"}
      </Button>
    </form>
  );
}