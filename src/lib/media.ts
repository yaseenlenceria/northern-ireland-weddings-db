const PLACEHOLDER_MARKERS = [
  "image_placeholder",
  "defaultnoimage",
  "default-no-image",
  "no-image",
  "noimage",
  "placeholder",
  "undefined",
];

const PROXIED_IMAGE_HOSTS = new Set(["cdn0.hitched.ie", "cdn0.hitched.co.uk"]);

function isKnownUnavailableImage(url: string) {
  const lowered = url.toLowerCase();
  return (
    lowered.includes("://www.weddingsuppliers.ie/uploads/") ||
    lowered.includes("://www.weddingsuppliers.ie/public/uploads/")
  );
}

function hexEncode(value: string) {
  return Array.from(value)
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");
}

export function cleanImageUrl(value?: string | null) {
  const url = value?.trim();
  if (!url) return null;
  if (!/^https?:\/\//i.test(url) && !url.startsWith("/")) return null;
  const lowered = url.toLowerCase();
  if (PLACEHOLDER_MARKERS.some((marker) => lowered.includes(marker))) return null;
  if (isKnownUnavailableImage(url)) return null;
  return url;
}

export function imageCandidates(...values: Array<string | string[] | null | undefined>) {
  const candidates: string[] = [];
  for (const value of values) {
    if (Array.isArray(value)) {
      candidates.push(
        ...value.map(cleanImageUrl).filter((image): image is string => Boolean(image)),
      );
      continue;
    }
    const image = cleanImageUrl(value);
    if (image) candidates.push(image);
  }
  return [...new Set(candidates)];
}

export function publicImageUrl(value: string) {
  if (value.startsWith("/")) return value;
  try {
    const url = new URL(value);
    if (PROXIED_IMAGE_HOSTS.has(url.hostname.toLowerCase())) {
      return `/image/${hexEncode(value)}`;
    }
  } catch {
    return value;
  }
  return value;
}

export function firstImage(...values: Array<string | string[] | null | undefined>) {
  return imageCandidates(...values)[0] ?? null;
}

function youtubeId(url: URL) {
  if (url.hostname.includes("youtu.be")) return url.pathname.split("/").filter(Boolean)[0] ?? null;
  if (url.searchParams.get("v")) return url.searchParams.get("v");
  const parts = url.pathname.split("/").filter(Boolean);
  const markerIndex = parts.findIndex((part) => ["embed", "shorts", "live"].includes(part));
  return markerIndex >= 0 ? (parts[markerIndex + 1] ?? null) : null;
}

function tiktokId(pathname: string) {
  const match = pathname.match(/\/video\/(\d+)/);
  return match?.[1] ?? null;
}

function instagramEmbed(url: URL) {
  const parts = url.pathname.split("/").filter(Boolean);
  const type = parts.find((part) => ["p", "reel", "tv"].includes(part));
  const id = type ? parts[parts.indexOf(type) + 1] : null;
  if (!type || !id) return null;
  return `https://www.instagram.com/${type}/${id}/embed`;
}

export type EmbeddedVideo = {
  originalUrl: string;
  embedUrl: string;
  provider: "YouTube" | "Instagram" | "TikTok" | "Video";
  kind: "iframe" | "video";
};

export function videoEmbed(value?: string | null): EmbeddedVideo | null {
  if (!value) return null;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();
  if (host.includes("youtube.com") || host.includes("youtu.be")) {
    const id = youtubeId(url);
    return id
      ? {
          originalUrl: value,
          embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
          provider: "YouTube",
          kind: "iframe",
        }
      : null;
  }

  if (host.includes("instagram.com")) {
    const embedUrl = instagramEmbed(url);
    return embedUrl
      ? {
          originalUrl: value,
          embedUrl: `${embedUrl}/captioned`,
          provider: "Instagram",
          kind: "iframe",
        }
      : null;
  }

  if (host.includes("tiktok.com")) {
    const id = tiktokId(url.pathname);
    return id
      ? {
          originalUrl: value,
          embedUrl: `https://www.tiktok.com/embed/v2/${id}`,
          provider: "TikTok",
          kind: "iframe",
        }
      : null;
  }

  if (/\.(mp4|webm|ogg|mov)(?:$|\?)/i.test(url.pathname)) {
    return { originalUrl: value, embedUrl: value, provider: "Video", kind: "video" };
  }

  return null;
}
