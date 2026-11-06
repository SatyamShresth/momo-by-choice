import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import { restaurant } from "../../config/restaurant.js";
import MomoIcon from "../ui/MomoIcon.jsx";

export default function Footer() {
  const { address } = restaurant;
  return (
    <footer className="bg-cocoa-950 text-cream/80">
      <div className="container-page grid gap-10 py-12 md:grid-cols-3">
        <div>
          <p className="flex items-center gap-2 font-display text-2xl font-extrabold text-cream">
            <MomoIcon className="h-8 w-8 text-spice" /> {restaurant.name}
          </p>
          <p className="mt-3 text-sm">{restaurant.tagline}</p>
        </div>

        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-spice">Contact</p>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{address.line1}, {address.city}</span></li>
            <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{restaurant.phone}</span></li>
            <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{restaurant.email}</span></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-spice">Explore</p>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-spice" to="/menu">Menu</Link></li>
            <li><Link className="hover:text-spice" to="/reviews">Reviews</Link></li>
            <li><Link className="hover:text-spice" to="/location">Find Us</Link></li>
            {restaurant.social.map((s) => (
              <li key={s.label}><a className="hover:text-spice" href={s.href} target="_blank" rel="noreferrer">{s.label}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-cream/60">
        © {new Date().getFullYear()} {restaurant.name}. All rights reserved.
      </div>
    </footer>
  );
}