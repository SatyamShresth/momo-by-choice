import { useState } from "react";
import MomoIcon from "./MomoIcon.jsx";

export default function ImageSlot({ src, alt, label = "Photo coming soon", className = "" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-chili to-cocoa-900 text-spice ${className}`}
      >
        <MomoIcon className="h-14 w-14" />
        <span className="text-xs tracking-wide text-cream/80">{label}</span>
      </div>
    );
  }
  return (
    <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />
  );
}