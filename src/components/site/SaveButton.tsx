import { useEffect, useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "wedora-shortlist";

export type ShortlistItem = {
  id: string;
  type: "supplier" | "venue";
  name: string;
  slug: string;
  county: string | null;
  image: string | null;
  savedAt: string;
};

function readShortlist(): ShortlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getShortlistItems() {
  return readShortlist();
}

/** Adds a listing to the visitor's browser-saved shortlist. */
export function SaveButton({
  id,
  type,
  name,
  slug,
  county,
  image,
}: {
  id: string;
  type: "supplier" | "venue";
  name: string;
  slug: string;
  county: string | null;
  image: string | null;
}) {
  const key = useMemo(() => `${type}:${id}`, [id, type]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(readShortlist().some((item) => item.id === id && item.type === type));
  }, [id, type]);

  const save = () => {
    const items = readShortlist();
    if (items.some((item) => item.id === id && item.type === type)) {
      setSaved(true);
      return;
    }

    const next: ShortlistItem[] = [
      {
        id,
        type,
        name,
        slug,
        county,
        image,
        savedAt: new Date().toISOString(),
      },
      ...items,
    ].slice(0, 100);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("wedora-shortlist-updated"));
    setSaved(true);
    toast.success("Added to your shortlist.");
  };

  return (
    <Button size="lg" variant="outline" onClick={save} disabled={saved} data-shortlist-key={key}>
      <Heart className={`size-4 ${saved ? "fill-primary text-primary" : ""}`} />
      {saved ? "Shortlisted" : "Save"}
    </Button>
  );
}
