import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
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
      className={`grid gap-3 rounded-xl border border-border bg-card p-3 shadow-lift ${
        compact ? "sm:grid-cols-[1fr_1fr_auto]" : "sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_auto]"
      }`}
    >
      <div className="text-left">
        <label className="eyebrow px-1 text-muted-foreground">What do you need?</label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="mt-1 w-full border-0 shadow-none focus-visible:ring-0">
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
      </div>

      <div className="text-left">
        <label className="eyebrow px-1 text-muted-foreground">Where in Ireland?</label>
        <Select value={county} onValueChange={setCounty}>
          <SelectTrigger className="mt-1 w-full border-0 shadow-none focus-visible:ring-0">
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
      </div>

      {compact ? null : (
        <div className="text-left">
          <label className="eyebrow px-1 text-muted-foreground" htmlFor="wedding-date">
            Wedding date (optional)
          </label>
          <Input
            id="wedding-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 border-0 shadow-none focus-visible:ring-0"
          />
        </div>
      )}

      <Button type="submit" size="lg" className="h-auto self-end">
        <Search className="size-4" /> Search Suppliers
      </Button>
    </form>
  );
}
