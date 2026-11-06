import { Link } from "react-router-dom";
import SectionHeading from "../ui/SectionHeading.jsx";
import ImageSlot from "../ui/ImageSlot.jsx";
import Reveal from "../ui/Reveal.jsx";

// SAMPLE DATA – Phase 4 mein database-driven items se replace hoga.
const sample = [
  { name: "Veg Steamed Momo", desc: "Cabbage, carrot aur herbs ki soft filling. 6 pcs.", price: 90, veg: true, tag: "Bestseller" },
  { name: "Chicken Fried Momo", desc: "Crispy fried, juicy chicken filling. 6 pcs.", price: 130, veg: false, tag: "Bestseller" },
  { name: "Paneer Tandoori Momo", desc: "Smoky tandoori masala mein paneer momo. 6 pcs.", price: 150, veg: true, tag: "Chef's Pick" },
  { name: "Chicken Kurkure Momo", desc: "Extra crunchy coating, spicy chicken filling. 6 pcs.", price: 160, veg: false, tag: "Chef's Pick" },
  { name: "Cheese Corn Momo", desc: "Melty cheese aur sweet corn. 6 pcs.", price: 140, veg: true, tag: "New" },
  { name: "Chicken Gravy Momo", desc: "Masaledaar gravy mein dube hue momos. 6 pcs.", price: 170, veg: false, tag: "Spicy" },
];

function VegMark({ veg }) {
  const color = veg ? "border-green-600 text-green-600" : "border-red-700 text-red-700";
  return (
    <span className={`inline-flex h-5 w-5 shrink-0 items-center justify-center border-2 bg-white ${color}`} title={veg ? "Vegetarian" : "Non-vegetarian"}>
      <span className="h-2 w-2 rounded-full bg-current" />
      <span className="sr-only">{veg ? "Vegetarian" : "Non-vegetarian"}</span>
    </span>
  );
}

export default function Popular() {
  return (
    <section className="section bg-cream-dark">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Guest favourites"
            title="Popular momos & chef's picks"
            subtitle="Demo ke liye sample items. Asli menu admin dashboard se manage hoga."
          />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sample.map((d, i) => (
            <Reveal key={d.name} delay={(i % 3) * 100}>
              <article className="group overflow-hidden rounded-2xl border-2 border-cocoa-900 bg-white shadow-pop transition-all duration-200 hover:-translate-y-1 hover:shadow-pop-lg">
                <div className="relative overflow-hidden border-b-2 border-cocoa-900">
                  <ImageSlot
                    alt={d.name}
                    label="Sample image"
                    className="h-44 w-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    className={`absolute left-3 top-3 rounded-full border-2 border-cocoa-900 px-3 py-1 text-xs font-bold ${
                      d.tag === "Spicy" ? "bg-chili text-cream" : "bg-spice text-cocoa-900"
                    }`}
                  >
                    {d.tag}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg">{d.name}</h3>
                    <VegMark veg={d.veg} />
                  </div>
                  <p className="mt-1 text-sm text-ink/70">{d.desc}</p>
                  <p className="mt-3 font-display text-xl font-extrabold text-chili">
                    ₹{d.price} <span className="font-sans text-xs font-normal text-ink/50">(sample)</span>
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/menu" className="font-bold text-chili hover:underline">View full menu →</Link>
        </div>
      </div>
    </section>
  );
}