import { Link } from "@tanstack/react-router";

export function Breadcrumbs({ items }: { items: Array<{ name: string; path?: string }> }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link to="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.name} className="flex items-center gap-1.5">
            <span aria-hidden="true" className="text-border">
              /
            </span>
            {item.path ? (
              <Link to={item.path} className="transition-colors hover:text-foreground">
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-foreground">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
