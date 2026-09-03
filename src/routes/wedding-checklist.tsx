import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
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
import { SignInPrompt } from "@/components/site/SignInPrompt";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { canonical, pageMeta } from "@/lib/seo";

const TITLE = "Wedding Checklist for Irish Weddings | Wedora Ireland";
const DESCRIPTION =
  "A free wedding checklist that saves to your account. Work through venue, suppliers, legal notice, styling and day-of tasks in a sensible order.";

const PHASES = [
  "12+ months",
  "9-12 months",
  "6-9 months",
  "3-6 months",
  "1-3 months",
  "Final month",
];

const STARTER: { title: string; category: string }[] = [
  { title: "Agree a total budget and who is contributing", category: "12+ months" },
  { title: "Draft the guest list and agree a headcount", category: "12+ months" },
  { title: "Shortlist and view wedding venues", category: "12+ months" },
  { title: "Book the venue and pay the deposit", category: "12+ months" },
  { title: "Book the photographer", category: "9-12 months" },
  { title: "Book the band and ceremony music", category: "9-12 months" },
  { title: "Book the celebrant or solemniser", category: "9-12 months" },
  { title: "Give notice of intention to marry", category: "9-12 months" },
  { title: "Choose wedding attire and book fittings", category: "6-9 months" },
  { title: "Book the videographer", category: "6-9 months" },
  { title: "Book florist, cake and transport", category: "6-9 months" },
  { title: "Send invitations and set up RSVPs", category: "3-6 months" },
  { title: "Book hair and makeup trials", category: "3-6 months" },
  { title: "Arrange accommodation blocks for guests", category: "3-6 months" },
  { title: "Confirm the running order with all suppliers", category: "1-3 months" },
  { title: "Finalise the seating plan", category: "1-3 months" },
  { title: "Confirm final numbers with the venue", category: "Final month" },
  { title: "Pay outstanding balances", category: "Final month" },
];

export const Route = createFileRoute("/wedding-checklist")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, path: "/wedding-checklist" }),
    links: canonical("/wedding-checklist"),
  }),
  component: ChecklistPage,
});

function ChecklistPage() {
  const { user, loading } = useAuth();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [phase, setPhase] = useState(PHASES[0]!);

  const items = useQuery({
    queryKey: ["checklist", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("checklist_items")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["checklist", user?.id] });

  const addItem = useMutation({
    mutationFn: async (payload: { title: string; category: string }) => {
      const { error } = await supabase.from("checklist_items").insert({
        user_id: user!.id,
        title: payload.title,
        category: payload.category,
        sort_order: PHASES.indexOf(payload.category),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setTitle("");
      invalidate();
    },
    onError: () => toast.error("Couldn't add that task."),
  });

  const toggle = useMutation({
    mutationFn: async (payload: { id: string; done: boolean }) => {
      const { error } = await supabase
        .from("checklist_items")
        .update({ done: payload.done })
        .eq("id", payload.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("checklist_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const seed = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("checklist_items").insert(
        STARTER.map((item, i) => ({
          user_id: user!.id,
          title: item.title,
          category: item.category,
          sort_order: PHASES.indexOf(item.category) * 100 + i,
        })),
      );
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Starter checklist added.");
      invalidate();
    },
    onError: () => toast.error("Couldn't load the starter checklist."),
  });

  const rows = items.data ?? [];
  const done = rows.filter((r) => r.done).length;
  const pct = rows.length ? Math.round((done / rows.length) * 100) : 0;

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Planning tool"
        title="Wedding checklist"
        description="Every task in one list, grouped by how far out it should be handled. Tick as you go — it saves automatically."
      >
        <Breadcrumbs
          items={[{ label: "Planning Tools", to: "/planning-tools" }, { label: "Checklist" }]}
        />
      </PageHeader>

      <Section>
        {loading ? null : !user ? (
          <SignInPrompt tool="wedding checklist" />
        ) : (
          <div className="mx-auto max-w-3xl">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {done} of {rows.length} complete
                </span>
                <span className="text-muted-foreground">{pct}%</span>
              </div>
              <Progress value={pct} className="mt-3" />
            </div>

            {rows.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-border p-8 text-center">
                <p className="text-muted-foreground">
                  Your checklist is empty. Load our Irish wedding starter list, or add your own
                  tasks below.
                </p>
                <Button
                  className="mt-4"
                  onClick={() => seed.mutate()}
                  disabled={seed.isPending}
                >
                  Load the starter checklist
                </Button>
              </div>
            ) : null}

            <form
              className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_auto]"
              onSubmit={(e) => {
                e.preventDefault();
                if (!title.trim()) return;
                addItem.mutate({ title: title.trim(), category: phase });
              }}
            >
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a task"
              />
              <Select value={phase} onValueChange={setPhase}>
                <SelectTrigger className="sm:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PHASES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" disabled={addItem.isPending}>
                <Plus className="size-4" /> Add
              </Button>
            </form>

            <div className="mt-8 space-y-8">
              {PHASES.filter((p) => rows.some((r) => r.category === p)).map((p) => (
                <div key={p}>
                  <h2 className="eyebrow text-primary">{p}</h2>
                  <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
                    {rows
                      .filter((r) => r.category === p)
                      .map((row) => (
                        <li key={row.id} className="flex items-center gap-3 p-4">
                          <Checkbox
                            checked={row.done}
                            onCheckedChange={(v) =>
                              toggle.mutate({ id: row.id, done: v === true })
                            }
                          />
                          <span
                            className={`flex-1 text-sm ${
                              row.done ? "text-muted-foreground line-through" : ""
                            }`}
                          >
                            {row.title}
                          </span>
                          <button
                            type="button"
                            aria-label="Delete task"
                            onClick={() => remove.mutate(row.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}

              {rows.some((r) => !PHASES.includes(r.category)) ? (
                <div>
                  <h2 className="eyebrow text-primary">Other</h2>
                  <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
                    {rows
                      .filter((r) => !PHASES.includes(r.category))
                      .map((row) => (
                        <li key={row.id} className="flex items-center gap-3 p-4">
                          <Checkbox
                            checked={row.done}
                            onCheckedChange={(v) =>
                              toggle.mutate({ id: row.id, done: v === true })
                            }
                          />
                          <span className="flex-1 text-sm">{row.title}</span>
                          <button
                            type="button"
                            aria-label="Delete task"
                            onClick={() => remove.mutate(row.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </Section>
    </SiteLayout>
  );
}
