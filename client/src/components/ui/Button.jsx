import { Link } from "react-router-dom";

const variants = {
  primary: "bg-spice text-cocoa-900 hover:bg-spice-light",
  chili: "bg-chili text-cream hover:bg-chili-light",
  dark: "bg-cocoa-900 text-cream hover:bg-cocoa-700",
  light: "bg-cream text-cocoa-900 hover:bg-white",
  outline: "bg-transparent text-cocoa-900 hover:bg-cocoa-900 hover:text-cream",
};

export default function Button({ to, href, variant = "primary", className = "", children, ...props }) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full border-2 border-cocoa-900 px-6 py-3 text-sm font-bold tracking-wide shadow-[3px_3px_0_0_#34100B] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#34100B] active:translate-y-0.5 active:shadow-none ${variants[variant]} ${className}`;
  if (to) return <Link to={to} className={classes} {...props}>{children}</Link>;
  if (href) return <a href={href} className={classes} {...props}>{children}</a>;
  return <button className={classes} {...props}>{children}</button>;
}