export default function MomoIcon({ className = "", steam = false, face = true }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" fill="none">
      {steam && (
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7">
          <path className="animate-steam" d="M24 12c-3-3 3-5 0-9" />
          <path className="animate-steam [animation-delay:700ms]" d="M32 12c-3-3 3-5 0-9" />
          <path className="animate-steam [animation-delay:1400ms]" d="M40 12c-3-3 3-5 0-9" />
        </g>
      )}
      <path
        d="M5 44c0-15 12-26 27-26s27 11 27 26c0 3-2 6-6 6H11c-4 0-6-3-6-6z"
        fill="currentColor"
      />
      <g stroke="#34100B" strokeWidth="2" strokeLinecap="round" opacity="0.3">
        <path d="M32 21v9" />
        <path d="M22 24c-2 4-2 7-1 10" />
        <path d="M42 24c2 4 2 7 1 10" />
        <path d="M14 32c-1 3-1 5 0 7" />
        <path d="M50 32c1 3 1 5 0 7" />
      </g>
      {face && (
        <g fill="#34100B">
          <circle cx="25" cy="39" r="2.2" />
          <circle cx="39" cy="39" r="2.2" />
          <path d="M28 43.5q4 4 8 0" stroke="#34100B" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
      )}
    </svg>
  );
}