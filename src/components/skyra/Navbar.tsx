import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

const NAV = [
  { label: "Home", to: "/" as const },
  { label: "Listings", to: "/listings" as const },
  { label: "Admin", to: "/admin" as const },
];

export function Navbar() {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    navigate({ to: "/listings", search: { q: term || undefined } });
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gold/15 bg-navy-deep/95 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="min-w-0 shrink" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <form
          onSubmit={submit}
          className="hidden max-w-md flex-1 items-center gap-2 rounded-full border border-gold/25 bg-navy px-4 py-2 md:flex lg:mx-6"
        >
          <Search className="h-4 w-4 shrink-0 text-gold" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search locality, project or address"
            aria-label="Search properties"
            className="min-w-0 flex-1 bg-transparent text-sm text-navy-foreground placeholder:text-navy-foreground/50 focus:outline-none"
            suppressHydrationWarning
          />
          <Button type="submit" variant="gold" size="sm" className="rounded-full px-3">
            Search
          </Button>
        </form>

        <nav className="hidden items-center gap-5 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-gold" }}
              inactiveProps={{ className: "text-navy-foreground/75" }}
              activeOptions={{ exact: item.to === "/" }}
              className="text-sm font-medium transition-colors hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild variant="gold" size="sm">
            <Link to="/admin">List property</Link>
          </Button>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-gold/25 text-gold lg:hidden"
          suppressHydrationWarning
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-gold/15 bg-navy-deep px-4 pb-5 lg:hidden">
          <form
            onSubmit={submit}
            className="my-3 flex items-center gap-2 rounded-full border border-gold/25 bg-navy px-3 py-2 md:hidden"
          >
            <Search className="h-4 w-4 shrink-0 text-gold" />
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search locality or project"
              aria-label="Search properties"
              className="min-w-0 flex-1 bg-transparent text-sm text-navy-foreground placeholder:text-navy-foreground/50 focus:outline-none"
              suppressHydrationWarning
            />
            <Button type="submit" variant="gold" size="sm" className="rounded-full">
              Go
            </Button>
          </form>
          <div className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base text-navy-foreground/85 hover:bg-navy hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
            <Button asChild variant="gold" className="mt-2 w-full">
              <Link to="/admin" onClick={() => setOpen(false)}>
                List property
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
