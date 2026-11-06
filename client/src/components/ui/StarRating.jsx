import { Star } from "lucide-react";

export default function StarRating({ value = 0, onChange, size = "h-5 w-5" }) {
  if (!onChange) {
    return (
      <div className="flex gap-0.5 text-spice-dark" role="img" aria-label={`${value} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className={`${size} ${i < value ? "fill-current" : "text-cream-deeper"}`} aria-hidden="true" />
        ))}
      </div>
    );
  }

  return (
    <div role="radiogroup" aria-label="Rating" className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => {
        const n = i + 1;
        const active = n <= value;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === value}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => onChange(n)}
            className="rounded p-0.5 transition-transform hover:scale-110"
          >
            <Star className={`h-8 w-8 ${active ? "fill-spice-dark text-spice-dark" : "text-cream-deeper"}`} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}