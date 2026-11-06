import ImageSlot from "../ui/ImageSlot.jsx";
import VegMark from "../ui/VegMark.jsx";

export default function MenuCard({ item }) {
  const unavailable = !item.available;

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border-2 border-cocoa-900 bg-white shadow-pop transition-all duration-200 hover:-translate-y-1 hover:shadow-pop-lg ${
        unavailable ? "opacity-70" : ""
      }`}
    >
      <div className="relative overflow-hidden border-b-2 border-cocoa-900">
        <ImageSlot
          src={item.image}
          alt={item.name}
          label="Photo soon"
          className={`h-36 w-full transition-transform duration-500 group-hover:scale-105 sm:h-40 ${unavailable ? "grayscale" : ""}`}
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {item.bestseller && (
            <span className="rounded-full border-2 border-cocoa-900 bg-spice px-2 py-0.5 text-[11px] font-bold text-cocoa-900">Bestseller</span>
          )}
          {item.recommended && (
            <span className="rounded-full border-2 border-cocoa-900 bg-chili px-2 py-0.5 text-[11px] font-bold text-cream">Recommended</span>
          )}
        </div>
        {unavailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-cocoa-900/60">
            <span className="rounded-full bg-cream px-3 py-1 text-xs font-bold text-cocoa-900">Currently unavailable</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base leading-snug">{item.name}</h3>
          <VegMark veg={item.veg} />
        </div>
        <p className="mt-1 flex-1 text-sm text-ink/70">{item.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <p className={`font-display text-xl font-extrabold ${unavailable ? "text-ink/40 line-through" : "text-chili"}`}>₹{item.price}</p>
          {unavailable && <span className="text-xs font-bold text-ink/60">Abhi available nahi</span>}
        </div>
      </div>
    </article>
  );
}