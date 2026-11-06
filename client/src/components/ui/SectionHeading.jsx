export default function SectionHeading({ eyebrow, title, subtitle, align = "center", light = false }) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`mb-10 max-w-2xl ${alignment}`}>
      {eyebrow && (
        <p
          className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] ${
            light ? "bg-white/10 text-spice-light" : "bg-chili/10 text-chili"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2 className={`text-3xl sm:text-4xl lg:text-5xl ${light ? "!text-cream" : ""}`}>{title}</h2>
      {subtitle && <p className={`mt-3 ${light ? "text-cream/80" : "text-ink/70"}`}>{subtitle}</p>}
    </div>
  );
}