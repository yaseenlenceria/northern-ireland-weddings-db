import { Link } from "@tanstack/react-router";
import { SITE_NAME } from "@/lib/seo";

export function BrandLogo({ className = "h-10 w-auto" }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt={SITE_NAME}
      width={679}
      height={214}
      className={`${className} object-contain`}
    />
  );
}

export function BrandIcon({ className = "size-8" }: { className?: string }) {
  return (
    <img
      src="/favicon.png"
      alt=""
      width={32}
      height={32}
      className={`${className} shrink-0 object-contain`}
      aria-hidden="true"
    />
  );
}

export function BrandWordmark({ className = "font-serif text-xl" }: { className?: string }) {
  return <span className={className}>{SITE_NAME}</span>;
}

export function BrandLink({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" className="flex shrink-0 items-center" aria-label={SITE_NAME} onClick={onClick}>
      <BrandLogo className="h-10 w-auto sm:h-11" />
    </Link>
  );
}
