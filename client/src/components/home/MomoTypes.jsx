import { Link } from "react-router-dom";
import SectionHeading from "../ui/SectionHeading.jsx";
import MomoIcon from "../ui/MomoIcon.jsx";
import Reveal from "../ui/Reveal.jsx";

// SAMPLE categories – real categories admin dashboard se manage honge (Phase 6).
const types = [
  { name: "Steamed", desc: "Soft, juicy aur ekdum garam.", color: "bg-chili text-cream" },
  { name: "Fried", desc: "Bahar se crispy, andar se rasila.", color: "bg-spice text-cocoa-900" },
  { name: "Tandoori", desc: "Smoky masala aur tandoor ka swaad.", color: "bg-cocoa-900 text-spice" },
  { name: "Kurkure", desc: "Extra crunchy coating ke saath.", color: "bg-spice-dark text-cocoa-900" },
  { name: "Gravy / Kothey", desc: "Masaledaar sauce mein dubke.", color: "bg-cocoa-700 text-spice-light" },
];

export default function MomoTypes() {
  return (
    <section className="section pt-4">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Your choice"
            title="Apna momo, apna style"
            subtitle="Filling bhi chuniye, style bhi. Veg, chicken ya paneer – sab ek hi jagah."
          />
        </Reveal>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {types.map((t, i) => (
            <li key={t.name}>
              <Reveal delay={i * 90} className="h-full">
                <Link
                  to="/menu"
                  className="group flex h-full flex-col items-center rounded-2xl border-2 border-cocoa-900 bg-white p-5 text-center shadow-pop transition-all duration-200 hover:-translate-y-1 hover:shadow-pop-lg"
                >
                  <span className={`mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-cocoa-900 ${t.color}`}>
                    <MomoIcon className="h-10 w-10 group-hover:animate-wiggle" />
                  </span>
                  <h3 className="text-base">{t.name}</h3>
                  <p className="mt-1 text-xs text-ink/70">{t.desc}</p>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}