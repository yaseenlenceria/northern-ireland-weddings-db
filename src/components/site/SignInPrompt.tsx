import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

/** Shown only on future account-only areas. */
export function SignInPrompt({ tool }: { tool: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
      <h2 className="font-serif text-2xl">Sign in for {tool}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Your checklist, budget, guest list and shortlist work free in this browser. Account features
        add cross-device access when enabled.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link to="/auth">Create a free account</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/planning-tools">See all tools</Link>
        </Button>
      </div>
    </div>
  );
}
