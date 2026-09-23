import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs, breadcrumbSchema } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/site/JsonLd";
import { SITE_NAME, absoluteUrl, pageMeta, canonical } from "@/lib/seo";

const TITLE = "Wedding Guest List Planner | WedHQ";
const DESCRIPTION =
  "Free guest list planner for weddings. Track names, sides, seats and RSVPs with a live headcount in your browser.";
const STORAGE_KEY = "wedhq-guest-list";
const LEGACY_STORAGE_KEYS = ["shortlist-ie-guest-list", "niamh-weddings-guest-list"];
const SIDES = ["Bride", "Groom", "Both", "Other"];
const RSVPS = ["pending", "yes", "no"];

type Guest = { id: string; name: string; side: string; partySize: number; rsvp: string };

export const Route = createFileRoute("/guest-list")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, path: "/guest-list" }),
    links: canonical("/guest-list"),
  }),
  component: GuestListPage,
});

function GuestListPage() {
  const [rows, setRows] = useState<Guest[]>([]);
  const [name, setName] = useState("");
  const [side, setSide] = useState(SIDES[0]!);
  const [partySize, setPartySize] = useState("1");

  useEffect(() => {
    const saved =
      window.localStorage.getItem(STORAGE_KEY) ??
      LEGACY_STORAGE_KEYS.map((key) => window.localStorage.getItem(key)).find(
        (value): value is string => Boolean(value),
      );
    if (saved) setRows(JSON.parse(saved));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  }, [rows]);

  const stats = useMemo(() => {
    const invited = rows.reduce((sum, row) => sum + row.partySize, 0);
    const attending = rows
      .filter((row) => row.rsvp === "yes")
      .reduce((sum, row) => sum + row.partySize, 0);
    const declined = rows
      .filter((row) => row.rsvp === "no")
      .reduce((sum, row) => sum + row.partySize, 0);
    return { invited, attending, declined, awaiting: Math.max(invited - attending - declined, 0) };
  }, [rows]);

  return (
    <SiteLayout>
      <JsonLd
        data={breadcrumbSchema("", [
          { name: "Home", path: "/" },
          { name: "Planning Tools", path: "/planning-tools" },
          { name: "Guest List", path: "/guest-list" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Wedding Guest List Planner",
          applicationCategory: "LifestyleApplication",
          operatingSystem: "Web",
          description: DESCRIPTION,
          url: absoluteUrl("/guest-list"),
          isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: absoluteUrl("/"),
          },
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "EUR",
          },
        }}
      />

      <PageHeader
        eyebrow="Planning tool"
        title="Guest list planner"
        description="Build the list, track RSVPs and keep a running seat count for your venue."
      >
        <Breadcrumbs
          items={[{ label: "Planning Tools", to: "/planning-tools" }, { label: "Guest List" }]}
        />
      </PageHeader>

      <Section>
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { label: "Invited", value: stats.invited },
              { label: "Attending", value: stats.attending },
              { label: "Awaiting", value: stats.awaiting },
              { label: "Declined", value: stats.declined },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
                <p className="eyebrow text-primary">{stat.label}</p>
                <p className="mt-1 font-serif text-3xl">{stat.value}</p>
              </div>
            ))}
          </div>

          <form
            className="mt-6 grid gap-3 sm:grid-cols-[1.6fr_1fr_auto_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              if (!name.trim()) return;
              setRows((current) => [
                ...current,
                {
                  id: crypto.randomUUID(),
                  name: name.trim(),
                  side,
                  partySize: Math.max(Number(partySize) || 1, 1),
                  rsvp: "pending",
                },
              ]);
              setName("");
              setPartySize("1");
            }}
          >
            <div className="grid gap-1.5">
              <Label htmlFor="guest-name">Guest or household</Label>
              <Input id="guest-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Side</Label>
              <Select value={side} onValueChange={setSide}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SIDES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="guest-party">Seats</Label>
              <Input
                id="guest-party"
                type="number"
                min={1}
                value={partySize}
                onChange={(e) => setPartySize(e.target.value)}
                className="sm:w-24"
              />
            </div>
            <Button type="submit" className="self-end">
              <Plus className="size-4" /> Add
            </Button>
          </form>

          {rows.length ? (
            <ul className="mt-8 divide-y divide-border rounded-xl border border-border bg-card">
              {rows.map((row) => (
                <li key={row.id} className="flex flex-wrap items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{row.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {row.side} side · {row.partySize} seat{row.partySize > 1 ? "s" : ""}
                    </p>
                  </div>
                  <Select
                    value={row.rsvp}
                    onValueChange={(value) =>
                      setRows((current) =>
                        current.map((item) =>
                          item.id === row.id ? { ...item, rsvp: value } : item,
                        ),
                      )
                    }
                  >
                    <SelectTrigger className="w-32" aria-label={`RSVP for ${row.name}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RSVPS.map((rsvp) => (
                        <SelectItem key={rsvp} value={rsvp}>
                          {rsvp === "pending"
                            ? "Pending"
                            : rsvp === "yes"
                              ? "Attending"
                              : "Declined"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <button
                    type="button"
                    aria-label={`Remove ${row.name}`}
                    onClick={() =>
                      setRows((current) => current.filter((item) => item.id !== row.id))
                    }
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
              Add your first household above to start the live headcount.
            </p>
          )}
        </div>
      </Section>
    </SiteLayout>
  );
}
