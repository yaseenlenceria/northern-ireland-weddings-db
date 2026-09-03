import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
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
import { SignInPrompt } from "@/components/site/SignInPrompt";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { pageMeta, canonical } from "@/lib/seo";

const TITLE = "Wedding Budget Calculator (Ireland) | WedList Ireland";
const DESCRIPTION =
  "Free wedding budget calculator for Irish couples. Set estimates by category, log what you've paid and see exactly what's left to find.";

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

const STARTER: { label: string; category: string; estimated: number }[] = [
  { label: "Venue and meal", category: "Venue & catering", estimated: 12000 },
  { label: "Drinks reception", category: "Venue & catering", estimated: 1200 },
  { label: "Photographer", category: "Photography", estimated: 2200 },
  { label: "Videographer", category: "Videography", estimated: 1800 },
  { label: "Band", category: "Music & entertainment", estimated: 1600 },
  { label: "DJ / afters", category: "Music & entertainment", estimated: 450 },
  { label: "Ceremony music", category: "Music & entertainment", estimated: 400 },
  { label: "Florals", category: "Flowers & styling", estimated: 1200 },
  { label: "Room styling", category: "Flowers & styling", estimated: 700 },
  { label: "Dress and accessories", category: "Attire & beauty", estimated: 2000 },
  { label: "Suits", category: "Attire & beauty", estimated: 700 },
  { label: "Hair and makeup", category: "Attire & beauty", estimated: 500 },
  { label: "Cake", category: "Cake", estimated: 400 },
  { label: "Cars", category: "Transport", estimated: 500 },
  { label: "Invitations and signage", category: "Stationery", estimated: 450 },
  { label: "Wedding rings", category: "Rings", estimated: 1200 },
];

const euro = (n: number) => `€${n.toLocaleString("en-IE", { maximumFractionDigits: 0 })}`;

export const Route = createFileRoute("/budget-calculator")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, path: "/budget-calculator" }),
    links: canonical("/budget-calculator"),
  }),
  component: BudgetPage,
});

function BudgetPage() {
  const { user, loading } = useAuth();
  const qc = useQueryClient();
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]!);
  const [estimated, setEstimated] = useState("");

  const items = useQuery({
    queryKey: ["budget", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("budget_items")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["budget", user?.id] });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("budget_items").insert({
        user_id: user!.id,
        label: label.trim(),
        category,
        estimated: Number(estimated) || 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setLabel("");
      setEstimated("");
      invalidate();
    },
    onError: () => toast.error("Couldn't add that line."),
  });

  const update = useMutation({
    mutationFn: async (payload: { id: string; actual?: number; estimated?: number }) => {
      const { id, ...rest } = payload;
      const { error } = await supabase.from("budget_items").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("budget_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const seed = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("budget_items")
        .insert(STARTER.map((s) => ({ ...s, user_id: user!.id })));
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Starter budget added.");
      invalidate();
    },
    onError: () => toast.error("Couldn't load the starter budget."),
  });

  const rows = items.data ?? [];
  const totalEstimated = rows.reduce((sum, r) => sum + Number(r.estimated), 0);
  const totalActual = rows.reduce((sum, r) => sum + Number(r.actual), 0);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Planning tool"
        title="Wedding budget calculator"
        description="Set an estimate per line, log payments as they go out and watch the remaining balance update."
      >
        <Breadcrumbs
          items={[
            { label: "Planning Tools", to: "/planning-tools" },
            { label: "Budget Calculator" },
          ]}
        />
      </PageHeader>

      <Section>
        {loading ? null : !user ? (
          <SignInPrompt tool="budget calculator" />
        ) : (
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Estimated total", value: totalEstimated },
                { label: "Paid so far", value: totalActual },
                { label: "Still to pay", value: Math.max(totalEstimated - totalActual, 0) },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
                  <p className="eyebrow text-primary">{stat.label}</p>
                  <p className="mt-1 font-serif text-2xl">{euro(stat.value)}</p>
                </div>
              ))}
            </div>

            {rows.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-border p-8 text-center">
                <p className="text-muted-foreground">
                  Load a typical Irish wedding budget as a starting point, then adjust every line to
                  your own quotes.
                </p>
                <Button className="mt-4" onClick={() => seed.mutate()} disabled={seed.isPending}>
                  Load starter budget
                </Button>
              </div>
            ) : null}

            <form
              className="mt-6 grid gap-3 sm:grid-cols-[1.5fr_1fr_auto_auto]"
              onSubmit={(e) => {
                e.preventDefault();
                if (!label.trim()) return;
                add.mutate();
              }}
            >
              <div className="grid gap-1.5">
                <Label htmlFor="budget-label">Line item</Label>
                <Input
                  id="budget-label"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Photographer"
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="budget-estimate">Estimate €</Label>
                <Input
                  id="budget-estimate"
                  type="number"
                  min={0}
                  value={estimated}
                  onChange={(e) => setEstimated(e.target.value)}
                  className="sm:w-28"
                />
              </div>
              <Button type="submit" className="self-end" disabled={add.isPending}>
                <Plus className="size-4" /> Add
              </Button>
            </form>

            {rows.length ? (
              <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card">
                <table className="w-full text-sm">
                  <caption className="sr-only">Your wedding budget lines</caption>
                  <thead className="bg-ivory text-left">
                    <tr>
                      <th scope="col" className="p-3 font-medium">
                        Item
                      </th>
                      <th scope="col" className="p-3 font-medium">
                        Category
                      </th>
                      <th scope="col" className="p-3 font-medium">
                        Estimate
                      </th>
                      <th scope="col" className="p-3 font-medium">
                        Paid
                      </th>
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
                            defaultValue={row.estimated}
                            onBlur={(e) =>
                              update.mutate({ id: row.id, estimated: Number(e.target.value) || 0 })
                            }
                            className="h-9 w-28"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            aria-label={`Paid for ${row.label}`}
                            type="number"
                            min={0}
                            defaultValue={row.actual}
                            onBlur={(e) =>
                              update.mutate({ id: row.id, actual: Number(e.target.value) || 0 })
                            }
                            className="h-9 w-28"
                          />
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            aria-label={`Delete ${row.label}`}
                            onClick={() => remove.mutate(row.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        )}
      </Section>
    </SiteLayout>
  );
}
