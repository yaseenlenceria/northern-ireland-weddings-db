import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const ALLOWED_IMAGE_HOSTS = new Set(["cdn0.hitched.ie", "cdn0.hitched.co.uk"]);

function decodeHex(value: string) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(value)) return null;
  let decoded = "";
  for (let i = 0; i < value.length; i += 2) {
    decoded += String.fromCharCode(Number.parseInt(value.slice(i, i + 2), 16));
  }
  return decoded;
}

export const Route = createFileRoute("/image/$encoded")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const decoded = decodeHex(params.encoded);
        if (!decoded) return new Response("Not found", { status: 404 });

        let url: URL;
        try {
          url = new URL(decoded);
        } catch {
          return new Response("Not found", { status: 404 });
        }

        if (!["https:", "http:"].includes(url.protocol)) {
          return new Response("Not found", { status: 404 });
        }
        if (!ALLOWED_IMAGE_HOSTS.has(url.hostname.toLowerCase())) {
          return new Response("Not found", { status: 404 });
        }

        let image = await fetch(url, {
          headers: {
            "User-Agent": "WedHQ image renderer",
            Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          },
        });

        if (!image.ok || !image.body) {
          const fallbackUrl = new URL("https://images.weserv.nl/");
          fallbackUrl.searchParams.set("url", `${url.hostname}${url.pathname}${url.search}`);
          fallbackUrl.searchParams.set("w", "1200");
          fallbackUrl.searchParams.set("output", "webp");
          image = await fetch(fallbackUrl, {
            headers: {
              Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
            },
          });
        }

        if (!image.ok || !image.body) {
          return new Response("Not found", { status: 404 });
        }

        const contentType = image.headers.get("content-type") ?? "image/jpeg";
        if (!contentType.startsWith("image/")) {
          return new Response("Not found", { status: 404 });
        }

        return new Response(image.body, {
          headers: {
            "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800",
            "Content-Type": contentType,
            "X-Content-Type-Options": "nosniff",
          },
        });
      },
    },
  },
});
