import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart, Mail, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SignInPrompt } from "@/components/site/SignInPrompt";
import { ListingImage } from "@/components/site/ListingImage";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { pageMeta, canonical } from "@/lib/seo";

const TITLE = "My Wedding Dashboard | WedList Ireland";
const DESCRIPTION =
  "Your shortlisted wedding suppliers and venues, the enquiries you've sent and quick links to your planning tools.";

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

function DashboardPage() {
  const { user, loading } = useAuth();

  const saved = useQuery({
    queryKey: ["saved-items", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_items")
        .select(
          "id, created_at, suppliers(slug, name, logo_image, county), venues(slug, name, logo_image, county)",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const enquiries = useQuery({
    queryKey: ["my-enquiries", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enquiries")
        .select("id, created_at, message, wedding_date, suppliers(name), venues(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Your account"
        title="My wedding dashboard"
        description="Everything you've shortlisted and every enquiry you've sent, in one place."
      >
        <Breadcrumbs items={[{ label: "Dashboard" }]} />
      </PageHeader>

      <Section>
        {loading ? (
          <Skeleton className="h-40 w-full rounded-xl" />
        ) : !user ? (
          <SignInPrompt tool="wedding dashboard" />
        ) : (
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-10">
              <div>
                <h2 className="flex items-center gap-2 text-2xl">
                  <Heart className="size-5 text-primary" /> Shortlist
                </h2>
                {saved.isLoading ? (
                  <Skeleton className="mt-4 h-32 w-full rounded-xl" />
                ) : (saved.data?.length ?? 0) === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Nothing saved yet.{" "}
                    <Link to="/find-suppliers" className="text-primary underline">
                      Browse suppliers
                    </Link>{" "}
                    and tap Save on any profile.
                  </p>
                ) : (
                  <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                    {saved.data?.map((row) => {
                      const supplier = row.suppliers;
                      const venue = row.venues;
                      const name = supplier?.name ?? venue?.name ?? "Listing";
                      const image = supplier?.logo_image ?? venue?.logo_image ?? null;
                      const county = supplier?.county ?? venue?.county ?? null;
                      return (
                        <li
                          key={row.id}
                          className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                        >
                          <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                            <ListingImage
                              src={image}
                              alt={name}
                              className="size-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {supplier ? (
                                <Link
                                  to="/supplier/$slug"
                                  params={{ slug: supplier.slug }}
                                  className="hover:text-primary"
                                >
                                  {name}
                                </Link>
                              ) : venue ? (
                                <Link
                                  to="/venue/$slug"
                                  params={{ slug: venue.slug }}
                                  className="hover:text-primary"
                                >
                                  {name}
                                </Link>
                              ) : (
                                name
                              )}
                            </p>
                            {county ? (
                              <p className="text-xs text-muted-foreground">Co. {county}</p>
                            ) : null}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div>
                <h2 className="flex items-center gap-2 text-2xl">
                  <Mail className="size-5 text-primary" /> Enquiries sent
                </h2>
                {enquiries.isLoading ? (
                  <Skeleton className="mt-4 h-24 w-full rounded-xl" />
                ) : (enquiries.data?.length ?? 0) === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    You haven't sent any enquiries yet.
                  </p>
                ) : (
                  <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
                    {enquiries.data?.map((row) => (
                      <li key={row.id} className="p-4">
                        <p className="font-medium">
                          {row.suppliers?.name ?? row.venues?.name ?? "Listing"}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {row.message}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Sent {new Date(row.created_at).toLocaleDateString("en-IE")}
                          {row.wedding_date
                            ? ` · wedding ${new Date(row.wedding_date).toLocaleDateString("en-IE")}`
                            : ""}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="font-serif text-lg">Planning tools</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>
                    <Link to="/wedding-checklist" className="text-primary hover:underline">
                      Wedding checklist
                    </Link>
                  </li>
                  <li>
                    <Link to="/budget-calculator" className="text-primary hover:underline">
                      Budget calculator
                    </Link>
                  </li>
                  <li>
                    <Link to="/guest-list" className="text-primary hover:underline">
                      Guest list planner
                    </Link>
                  </li>
                  <li>
                    <Link to="/wedding-timeline" className="text-primary hover:underline">
                      Wedding day timeline
                    </Link>
                  </li>
                </ul>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => void supabase.auth.signOut()}
              >
                <LogOut className="size-4" /> Sign out
              </Button>
            </aside>
          </div>
        )}
      </Section>
    </SiteLayout>
  );
}
