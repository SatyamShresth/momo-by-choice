import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Check, EyeOff, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import * as admin from "../../services/adminService.js";
import StarRating from "../../components/ui/StarRating.jsx";
import Button from "../../components/ui/Button.jsx";

const TABS = [
  { v: "approved", label: "Live" },
  { v: "hidden", label: "Hidden" },
];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function AdminReviews() {
  const { token, logout } = useAuth();
  const [tab, setTab] = useState("approved");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({
    reviews: [],
    pagination: { page: 1, pages: 1, total: 0 },
    counts: {approved: 0, hidden: 0 },
  });
  const [status, setStatus] = useState("loading");
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
        const d = await admin.getAdminReviews(token, { status: tab, page });
        setData(d);
        setStatus("ready");
        if (d.reviews.length === 0 && page > 1) setPage(page - 1);
      } catch (err) {
        if (err.status === 401) return logout();
        setStatus("error");
      }
    },
    [token, tab, page, logout]
  );

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = async (r, next) => {
    setBusyId(r.id);
    try {
      await admin.setReviewStatus(token, r.id, next);
        toast.success(next === "approved" ? "Review wapas live ho gaya" : "Review hide ho gaya", { duration: 1500 });
      await load(true);
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (r) => {
    if (!window.confirm("Ye review hamesha ke liye delete karein?")) return;
    setBusyId(r.id);
    try {
      await admin.deleteReview(token, r.id);
      toast.success("Review delete ho gaya");
      await load(true);
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId(null);
    }
  };

  const btn = "inline-flex items-center gap-1 rounded-full border-2 border-cocoa-900 px-3 py-1 text-xs font-bold disabled:opacity-50";

  return (
    <div className="space-y-5">
      <div role="tablist" aria-label="Review status" className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.v}
            type="button"
            role="tab"
            aria-selected={tab === t.v}
            onClick={() => {
              setTab(t.v);
              setPage(1);
            }}
            className={`rounded-full border-2 border-cocoa-900 px-4 py-1.5 text-sm font-bold ${tab === t.v ? "bg-chili text-cream" : "bg-white hover:bg-spice/40"}`}
          >
            {t.label} ({data.counts[t.v]})
          </button>
        ))}
      </div>

      {status === "loading" && <p role="status" className="text-center text-sm font-bold text-ink/60">Load ho raha hai...</p>}

      {status === "error" && (
        <div className="rounded-2xl border-2 border-dashed border-chili p-8 text-center" role="alert">
          <p className="font-display text-xl font-extrabold">Reviews load nahi ho paye</p>
          <Button variant="dark" className="mt-4" onClick={() => load()}>Dobara try karein</Button>
        </div>
      )}

      {status === "ready" && data.reviews.length === 0 && (
        <p className="rounded-2xl border-2 border-dashed border-cocoa-900/30 p-8 text-center text-sm text-ink/60">
          Is section mein abhi koi review nahi.
        </p>
      )}

      {status === "ready" &&
        data.reviews.map((r) => (
          <article key={r.id} className="rounded-2xl border-2 border-cocoa-900 bg-white p-5 shadow-pop">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <StarRating value={r.rating} />
              <time dateTime={r.date} className="text-xs text-ink/60">{formatDate(r.date)}</time>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm text-ink/80">{r.text}</p>
            <p className="mt-2 text-sm font-bold">{r.name}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {r.status !== "approved" && (
                <button type="button" disabled={busyId === r.id} onClick={() => changeStatus(r, "approved")} className={`${btn} bg-green-500 hover:bg-green-400`}>
                  <Check className="h-3.5 w-3.5" aria-hidden="true" /> Wapas dikhayein
                </button>
              )}
              {r.status !== "hidden" && (
                <button type="button" disabled={busyId === r.id} onClick={() => changeStatus(r, "hidden")} className={`${btn} bg-spice hover:bg-spice-light`}>
                  <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> Hide
                </button>
              )}
              <button type="button" disabled={busyId === r.id} onClick={() => remove(r)} className={`${btn} bg-white hover:bg-chili hover:text-cream`}>
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
              </button>
            </div>
          </article>
        ))}

      {status === "ready" && data.pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)} className="disabled:opacity-40">← Pehle</Button>
          <span className="text-sm font-bold">{page} / {data.pagination.pages}</span>
          <Button variant="outline" disabled={page >= data.pagination.pages} onClick={() => setPage(page + 1)} className="disabled:opacity-40">Agle →</Button>
        </div>
      )}
    </div>
  );
}