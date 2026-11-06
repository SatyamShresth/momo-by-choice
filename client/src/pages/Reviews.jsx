import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getReviews, createReview } from "../services/reviewService.js";
import StarRating from "../components/ui/StarRating.jsx";
import Button from "../components/ui/Button.jsx";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [summary, setSummary] = useState({ average: 0, count: 0 });
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [loadingMore, setLoadingMore] = useState(false);

  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const loadFirst = useCallback(async (signal) => {
    setStatus("loading");
    try {
      const data = await getReviews({ page: 1 }, signal);
      setReviews(data.reviews);
      setPagination(data.pagination);
      setSummary(data.summary);
      setStatus("ready");
    } catch (err) {
      if (err.name === "AbortError") return;
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadFirst(controller.signal);
    return () => controller.abort();
  }, [loadFirst]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const data = await getReviews({ page: pagination.page + 1 });
      setReviews((prev) => [...prev, ...data.reviews]);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const validate = () => {
    const e = {};
    if (rating < 1 || rating > 5) e.rating = "Rating chunein (1 se 5 stars).";
    if (name.trim().length < 2 || name.trim().length > 50) e.name = "Naam 2 se 50 characters ka hona chahiye.";
    if (text.trim().length < 10 || text.trim().length > 500) e.text = "Review 10 se 500 characters ka hona chahiye.";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error("Form mein kuch galtiyan hain.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createReview({ name: name.trim(), rating, text: text.trim(), website });
      toast.success(res.message, { duration: 5000 });
      setRating(0);
      setName("");
      setText("");
      setErrors({});
      await loadFirst();
    } catch (err) {
      if (err.status === 400 && err.details) {
        const fe = {};
        err.details.forEach((d) => (fe[d.field] = d.message));
        setErrors(fe);
      }
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full rounded-xl border-2 border-cocoa-900 bg-white px-4 py-2.5 text-sm outline-none focus:border-chili";

  return (
    <section className="section pt-8 sm:pt-10">
      <div className="container-page">
        <div className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl">Reviews</h1>
          {summary.count > 0 && (
            <div className="mt-3 flex items-center justify-center gap-3">
              <StarRating value={Math.round(summary.average)} size="h-6 w-6" />
              <p className="text-sm font-bold">
                {summary.average.toFixed(1)} / 5 <span className="font-normal text-ink/60">({summary.count} review{summary.count === 1 ? "" : "s"})</span>
              </p>
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-2xl border-2 border-cocoa-900 bg-white p-6 shadow-pop lg:col-span-2 lg:self-start">
            <h2 className="text-xl">Apna review likhein</h2>

            <div>
              <p className="mb-1 text-sm font-bold">Rating</p>
              <StarRating value={rating} onChange={setRating} />
              {errors.rating && <p className="mt-1 text-xs font-bold text-chili" role="alert">{errors.rating}</p>}
            </div>

            <div>
              <label htmlFor="rv-name" className="mb-1 block text-sm font-bold">Aapka naam</label>
              <input id="rv-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={50} className={inputClass} autoComplete="name" />
              {errors.name && <p className="mt-1 text-xs font-bold text-chili" role="alert">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="rv-text" className="mb-1 block text-sm font-bold">Review</label>
              <textarea id="rv-text" rows={4} value={text} onChange={(e) => setText(e.target.value)} maxLength={500} className={inputClass} />
              <p className="mt-1 text-right text-xs text-ink/50">{text.length}/500</p>
              {errors.text && <p className="text-xs font-bold text-chili" role="alert">{errors.text}</p>}
            </div>

            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="rv-website">Website</label>
              <input id="rv-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>

            <Button type="submit" disabled={submitting} className="w-full disabled:opacity-60">
              {submitting ? "Bhej rahe hain..." : "Review bhejein"}
            </Button>
            <p className="text-xs text-ink/60">Aapka review turant website par dikhega. Galat ya aapatti-jank content restaurant hata sakta hai.</p>
          </form>

          <div className="space-y-4 lg:col-span-3">
            {status === "loading" &&
              Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-2xl border-2 border-cocoa-900/20 bg-cream-dark" aria-hidden="true" />
              ))}

            {status === "error" && (
              <div className="rounded-2xl border-2 border-dashed border-chili p-8 text-center" role="alert">
                <p className="font-display text-xl font-extrabold">Reviews load nahi ho paye</p>
                <Button variant="dark" className="mt-4" onClick={() => loadFirst()}>Dobara try karein</Button>
              </div>
            )}

            {status === "ready" && reviews.length === 0 && (
              <div className="rounded-2xl border-2 border-dashed border-cocoa-900/40 p-10 text-center">
                <p className="font-display text-xl font-extrabold">Abhi koi review nahi</p>
                <p className="mt-2 text-sm text-ink/70">Pehla review aap likhiye!</p>
              </div>
            )}

            {status === "ready" &&
              reviews.map((r) => (
                <article key={r.id} className="rounded-2xl border-2 border-cocoa-900 bg-white p-5 shadow-pop">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <StarRating value={r.rating} />
                    <time dateTime={r.date} className="text-xs text-ink/60">{formatDate(r.date)}</time>
                  </div>
                  <p className="mt-3 text-sm text-ink/80">{r.text}</p>
                  <p className="mt-3 text-sm font-bold text-cocoa-900">{r.name}</p>
                </article>
              ))}

            {status === "ready" && pagination.page < pagination.pages && (
              <div className="text-center">
                <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
                  {loadingMore ? "Load ho raha hai..." : "Aur reviews dikhayein"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}