import { Leaf, Flame, QrCode } from "lucide-react";
import { restaurant } from "../../config/restaurant.js";
import SectionHeading from "../ui/SectionHeading.jsx";
import Reveal from "../ui/Reveal.jsx";

const points = [
  { icon: Leaf, title: "Fresh filling", text: "Roz taaza banayi gayi filling aur hand-folded momos." },
  { icon: Flame, title: "Signature chutney", text: "Hamari special red chutney, har plate ke saath." },
  { icon: QrCode, title: "Easy ordering", text: "Table ka QR scan karein aur phone se order karein." },
];

export default function About() {
  return (
    <section className="section bg-cocoa-900">
      <div className="container-page">
        <Reveal>
          <SectionHeading light eyebrow="Our story" title={`Welcome to ${restaurant.name}`} subtitle={restaurant.description} />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-3">
          {points.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 120}>
              <div className="group h-full rounded-2xl border-2 border-spice/40 bg-cocoa-800 p-6 text-center transition-colors hover:border-spice">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-spice text-cocoa-900 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </span>
                <h3 className="text-lg !text-cream">{title}</h3>
                <p className="mt-2 text-sm text-cream/75">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}