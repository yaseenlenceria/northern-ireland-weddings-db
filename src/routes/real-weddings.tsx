import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { VenueCard } from "@/components/site/Cards";
import { listVenues } from "@/lib/directory.functions";
import { pageMeta, canonical } from "@/lib/seo";

const TITLE = "Real Weddings in Ireland — Submit Yours | Shortlist.ie";
const DESCRIPTION =
  "Real Irish weddings, told by the couples who had them. We're building this section now — submit your wedding, or browse the venues couples are booking.";

export const Route = createFileRoute("/real-weddings")({
  loader: () => listVenues({ data: { perPage: 6 } }),
  head: () => ({
    meta: pageMeta({
      title: TITLE,
      description: DESCRIPTION,
      path: "/real-weddings",
      noindex: true,
    }),
    links: canonical("/real-weddings"),
  }),
  component: RealWeddingsPage,
});

function RealWeddingsPage() {
  const { rows } = Route.useLoaderData();

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Real weddings"
        title="Real Irish weddings"
        description="Nothing beats seeing a full day at a venue you're considering — the room dressed, the weather it actually got, the running order that worked."
      >
        <Breadcrumbs items={[{ label: "Real Weddings" }]} />
      </PageHeader>

      <Section>
        <div className="mx-auto max-w-2xl rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Camera className="size-6" />
          </span>
          <h2 className="mt-4 font-serif text-2xl">This section is open for submissions</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We publish real weddings from couples and their photographers only — no stock imagery
            and no invented stories. If you married in Ireland, send us your date, venue, suppliers
            and a gallery link and we'll feature it.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/contact">Submit your wedding</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/$directorySlug" params={{ directorySlug: "wedding-photographers-ireland" }}>
                Browse photographers
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      <Section
        tone="ivory"
        title="Venues couples are shortlisting"
        description="Top-rated venues in the directory, ranked on their published review scores."
        action={
          <Button asChild variant="outline">
            <Link to="/venues">
              <Heart className="size-4" /> All venues
            </Link>
          </Button>
        }
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
