const HOSTS = new Set(["cdn0.hitched.ie", "cdn0.hitched.co.uk"]);
const ACCEPT = "image/avif,image/webp,image/apng,image/*;q=0.9,*/*;q=0.5";

export function isProxyImageUrl(url: URL) {
  return (
    ["https:", "http:"].includes(url.protocol) &&
    !url.username &&
    !url.password &&
    !url.port &&
    (HOSTS.has(url.hostname.toLowerCase()) ||
      (url.hostname === "s3-eu-west-1.amazonaws.com" &&
        url.pathname.startsWith("/weddingdates-media/")))
  );
}

function imageType(response: Response) {
  const type = response.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
  return type?.startsWith("image/") ? type : null;
}

/** Upstreams sometimes return an HTML challenge with HTTP 200. Try the fallback then too. */
export async function fetchProxyImage(url: URL, fetcher: typeof fetch = fetch) {
  const fallback = new URL("https://images.weserv.nl/");
  fallback.searchParams.set("url", `${url.hostname}${url.pathname}${url.search}`);
  fallback.searchParams.set("w", "1200");
  fallback.searchParams.set("output", "webp");

  for (const target of [url, fallback]) {
    try {
      const response = await fetcher(target, {
        headers: { "User-Agent": "WedHQ image renderer", Accept: ACCEPT },
        signal: AbortSignal.timeout(8000),
        redirect: "error",
      });
      const type = imageType(response);
      if (response.ok && response.body && type) {
        return new Response(response.body, {
          headers: {
            "Content-Type": type,
            "Cache-Control":
              "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800",
            "X-Content-Type-Options": "nosniff",
          },
        });
      }
      await response.body?.cancel();
    } catch {
      // A timeout, network error, redirect or non-image response can be transient.
    }
  }
  return new Response("Image temporarily unavailable", {
    status: 503,
    headers: { "Cache-Control": "no-store", "Retry-After": "300" },
  });
}
