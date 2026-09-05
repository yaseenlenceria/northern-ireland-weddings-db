import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, RotateCcw, Trash2 } from "lucide-react";
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
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { pageMeta, canonical } from "@/lib/seo";

const TITLE = "Wedding Budget Calculator (Ireland) | Shortlist.ie";
const DESCRIPTION =
  "Free wedding budget calculator for Irish couples. Add quotes, track deposits and see what is left to pay without needing an account.";
const STORAGE_KEY = "shortlist-ie-budget-items";
const LEGACY_STORAGE_KEY = "niamh-weddings-budget-items";

const CATEGORIES = [
  "Venue & catering",
  "Photography",
  "Videography",
  "Music & entertainment",
  "Flowers & styling",
  "Attire & beauty",
  "Cake",
  "Transport",
  "Stationery",
  "Rings",
  "Other",
];

type BudgetItem = {
  id: string;
  label: string;
  category: string;
  estimated: number;
  actual: number;
};

const STARTER: BudgetItem[] = [
  { id: "venue-meal", label: "Venue and meal", category: "Venue & catering", estimated: 12000, actual: 0 },
  { id: "drinks", label: "Drinks reception", category: "Venue & catering", estimated: 1200, actual: 0 },
  { id: "photographer", label: "Photographer", category: "Photography", estimated: 2200, actual: 0 },
  { id: "video", label: "Videographer", category: "Videography", estimated: 1800, actual: 0 },
  { id: "band", label: "Band", category: "Music & entertainment", estimated: 1600, actual: 0 },
  { id: "dj", label: "DJ / afters", category: "Music & entertainment", estimated: 450, actual: 0 },
  { id: "flowers", label: "Florals", category: "Flowers & styling", estimated: 1200, actual: 0 },
  { id: "dress", label: "Dress and accessories", category: "Attire & beauty", estimated: 2000, actual: 0 },
  { id: "suits", label: "Suits", category: "Attire & beauty", estimated: 700, actual: 0 },
  { id: "cake", label: "Cake", category: "Cake", estimated: 400, actual: 0 },
  { id: "cars", label: "Cars", category: "Transport", estimated: 500, actual: 0 },
  { id: "rings", label: "Wedding rings", category: "Rings", estimated: 1200, actual: 0 },
];

const euro = (n: number) => `€${Math.max(n, 0).toLocaleString("en-IE", { maximumFractionDigits: 0 })}`;
const safeNumber = (value: string) => Math.max(Number(value) || 0, 0);

export const Route = createFileRoute("/budget-calculator")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, path: "/budget-calculator" }),
    links: canonical("/budget-calculator"),
  }),
  component: BudgetPage,
});

function BudgetPage() {
  const [rows, setRows] = useState<BudgetItem[]>(STARTER);
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]!);
  const [estimated, setEstimated] = useState("");

  useEffect(() => {
    const saved =
      window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (saved) setRows(JSON.parse(saved));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  }, [rows]);

  const totals = useMemo(() => {
    const estimate = rows.reduce((sum, row) => sum + row.estimated, 0);
    const paid = rows.reduce((sum, row) => sum + row.actual, 0);
    return { estimate, paid, remaining: Math.max(estimate - paid, 0) };
  }, [rows]);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Planning tool"
        title="Wedding budget calculator"
        description="Add real supplier quotes, update deposits as you pay them, and keep the whole budget in this browser."
      >
        <Breadcrumbs items={[{ label: "Planning Tools", to: "/planning-tools" }, { label: "Budget Calculator" }]} />
      </PageHeader>

      <Section>
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Estimated total", value: totals.estimate },
              { label: "Paid so far", value: totals.paid },
              { label: "Still to pay", value: totals.remaining },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
                <p className="eyebrow text-primary">{stat.label}</p>
                <p className="mt-1 font-serif text-3xl">{euro(stat.value)}</p>
              </div>
            ))}
          </div>

          <form
            className="mt-6 grid gap-3 sm:grid-cols-[1.5fr_1fr_auto_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              if (!label.trim()) return;
              setRows((current) => [
                ...current,
                { id: crypto.randomUUID(), label: label.trim(), category, estimated: safeNumber(estimated), actual: 0 },
              ]);
              setLabel("");
              setEstimated("");
            }}
          >
            <div className="grid gap-1.5">
              <Label htmlFor="budget-label">Line item</Label>
              <Input id="budget-label" value={label} onChange={(e) => setLabel(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="budget-estimate">Estimate €</Label>
              <Input id="budget-estimate" type="number" min={0} value={estimated} onChange={(e) => setEstimated(e.target.value)} className="sm:w-28" />
            </div>
            <Button type="submit" className="self-end"><Plus className="size-4" /> Add</Button>
          </form>

          <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <caption className="sr-only">Wedding budget calculator lines</caption>
              <thead className="bg-ivory text-left">
                <tr>
                  <th scope="col" className="p-3 font-medium">Item</th>
                  <th scope="col" className="p-3 font-medium">Category</th>
                  <th scope="col" className="p-3 font-medium">Estimate</th>
                  <th scope="col" className="p-3 font-medium">Paid</th>
                  <th scope="col" className="p-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="p-3">{row.label}</td>
                    <td className="p-3 text-muted-foreground">{row.category}</td>
                    <td className="p-3">
                      <Input
                        aria-label={`Estimate for ${row.label}`}
                        type="number"
                        min={0}
                        value={row.estimated}
                        onChange={(e) => setRows((current) => current.map((item) => item.id === row.id ? { ...item, estimated: safeNumber(e.target.value) } : item))}
                        className="h-9 w-28"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        aria-label={`Paid for ${row.label}`}
                        type="number"
                        min={0}
                        value={row.actual}
                        onChange={(e) => setRows((current) => current.map((item) => item.id === row.id ? { ...item, actual: safeNumber(e.target.value) } : item))}
                        className="h-9 w-28"
                      />
                    </td>
                    <td className="p-3 text-right">
                      <button type="button" aria-label={`Delete ${row.label}`} onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button variant="outline" className="mt-5" onClick={() => setRows(STARTER)}>
            <RotateCcw className="size-4" /> Reset starter budget
          </Button>
        </div>
      </Section>
    </SiteLayout>
  );
}
