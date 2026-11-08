import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { fetchProxyImage, isProxyImageUrl } from "@/lib/image-proxy";

function decodeHex(value: string) {
  if (value.length > 8192 || !/^(?:[a-f0-9]{2})+$/i.test(value)) return null;
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

        if (!isProxyImageUrl(url)) {
          return new Response("Not found", {
            status: 404,
            headers: { "Cache-Control": "no-store" },
          });
        }
        return fetchProxyImage(url);
      },
    },
  },
});
