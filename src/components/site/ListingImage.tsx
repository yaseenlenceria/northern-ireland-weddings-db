import { useState } from "react";
import { ImageOff } from "lucide-react";

/** Listing image with graceful fallback when the source URL fails. */
export function ListingImage({
  src,
  alt,
  className = "",
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-linear-to-br from-accent to-secondary text-muted-foreground ${className}`}
        aria-hidden
      >
        <ImageOff className="size-6 opacity-50" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
