import { MapPin, Clock } from "lucide-react";
import { restaurant } from "../../config/restaurant.js";
import SectionHeading from "../ui/SectionHeading.jsx";
import Button from "../ui/Button.jsx";
import Reveal from "../ui/Reveal.jsx";

export default function VisitUs() {
  const { address, hours, mapsLink } = restaurant;
  return (
    <section className="section bg-chili">
      <div className="container-page">
        <Reveal>
          <SectionHeading light eyebrow="Visit us" title="Hours & location" />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border-2 border-cocoa-900 bg-cocoa-900 p-6 text-cream shadow-[6px_6px_0_0_#FFB22C]">
              <h3 className="mb-4 flex items-center gap-2 text-lg !text-cream"><Clock className="h-5 w-5 text-spice" aria-hidden="true" /> Opening hours</h3>
              <dl className="space-y-3 text-sm">
                {hours.map((h) => (
                  <div key={h.day} className="flex justify-between gap-4 border-b border-white/10 pb-2">
                    <dt>{h.day}</dt><dd className="text-cream/80">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="h-full rounded-2xl border-2 border-cocoa-900 bg-cocoa-900 p-6 text-cream shadow-[6px_6px_0_0_#FFB22C]">
              <h3 className="mb-4 flex items-center gap-2 text-lg !text-cream"><MapPin className="h-5 w-5 text-spice" aria-hidden="true" /> Address</h3>
              <address className="text-sm not-italic leading-7 text-cream/80">
                {address.line1}<br />{address.line2}<br />{address.city}, {address.state} {address.pincode}
              </address>
              <div className="mt-5">
                {mapsLink ? (
                  <Button href={mapsLink} target="_blank" rel="noreferrer">Get Directions</Button>
                ) : (
                  <Button to="/location">Location details</Button>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}