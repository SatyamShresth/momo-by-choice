import { Star } from "lucide-react";
import SectionHeading from "../ui/SectionHeading.jsx";
import Reveal from "../ui/Reveal.jsx";

// SAMPLE reviews – asli, admin-approved reviews MongoDB se aayenge (Phase 2/4).
const sample = [
  { name: "Sample Customer A", rating: 5, text: "Placeholder review – momos ekdum soft aur chutney lajawab." },
  { name: "Sample Customer B", rating: 4, text: "Placeholder review – tandoori momo try kiya, bahut accha laga." },
  { name: "Sample Customer C", rating: 5, text: "Placeholder review – QR se order karna bahut easy tha." },
];
const tilt = ["md:-rotate-2", "md:rotate-1", "md:-rotate-1"];

export default function ReviewHighlights() {
  return (
    <section className="section overflow-hidden">
      <div className="container-page">
        <Reveal>
          <SectionHeading eyebrow="Kind words" title="What our guests say" subtitle="Sirf layout ke liye sample reviews." />
        </Reveal>
        <div className="grid gap-8 md:grid-cols-3">
          {sample.map((r, i) => (
            <Reveal key={r.name} delay={i * 120}>
              <figure className={`rounded-2xl border-2 border-cocoa-900 bg-white p-6 shadow-pop transition-transform duration-300 hover:rotate-0 ${tilt[i]}`}>
                <div className="flex gap-1 text-spice-dark" role="img" aria-label={`${r.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, k) => (
                    <Star key={k} className={`h-5 w-5 ${k < r.rating ? "fill-current" : "text-cream-deeper"}`} aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="mt-3 text-sm text-ink/80">“{r.text}”</blockquote>
                <figcaption className="mt-4 text-sm font-bold text-cocoa-900">{r.name}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}