import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Check, TrendingUp, Search, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/site/JsonLd";
import { submitEnquiry } from "@/lib/enquiries.functions";
import { CATEGORIES, IRELAND_COUNTIES, LOCATION_GROUPS, locationCountry } from "@/lib/taxonomy";
import { pageMeta, canonical } from "@/lib/seo";

const TITLE = "List Your Wedding Business on WedHQ";
const DESCRIPTION =
  "Get your wedding business in front of couples across Ireland and the UK. Free listing, your own profile page, location and category pages, and enquiries straight to your inbox.";

const BENEFITS = [
  {
    icon: Search,
    title: "Found where couples search",
    copy: "Your listing appears on category and location pages built for the searches couples actually type, such as “wedding singers Galway” or “wedding venues London”.",
  },
  {
    icon: MessageSquare,
    title: "Enquiries, not clicks",
    copy: "Couples send their date, guest numbers and brief through your profile, so the first email already has what you need to quote.",
  },
  {
    icon: TrendingUp,
    title: "A profile that earns links",
    copy: "Gallery, service areas, price guide, FAQs and reviews — all marked up so search engines can show your rating and details.",
  },
];

const INCLUDED = [
  "Profile page with gallery and full description",
  "Category listing in every location you cover",
  "Enquiry form with your date and budget questions",
  "Verified couple reviews on your profile",
  "Structured data so your details show in search",
  "Free to list and free to receive enquiries",
];

export const Route = createFileRoute("/list-your-business")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, path: "/list-your-business" }),
    links: canonical("/list-your-business"),
  }),
  component: ListBusinessPage,
});

function ListBusinessPage() {
  const sendEnquiry = useServerFn(submitEnquiry);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]!.key);
  const [county, setCounty] = useState<string>(IRELAND_COUNTIES[5]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSending(true);

    const categoryLabel = CATEGORIES.find((c) => c.key === category)?.plural ?? category;
    try {
      await sendEnquiry({
        data: {
          kind: "business_listing_request",
          listingName: String(form.get("business") ?? ""),
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          phone: String(form.get("phone") ?? "") || undefined,
          message: String(form.get("about") ?? ""),
          metadata: {
            business: String(form.get("business") ?? ""),
            category: categoryLabel,
            country: locationCountry(county),
            county,
            website: String(form.get("website") ?? ""),
          },
        },
      });
    } catch {
      setSending(false);
      toast.error("We couldn't send that just now. Please try again.");
      return;
    }

    setSending(false);
    setSubmittedEmail(String(form.get("email") ?? ""));
    setSent(true);
    toast.success("Request received — we'll be in touch about your listing.");
  };

  return (
    <SiteLayout>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: TITLE,
          description: DESCRIPTION,
        }}
      />

      <PageHeader
        eyebrow="For suppliers"
        title="List your wedding business on WedHQ"
        description="Couples plan by location and by category. Get listed where they're already looking, and let them enquire in two minutes."
      >
        <Breadcrumbs items={[{ label: "List Your Business" }]} />
      </PageHeader>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="grid gap-6">
              {BENEFITS.map((b) => (
                <div key={b.title} className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <b.icon className="size-5" />
                  </span>
                  <div>
                    <h2 className="font-serif text-lg">{b.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{b.copy}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-xl border border-border bg-ivory p-6">
              <h2 className="font-serif text-xl">What every listing includes</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                Already listed?{" "}
                <Link to="/contact" className="text-primary underline">
                  Claim your profile
                </Link>{" "}
                and we'll hand over editing rights.
              </p>
            </div>
          </div>

          {sent ? (
            <div className="rounded-xl border border-primary/30 bg-primary-soft p-8 text-center">
              <h2 className="font-serif text-2xl">Request received</h2>
              <p className="mt-2 text-sm text-accent-foreground">
                We'll review your details and email you about setting up the profile.
              </p>
              <Button asChild className="mt-5">
                <Link to="/auth" search={{ mode: "signup", email: submittedEmail || undefined }}>
                  Create business account
                </Link>
              </Button>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="grid gap-4 self-start rounded-xl border border-border bg-card p-6 shadow-soft"
            >
              <div>
                <h2 className="font-serif text-xl">Request a listing</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  No fee, no contract. We list suppliers who work in Ireland or the UK.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="business">Business name</Label>
                  <Input id="business" name="business" required />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="name">Your name</Label>
                  <Input id="name" name="name" required autoComplete="name" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required autoComplete="email" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" autoComplete="tel" />
                </div>
                <div className="grid gap-1.5">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.key} value={c.key}>
                          {c.plural}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label>Base location</Label>
                  <Select value={county} onValueChange={setCounty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {LOCATION_GROUPS.map((group) => (
                        <SelectGroup key={group.label}>
                          <SelectLabel>{group.label}</SelectLabel>
                          {group.locations.map((c) => (
                            <SelectItem key={c} value={c}>
                              {group.country === "Ireland" ? `Co. ${c}` : c}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="website">Website or Instagram</Label>
                <Input id="website" name="website" placeholder="https://" />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="about">Tell couples what you do</Label>
                <Textarea id="about" name="about" rows={4} required />
              </div>

              <Button type="submit" size="lg" disabled={sending}>
                {sending ? "Sending…" : "Request my listing"}
              </Button>
            </form>
          )}
        </div>
      </Section>
    </SiteLayout>
  );
}
