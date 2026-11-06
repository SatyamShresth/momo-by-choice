import MomoIcon from "./MomoIcon.jsx";

const items = ["Steamed", "Fried", "Tandoori", "Kurkure", "Gravy", "Cheese Corn", "Paneer", "Chicken"];

export default function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden py-6" aria-hidden="true">
      <div className="-rotate-1 scale-105 border-y-2 border-cocoa-900 bg-spice py-3 text-cocoa-900">
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {row.map((t, i) => (
            <span key={i} className="flex items-center gap-4 px-4 font-display text-lg font-extrabold uppercase tracking-wide">
              {t}
              <MomoIcon className="h-6 w-6 text-chili" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}