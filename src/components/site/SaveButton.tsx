import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";

/** Adds a listing to the signed-in couple's shortlist. */
export function SaveButton({
  supplierId,
  venueId,
}: {
  supplierId?: string;
  venueId?: string;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("saved_items").insert({
      user_id: user.id,
      supplier_id: supplierId ?? null,
      venue_id: venueId ?? null,
    });
    setBusy(false);
    if (error) {
      toast.error("Couldn't save that just now.");
      return;
    }
    setSaved(true);
    toast.success("Added to your shortlist.");
  };

  return (
    <Button size="lg" variant="outline" onClick={save} disabled={busy || saved}>
      <Heart className={`size-4 ${saved ? "fill-primary text-primary" : ""}`} />
      {saved ? "Shortlisted" : "Save"}
    </Button>
  );
}
