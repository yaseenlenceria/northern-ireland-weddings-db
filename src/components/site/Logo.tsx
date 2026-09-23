export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        className="h-8 w-8 shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="32" height="32" rx="8" className="fill-primary" />
        <path
          d="M7 9.5 12.4 22h.3L18.1 9.5"
          className="stroke-gold"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.5 9.5 20.9 22h.3L26.7 9.5"
          className="stroke-gold"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.45"
        />
      </svg>
      <span className="font-display text-lg font-semibold tracking-tight">
        Vow<span className="text-gold"> Visibility</span>
      </span>
    </span>
  );
}
