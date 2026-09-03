import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { canonical, pageMeta } from "@/lib/seo";

const TITLE = "Wedding Checklist for Irish Weddings | Niamh Weddings";
const DESCRIPTION =
  "A free wedding checklist for Irish couples. Tick off booking, legal, guest, styling and final-week tasks in your browser.";
const STORAGE_KEY = "niamh-weddings-checklist-items";
const PHASES = ["12+ months", "9-12 months", "6-9 months", "3-6 months", "1-3 months", "Final month"];

type ChecklistItem = { id: string; title: string; category: string; done: boolean };

const STARTER: ChecklistItem[] = [
  ["Agree a total budget and who is contributing", "12+ months"],
  ["Draft the guest list and agree a headcount", "12+ months"],
  ["Shortlist and view wedding venues", "12+ months"],
  ["Book the venue and pay the deposit", "12+ months"],
  ["Book the photographer", "9-12 months"],
  ["Book the band and ceremony music", "9-12 months"],
  ["Book the celebrant or solemniser", "9-12 months"],
  ["Give notice of intention to marry", "9-12 months"],
  ["Choose wedding attire and book fittings", "6-9 months"],
  ["Book the videographer", "6-9 months"],
  ["Book florist, cake and transport", "6-9 months"],
  ["Send invitations and set up RSVPs", "3-6 months"],
  ["Book hair and makeup trials", "3-6 months"],
  ["Arrange accommodation blocks for guests", "3-6 months"],
  ["Confirm the running order with all suppliers", "1-3 months"],
  ["Finalise the seating plan", "1-3 months"],
  ["Confirm final numbers with the venue", "Final month"],
  ["Pay outstanding balances", "Final month"],
].map(([title, category], index) => ({ id: `starter-${index}`, title, category, done: false }));

export const Route = createFileRoute("/wedding-checklist")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, path: "/wedding-checklist" }),
    links: canonical("/wedding-checklist"),
  }),
  component: ChecklistPage,
});

function ChecklistPage() {
  const [rows, setRows] = useState<ChecklistItem[]>(STARTER);
  const [title, setTitle] = useState("");
  const [phase, setPhase] = useState(PHASES[0]!);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setRows(JSON.parse(saved));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  }, [rows]);

  const done = rows.filter((row) => row.done).length;
  const pct = rows.length ? Math.round((done / rows.length) * 100) : 0;
  const visiblePhases = useMemo(() => PHASES.filter((p) => rows.some((row) => row.category === p)), [rows]);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Planning tool"
        title="Wedding checklist"
        description="A practical Irish wedding checklist that works straight away and saves in this browser."
      >
        <Breadcrumbs items={[{ label: "Planning Tools", to: "/planning-tools" }, { label: "Checklist" }]} />
      </PageHeader>

      <Section>
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{done} of {rows.length} complete</span>
              <span className="text-muted-foreground">{pct}%</span>
            </div>
            <Progress value={pct} className="mt-3" />
          </div>

          <form
            className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              if (!title.trim()) return;
              setRows((current) => [...current, { id: crypto.randomUUID(), title: title.trim(), category: phase, done: false }]);
              setTitle("");
            }}
          >
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a task" />
            <Select value={phase} onValueChange={setPhase}>
              <SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PHASES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button type="submit"><Plus className="size-4" /> Add</Button>
          </form>

          <div className="mt-8 space-y-8">
            {visiblePhases.map((p) => (
              <div key={p}>
                <h2 className="eyebrow text-primary">{p}</h2>
                <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
                  {rows.filter((row) => row.category === p).map((row) => (
                    <li key={row.id} className="flex items-center gap-3 p-4">
                      <Checkbox checked={row.done} onCheckedChange={(v) => setRows((current) => current.map((item) => item.id === row.id ? { ...item, done: v === true } : item))} />
                      <span className={`flex-1 text-sm ${row.done ? "text-muted-foreground line-through" : ""}`}>{row.title}</span>
                      <button type="button" aria-label={`Delete ${row.title}`} onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Button variant="outline" className="mt-6" onClick={() => setRows(STARTER)}>
            <RotateCcw className="size-4" /> Reset starter checklist
          </Button>
        </div>
      </Section>
    </SiteLayout>
  );
}
