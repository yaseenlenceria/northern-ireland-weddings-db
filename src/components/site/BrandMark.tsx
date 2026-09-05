import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SITE_NAME } from "@/lib/seo";

export function BrandIcon({ className = "size-8" }: { className?: string }) {
  return (
    <span
      className={`${className} relative inline-flex shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft`}
      aria-hidden="true"
    >
      <span className="font-serif text-[0.62em] font-bold leading-none">S</span>
      <Check className="absolute -bottom-0.5 -right-0.5 size-[0.42em] rounded-full bg-gold p-[0.08em] text-gold-foreground" />
    </span>
  );
}

export function BrandWordmark({ className = "font-serif text-xl" }: { className?: string }) {
  return <span className={className}>{SITE_NAME}</span>;
}

export function BrandLink({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2" onClick={onClick}>
      <BrandIcon />
      <BrandWordmark className="font-serif text-xl leading-none tracking-tight" />
    </Link>
  );
}
