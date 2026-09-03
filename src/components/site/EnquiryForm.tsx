import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitEnquiry } from "@/lib/enquiries.functions";

type Props = { supplierId?: string; venueId?: string; listingName: string };

/** Public enquiry form. Anyone may submit; owners read their own enquiries. */
export function EnquiryForm({ supplierId, venueId, listingName }: Props) {
  const sendEnquiry = useServerFn(submitEnquiry);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSending(true);

    const guests = form.get("guest_count");
    const weddingDate = String(form.get("wedding_date") ?? "");

    try {
      await sendEnquiry({
        data: {
          supplierId,
          venueId,
          kind: "listing_enquiry",
          listingName,
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          phone: String(form.get("phone") ?? "") || undefined,
          weddingDate: weddingDate || undefined,
          guestCount: guests ? Number(guests) : undefined,
          message: String(form.get("message") ?? ""),
        },
      });
    } catch {
      setSending(false);
      toast.error("We couldn't send that enquiry. Please try again.");
      return;
    }

    setSending(false);
    setSent(true);
    toast.success(`Your enquiry has been sent to ${listingName}.`);
  };

  if (sent) {
    return (
      <div className="rounded-xl border border-primary/30 bg-primary-soft p-6 text-center">
        <h3 className="font-serif text-xl">Enquiry sent</h3>
        <p className="mt-2 text-sm text-accent-foreground">
          {listingName} has your details and will be in touch directly by email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-xl border border-border bg-card p-6">
      <div>
        <h3 className="font-serif text-xl">Enquire with {listingName}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Send your date and details. There is no fee and no obligation.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="name">Your name</Label>
          <Input id="name" name="name" required autoComplete="name" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" name="phone" autoComplete="tel" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="wedding_date">Wedding date</Label>
          <Input id="wedding_date" name="wedding_date" type="date" />
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="guest_count">Approximate guests</Label>
          <Input id="guest_count" name="guest_count" type="number" min={1} max={2000} />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="Tell them about your day, your date and what you're looking for."
        />
      </div>

      <Button type="submit" size="lg" disabled={sending}>
        {sending ? "Sending…" : "Send enquiry"}
      </Button>
    </form>
  );
}
