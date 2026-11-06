import { QrCode } from "lucide-react";
import { restaurant } from "../../config/restaurant.js";
import Button from "../ui/Button.jsx";
import ImageSlot from "../ui/ImageSlot.jsx";
import MomoIcon from "../ui/MomoIcon.jsx";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-chili text-cream">
      {/* Floating momos (decorative) */}
      <MomoIcon face={false} className="pointer-events-none absolute left-[6%] top-[10%] h-10 w-10 animate-float text-spice/70" />
      <MomoIcon face={false} className="pointer-events-none absolute right-[8%] top-[8%] h-14 w-14 animate-float text-cream/30 [animation-delay:1.2s]" />
      <MomoIcon face={false} className="pointer-events-none absolute bottom-[22%] left-[44%] hidden h-12 w-12 animate-float text-spice/60 [animation-delay:2.4s] md:block" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-cocoa-900/30 blur-3xl" aria-hidden="true" />

      <div className="container-page relative grid items-center gap-10 py-14 md:grid-cols-2 md:py-24">
        <div className="animate-fade-up">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cream/30 px-3 py-1 text-xs tracking-widest text-spice-light">
            <QrCode className="h-4 w-4" aria-hidden="true" /> SCAN · ORDER · ENJOY
          </p>
          <h1 className="!text-cream text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
            Momo <span className="text-spice">by</span> Choice
          </h1>
          <p className="mt-4 max-w-md text-lg text-cream/90">{restaurant.tagline}</p>

          <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold">
            {["Steamed", "Fried", "Tandoori", "Kurkure"].map((t) => (
              <span key={t} className="rounded-full bg-cocoa-900/40 px-3 py-1 text-cream">{t}</span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/menu">Order Momos</Button>
            <Button to="/location" variant="light">Find Us</Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md animate-fade-up [animation-delay:200ms]">
          {/* Hero photo: client/public/images/hero.jpg */}
          <ImageSlot
            src="/images/hero.jpg"
            alt="Plate of freshly steamed momos with red chutney"
            label="Add /public/images/hero.jpg"
            className="aspect-[4/5] w-full rounded-t-[10rem] rounded-b-3xl border-4 border-spice shadow-pop-lg"
          />

          {/* Rotating badge */}
          <div className="absolute -bottom-8 -left-6 h-28 w-28 sm:-left-10 sm:h-32 sm:w-32">
            <div className="relative h-full w-full rounded-full border-2 border-cocoa-900 bg-spice text-cocoa-900 shadow-pop">
              <svg viewBox="0 0 120 120" className="absolute inset-0 animate-spin-slow" aria-hidden="true">
                <defs>
                  <path id="badge-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
                </defs>
                <text fill="currentColor" fontSize="9" fontWeight="800" textLength="272" lengthAdjust="spacing">
                  <textPath href="#badge-circle">HAND FOLDED • FRESH DAILY • STEAMING HOT • </textPath>
                </text>
              </svg>
              <MomoIcon steam className="absolute inset-0 m-auto h-12 w-12 text-chili" />
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="block h-10 w-full text-cream sm:h-16" fill="currentColor" aria-hidden="true">
        <path d="M0,40 C240,90 480,0 720,40 C960,80 1200,10 1440,40 L1440,80 L0,80 Z" />
      </svg>
    </section>
  );
}