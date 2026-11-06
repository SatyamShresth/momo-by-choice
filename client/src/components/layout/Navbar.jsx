import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { restaurant } from "../../config/restaurant.js";
import Button from "../ui/Button.jsx";
import MomoIcon from "../ui/MomoIcon.jsx";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/menu", label: "Menu" },
  { to: "/reviews", label: "Reviews" },
  { to: "/location", label: "Find Us" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  const linkClass = ({ isActive }) =>
    `text-sm font-bold transition-colors hover:text-chili ${isActive ? "text-chili" : "text-cocoa-900"}`;

  return (
    <header className="sticky top-0 z-40 border-b-2 border-cocoa-900 bg-cream/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-2">
        <Link to="/" className="group flex items-center gap-2" aria-label={`${restaurant.name} home`}>
          <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-cocoa-900 bg-chili text-spice transition-transform group-hover:animate-wiggle">
            <MomoIcon className="h-7 w-7" />
          </span>
          <span className="font-display text-lg font-extrabold text-cocoa-900">{restaurant.name}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          <Button to="/menu" className="!px-5 !py-2">View Menu</Button>
        </nav>

        <button
          className="rounded-md p-2 text-cocoa-900 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t-2 border-cocoa-900 bg-cream md:hidden" aria-label="Mobile navigation">
          <div className="container-page flex flex-col gap-1 py-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-3 text-base font-bold ${isActive ? "bg-spice/40 text-chili" : "text-cocoa-900"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}