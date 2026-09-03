import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { BrandLink } from "@/components/site/BrandMark";

const NAV = [
  { to: "/find-suppliers", label: "Find Suppliers" },
  { to: "/venues", label: "Venues" },
  { to: "/planning-tools", label: "Planning Tools" },
  { to: "/wedding-guides", label: "Wedding Guides" },
  { to: "/real-weddings", label: "Real Weddings" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-4 sm:px-6">
        <BrandLink onClick={() => setOpen(false)} />

        <nav aria-label="Main" className="hidden flex-1 items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              aria-current={pathname === item.to ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                pathname === item.to ? "font-medium text-primary" : "text-foreground/80"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Button asChild variant="outline" size="sm">
            <Link to="/list-your-business">List Your Business</Link>
          </Button>
          {user ? (
            <Button asChild size="sm">
              <Link to="/dashboard">My Account</Link>
            </Button>
          ) : (
            <Button asChild size="sm">
              <Link to="/auth">
                <LogIn className="size-4" /> Login
              </Link>
            </Button>
          )}
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto inline-flex size-11 items-center justify-center rounded-md border border-border lg:hidden"
        >
          {open ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-border bg-background lg:hidden">
          <nav aria-label="Mobile" className="mx-auto flex w-full max-w-7xl flex-col px-4 py-3 sm:px-6">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                aria-current={pathname === item.to ? "page" : undefined}
                className="rounded-md px-2 py-3 text-base text-foreground/85 hover:bg-accent"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex gap-2">
              <Button asChild variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                <Link to="/list-your-business">List Your Business</Link>
              </Button>
              <Button asChild className="flex-1" onClick={() => setOpen(false)}>
                <Link to={user ? "/dashboard" : "/auth"}>{user ? "My Account" : "Login"}</Link>
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
