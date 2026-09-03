import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, MapPin, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, COUNTIES, VENUE_SLUG, countySlug } from "@/lib/taxonomy";

function Field({
  icon,
  label,
  htmlFor,
  children,
  className = "",
}: {
  icon: ReactNode;
  label: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group relative flex items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-secondary/50 ${className}`}
    >
      <span className="mt-1.5 text-primary/70 transition-colors group-hover:text-primary">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <label
          htmlFor={htmlFor}
          className="eyebrow block text-[0.65rem] tracking-[0.14em] text-muted-foreground"
        >
          {label}
        </label>
        {children}
      </div>
    </div>
  );
}

const CONTROL =
  "mt-0.5 h-8 w-full border-0 bg-transparent px-0 text-base font-medium text-foreground shadow-none focus-visible:ring-0 focus:ring-0 [&>span]:truncate";

/** Hero search: category + county + optional date, routes to a landing page. */
export function SearchBar({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const [category, setCategory] = useState(VENUE_SLUG);
  const [county, setCounty] = useState("ireland");
  const [date, setDate] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/$directorySlug",
      params: { directorySlug: `${category}-${county}` },
      search: date ? { date } : {},
    });
  };

  return (
    <form
      onSubmit={submit}
      className={`grid gap-1 rounded-2xl border border-border/70 bg-card/95 p-2 shadow-lift ring-1 ring-gold/10 backdrop-blur-sm sm:gap-0 ${
        compact
          ? "sm:grid-cols-[1fr_1fr_auto] sm:divide-x sm:divide-border/70"
          : "sm:grid-cols-2 lg:grid-cols-[1.15fr_1fr_0.95fr_auto] lg:divide-x lg:divide-border/70"
      }`}
    >
      <Field icon={<Sparkles className="size-4" />} label="What do you need?">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className={CONTROL}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            <SelectItem value={VENUE_SLUG}>Wedding Venues</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {c.plural}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field icon={<MapPin className="size-4" />} label="Where in Ireland?">
        <Select value={county} onValueChange={setCounty}>
          <SelectTrigger className={CONTROL}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            <SelectItem value="ireland">Anywhere in Ireland</SelectItem>
            {COUNTIES.map((c) => (
              <SelectItem key={c} value={countySlug(c)}>
                Co. {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {compact ? null : (
        <Field
          icon={<CalendarDays className="size-4" />}
          label="Wedding date"
          htmlFor="wedding-date"
        >
          <Input
            id="wedding-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={CONTROL}
          />
        </Field>
      )}

      <div className="flex items-center p-1 sm:pl-2">
        <Button
          type="submit"
          size="lg"
          className="h-12 w-full rounded-xl px-6 text-sm tracking-wide shadow-soft transition-transform hover:-translate-y-0.5"
        >
          <Search className="size-4" /> Search
        </Button>
      </div>
    </form>
  );
}

