import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Calculator, CalendarCheck, Heart, LogOut, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ListingImage } from "@/components/site/ListingImage";
import { getShortlistItems, type ShortlistItem } from "@/components/site/SaveButton";
import { neonAuth } from "@/integrations/neon/auth-client";
import { useAuth } from "@/hooks/useAuth";
import { pageMeta, canonical } from "@/lib/seo";

const TITLE = "My Wedding Dashboard | Wedora Ireland";
const DESCRIPTION =
  "Your browser-saved shortlist, quick links to wedding planning tools and account controls.";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: pageMeta({
      title: TITLE,
      description: DESCRIPTION,
      path: "/dashboard",
      noindex: true,
    }),
    links: canonical("/dashboard"),
  }),
  component: DashboardPage,
});

const TOOLS = [
  {
    to: "/wedding-checklist",
    title: "Wedding checklist",
    description: "Track the important booking, paperwork and week-of jobs.",
    icon: CalendarCheck,
  },
  {
    to: "/budget-calculator",
    title: "Budget calculator",
    description: "Plan estimates, paid amounts and remaining spend.",
    icon: Calculator,
  },
  {
    to: "/guest-list",
    title: "Guest list",
    description: "Keep a simple RSVP count for day and evening guests.",
    icon: Users,
  },
] as const;

function DashboardPage() {
  const { user } = useAuth();
  const [shortlist, setShortlist] = useState<ShortlistItem[]>([]);

  useEffect(() => {
    const sync = () => setShortlist(getShortlistItems());
    sync();
    window.addEventListener("wedora-shortlist-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("wedora-shortlist-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const signOut = async () => {
    await neonAuth?.signOut();
    window.location.href = "/";
  };

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Your planner"
        title="My wedding dashboard"
        description={
          user?.email
            ? `Signed in as ${user.email}. Your tools and shortlist are ready.`
            : "Your shortlist and planning tools save in this browser so they work straight away."
        }
      >
        <Breadcrumbs items={[{ label: "Dashboard" }]} />
      </PageHeader>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="flex items-center gap-2 text-2xl">
              <Heart className="size-5 text-primary" /> Shortlist
            </h2>
            {shortlist.length === 0 ? (
              <div className="mt-4 rounded-xl border border-border bg-card p-6">
                <p className="text-sm text-muted-foreground">
                  Nothing saved yet. Browse suppliers and venues, then tap Save on profiles you want
                  to compare.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button asChild>
                    <Link to="/find-suppliers">Browse suppliers</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/venues">Browse venues</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {shortlist.map((item) => (
                  <li
                    key={`${item.type}:${item.id}`}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                  >
                    <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <ListingImage
                        src={item.image}
                        alt={item.name}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {item.type === "venue" ? (
                          <Link
                            to="/venue/$slug"
                            params={{ slug: item.slug }}
                            className="hover:text-primary"
                          >
                            {item.name}
                          </Link>
                        ) : (
                          <Link
                            to="/supplier/$slug"
                            params={{ slug: item.slug }}
                            className="hover:text-primary"
                          >
                            {item.name}
                          </Link>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.type === "venue" ? "Venue" : "Supplier"}
                        {item.county ? ` in Co. ${item.county}` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="space-y-4">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="block rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-primary-soft"
                >
                  <Icon className="size-5 text-primary" />
                  <h2 className="mt-3 font-serif text-lg">{tool.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
                </Link>
              );
            })}

            {user ? (
              <Button variant="outline" className="w-full" onClick={signOut}>
                <LogOut className="size-4" /> Sign out
              </Button>
            ) : (
              <Button asChild variant="outline" className="w-full">
                <Link to="/auth">Sign in or create account</Link>
              </Button>
            )}
          </aside>
        </div>
      </Section>
    </SiteLayout>
  );
}
