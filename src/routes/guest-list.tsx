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

const TITLE = "Wedding Guest List Planner | Wedora Ireland";
const DESCRIPTION =
  "Free guest list planner for Irish weddings. Track names, sides, party sizes and RSVPs with a live headcount for your venue and caterer.";

const SIDES = ["Bride", "Groom", "Both", "Other"];
const RSVPS = ["pending", "yes", "no"];

export const Route = createFileRoute("/guest-list")({
  head: () => ({
    meta: pageMeta({
      title: TITLE,
      description: DESCRIPTION,
      path: "/guest-list",
      noindex: true,
    }),
    links: canonical("/guest-list"),
  }),
  component: GuestListPage,
});

function GuestListPage() {
  const { user, loading } = useAuth();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [side, setSide] = useState(SIDES[0]!);
  const [partySize, setPartySize] = useState("1");

  const guests = useQuery({
    queryKey: ["guests", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guest_list")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["guests", user?.id] });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("guest_list").insert({
        user_id: user!.id,
        name: name.trim(),
        side,
        party_size: Math.max(Number(partySize) || 1, 1),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setName("");
      setPartySize("1");
      invalidate();
    },
    onError: () => toast.error("Couldn't add that guest."),
  });

  const setRsvp = useMutation({
    mutationFn: async (payload: { id: string; rsvp: string }) => {
      const { error } = await supabase
        .from("guest_list")
        .update({ rsvp: payload.rsvp })
        .eq("id", payload.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("guest_list").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const rows = guests.data ?? [];
  const invited = rows.reduce((sum, r) => sum + r.party_size, 0);
  const attending = rows
    .filter((r) => r.rsvp === "yes")
    .reduce((sum, r) => sum + r.party_size, 0);
  const awaiting = rows.filter((r) => r.rsvp === "pending").length;

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Planning tool"
        title="Guest list planner"
        description="Build the list, split it by side and keep a running headcount you can hand straight to your venue."
      >
        <Breadcrumbs
          items={[{ label: "Planning Tools", to: "/planning-tools" }, { label: "Guest List" }]}
        />
      </PageHeader>

      <Section>
        {loading ? null : !user ? (
          <SignInPrompt tool="guest list planner" />
        ) : (
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Invited", value: invited },
                { label: "Attending", value: attending },
                { label: "Awaiting reply", value: awaiting },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
                  <p className="eyebrow text-primary">{stat.label}</p>
                  <p className="mt-1 font-serif text-2xl">{stat.value}</p>
                </div>
              ))}
            </div>

            <form
              className="mt-6 grid gap-3 sm:grid-cols-[1.6fr_1fr_auto_auto]"
              onSubmit={(e) => {
                e.preventDefault();
                if (!name.trim()) return;
                add.mutate();
              }}
            >
              <div className="grid gap-1.5">
                <Label htmlFor="guest-name">Guest or household</Label>
                <Input
                  id="guest-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aoife & Cian Murphy"
                />
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
              <Button type="submit" className="self-end" disabled={add.isPending}>
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
                        {row.side} side · {row.party_size} seat{row.party_size > 1 ? "s" : ""}
                      </p>
                    </div>
                    <Select
                      value={row.rsvp}
                      onValueChange={(v) => setRsvp.mutate({ id: row.id, rsvp: v })}
                    >
                      <SelectTrigger className="w-32" aria-label={`RSVP for ${row.name}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RSVPS.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r === "pending" ? "Pending" : r === "yes" ? "Attending" : "Declined"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <button
                      type="button"
                      aria-label={`Remove ${row.name}`}
                      onClick={() => remove.mutate(row.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-8 text-center text-muted-foreground">
                Add your first household above to start the count.
              </p>
            )}
          </div>
        )}
      </Section>
    </SiteLayout>
  );
}
