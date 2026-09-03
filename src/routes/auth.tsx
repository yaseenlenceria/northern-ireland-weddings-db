import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteLayout, Section } from "@/components/site/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { pageMeta, canonical } from "@/lib/seo";

const TITLE = "Sign In or Create a Free Account | WedList Ireland";
const DESCRIPTION =
  "Create a free WedList Ireland account to shortlist suppliers, send enquiries and save your wedding checklist, budget and guest list.";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: pageMeta({
      title: TITLE,
      description: DESCRIPTION,
      path: "/auth",
      noindex: true,
    }),
    links: canonical("/auth"),
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) void navigate({ to: "/dashboard" });
  }, [loading, user, navigate]);

  const signIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    void navigate({ to: "/dashboard" });
  };

  const signUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: String(form.get("full_name") ?? "") },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Check your email to confirm your account.");
  };

  const google = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) toast.error(error.message);
  };

  return (
    <SiteLayout>
      <Section>
        <div className="mx-auto max-w-md">
          <h1 className="text-center text-3xl">Your WedList account</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Free for couples. Shortlist suppliers, track enquiries and keep your planning tools in
            one place.
          </p>

          <div className="mt-8 rounded-xl border border-border bg-card p-6">
            <Button variant="outline" className="w-full" onClick={google}>
              Continue with Google
            </Button>

            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or use email
              <span className="h-px flex-1 bg-border" />
            </div>

            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Create account</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={signIn} className="grid gap-4 pt-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="in-email">Email</Label>
                    <Input id="in-email" name="email" type="email" required autoComplete="email" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="in-password">Password</Label>
                    <Input
                      id="in-password"
                      name="password"
                      type="password"
                      required
                      autoComplete="current-password"
                    />
                  </div>
                  <Button type="submit" disabled={busy}>
                    {busy ? "Signing in…" : "Sign in"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={signUp} className="grid gap-4 pt-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="up-name">Your name</Label>
                    <Input id="up-name" name="full_name" autoComplete="name" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="up-email">Email</Label>
                    <Input id="up-email" name="email" type="email" required autoComplete="email" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="up-password">Password</Label>
                    <Input
                      id="up-password"
                      name="password"
                      type="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                  </div>
                  <Button type="submit" disabled={busy}>
                    {busy ? "Creating account…" : "Create free account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
