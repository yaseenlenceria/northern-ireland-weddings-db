import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitLead } from "@/lib/leads.functions";
import { COUNTIES, MARKETING_CHALLENGES, WHO_WE_HELP } from "@/lib/site";

type Variant = "audit" | "checklist" | "contact";
type Status = "idle" | "submitting" | "success" | "error";

const labelClass = "text-sm font-medium";
const fieldClass = "mt-1.5";

export function LeadForm({ variant }: { variant: Variant }) {
  const [status, setStatus] = useState<Status>("idle");
  const [category, setCategory] = useState<string>("");
  const [county, setCounty] = useState<string>("");
  const [challenge, setChallenge] = useState<string>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("submitting");
    try {
      const result = await submitLead({
        data: {
          kind: variant,
          name: String(data.get("name") ?? "").trim(),
          email: String(data.get("email") ?? "").trim(),
          businessName: String(data.get("businessName") ?? "").trim() || undefined,
          website: String(data.get("website") ?? "").trim() || undefined,
          category: category || undefined,
          county: county || undefined,
          challenge: challenge || undefined,
          message: String(data.get("message") ?? "").trim() || undefined,
        },
      });
      if (result.ok) {
        setStatus("success");
        form.reset();
        setCategory("");
        setCounty("");
        setChallenge("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center shadow-soft">
        <CheckCircle2 className="mx-auto h-10 w-10 text-gold" />
        <h3 className="mt-4 text-xl font-semibold">
          {variant === "checklist"
            ? "You're on the list"
            : variant === "audit"
              ? "Request received"
              : "Message sent"}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {variant === "checklist"
            ? "Your Wedding Website SEO Checklist is on its way. In the meantime, you can read the full checklist on this page below."
            : variant === "audit"
              ? "Thank you — we'll review your website and email you a summary of the key SEO opportunities we find. Usually within a few working days."
              : "Thank you for reaching out. We'll get back to you shortly."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-6 shadow-soft sm:p-8"
    >
      {variant === "audit" ? (
        <>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Tell us a little about your business and we'll review your website, its Google
            visibility and the opportunities you're missing — free, with no obligation.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="lead-name" className={labelClass}>
                Name
              </Label>
              <Input
                id="lead-name"
                name="name"
                required
                autoComplete="name"
                className={fieldClass}
              />
            </div>
            <div>
              <Label htmlFor="lead-business" className={labelClass}>
                Business name
              </Label>
              <Input
                id="lead-business"
                name="businessName"
                required
                autoComplete="organization"
                className={fieldClass}
              />
            </div>
            <div>
              <Label htmlFor="lead-email" className={labelClass}>
                Business email
              </Label>
              <Input
                id="lead-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={fieldClass}
              />
            </div>
            <div>
              <Label htmlFor="lead-website" className={labelClass}>
                Website URL
              </Label>
              <Input
                id="lead-website"
                name="website"
                type="url"
                placeholder="https://…"
                required
                className={fieldClass}
              />
            </div>
            <div>
              <Label htmlFor="lead-category" className={labelClass}>
                Wedding business category
              </Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="lead-category" className={fieldClass}>
                  <SelectValue placeholder="Select your category" />
                </SelectTrigger>
                <SelectContent>
                  {WHO_WE_HELP.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="lead-county" className={labelClass}>
                County / service area
              </Label>
              <Select value={county} onValueChange={setCounty}>
                <SelectTrigger id="lead-county" className={fieldClass}>
                  <SelectValue placeholder="Select your main area" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTIES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="lead-challenge" className={labelClass}>
                Main marketing challenge
              </Label>
              <Select value={challenge} onValueChange={setChallenge}>
                <SelectTrigger id="lead-challenge" className={fieldClass}>
                  <SelectValue placeholder="What's your biggest challenge right now?" />
                </SelectTrigger>
                <SelectContent>
                  {MARKETING_CHALLENGES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="lead-message" className={labelClass}>
                Anything else? <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Textarea id="lead-message" name="message" rows={4} className={fieldClass} />
            </div>
          </div>
          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="mt-6 w-full"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? <Loader2 className="animate-spin" /> : null}
            Request My Free SEO Audit
          </Button>
        </>
      ) : null}

      {variant === "checklist" ? (
        <>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Enter your details and we'll send you the 21-Point Wedding Website SEO Checklist —
            Ireland Edition.
          </p>
          <div className="mt-5 grid gap-4">
            <div>
              <Label htmlFor="lead-name" className={labelClass}>
                Name
              </Label>
              <Input
                id="lead-name"
                name="name"
                required
                autoComplete="name"
                className={fieldClass}
              />
            </div>
            <div>
              <Label htmlFor="lead-email" className={labelClass}>
                Email
              </Label>
              <Input
                id="lead-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={fieldClass}
              />
            </div>
            <div>
              <Label htmlFor="lead-website" className={labelClass}>
                Website URL <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="lead-website"
                name="website"
                type="url"
                placeholder="https://…"
                className={fieldClass}
              />
            </div>
          </div>
          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="mt-6 w-full"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? <Loader2 className="animate-spin" /> : null}
            Get the Free Checklist
          </Button>
        </>
      ) : null}

      {variant === "contact" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="lead-name" className={labelClass}>
                Name
              </Label>
              <Input
                id="lead-name"
                name="name"
                required
                autoComplete="name"
                className={fieldClass}
              />
            </div>
            <div>
              <Label htmlFor="lead-email" className={labelClass}>
                Email
              </Label>
              <Input
                id="lead-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={fieldClass}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="lead-website" className={labelClass}>
                Website URL <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="lead-website"
                name="website"
                type="url"
                placeholder="https://…"
                className={fieldClass}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="lead-message" className={labelClass}>
                Message
              </Label>
              <Textarea
                id="lead-message"
                name="message"
                rows={5}
                required
                className={fieldClass}
                placeholder="Tell us about your business and what you'd like to improve…"
              />
            </div>
          </div>
          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="mt-6 w-full"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? <Loader2 className="animate-spin" /> : null}
            Send Message
          </Button>
        </>
      ) : null}

      {status === "error" ? (
        <p className="mt-4 text-sm text-destructive">
          Something went wrong sending your message. Please try again, or email us directly.
        </p>
      ) : null}
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        We'll only use your details to reply to your request. No spam, ever.
      </p>
    </form>
  );
}
