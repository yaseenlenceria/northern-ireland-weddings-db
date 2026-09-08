import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";
import { imageCandidates, publicImageUrl } from "@/lib/media";

/** Listing image with graceful fallback when the source URL fails. */
export function ListingImage({
  src,
  alt,
  className = "",
}: {
  src?: string | string[] | null;
  alt: string;
  className?: string;
}) {
  const [failedIndex, setFailedIndex] = useState(0);
  const images = imageCandidates(src);
  const imageKey = images.join("|");
  const image = images[failedIndex] ?? null;

  useEffect(() => {
    setFailedIndex(0);
  }, [imageKey]);

  if (!image) {
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
      src={publicImageUrl(image)}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailedIndex((index) => index + 1)}
      className={className}
    />
  );
}
