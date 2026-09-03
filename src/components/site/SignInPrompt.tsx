import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

/** Shown on planning tools when nobody is signed in. */
export function SignInPrompt({ tool }: { tool: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
      <h2 className="font-serif text-2xl">Sign in to use the {tool}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        A free couple account keeps your planning saved across devices. It takes about twenty
        seconds.
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
