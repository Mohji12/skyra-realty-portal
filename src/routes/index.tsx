import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Building2,
  Home,
  LandPlot,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Sprout,
  Users,
} from "lucide-react";
import { SiteLayout } from "@/components/skyra/SiteLayout";
import { BannerCarousel } from "@/components/skyra/BannerCarousel";
import { PropertyCard } from "@/components/skyra/PropertyCard";
import { SkylineDivider } from "@/components/skyra/Logo";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/useProperties";
import { usePageView } from "@/hooks/usePageView";
import { LOCALITIES } from "@/lib/skyra/constants";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skyra Realty — Premium Bengaluru Property Listings" },
      {
        name: "description",
        content:
          "Browse flats, villas, plots, shops and commercial spaces across Bengaluru with Skyra Realty's curated listings and advanced filters.",
      },
      { property: "og:title", content: "Skyra Realty — Bengaluru Property Listings" },
      {
        property: "og:description",
        content:
          "Curated Bengaluru homes, plots and commercial spaces across 22 localities.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const TYPE_LINKS = [
  { label: "Flats", type: "Flat / Apartment", icon: Building2 },
  { label: "Villas", type: "Villa", icon: Home },
  { label: "Penthouses", type: "Penthouse", icon: Sparkles },
  { label: "Plots", type: "Plot / Land", icon: LandPlot },
  { label: "Commercial", type: "Commercial Building", icon: Building2 },
  { label: "Shops", type: "Shop", icon: Store },
  { label: "PG / Co-living", type: "PG / Co-living Building", icon: Users },
  { label: "Farmhouses", type: "Farm / Farmhouse", icon: Sprout },
];

function Landing() {
  usePageView("Landing page");
  const { properties, ready, loading, error } = useProperties();
  const navigate = useNavigate();
  const [term, setTerm] = useState("");

  const recent = useMemo(
    () =>
      [...properties]
        .sort((a, b) => b.listedDate.localeCompare(a.listedDate))
        .slice(0, 8),
    [properties],
  );

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="hero-navy relative overflow-hidden text-navy-foreground">
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-6 px-4 py-8 sm:py-10 md:grid-cols-2 md:gap-8 md:py-12 lg:gap-10">
          <div className="min-w-0">
            <p className="eyebrow text-gold">Bengaluru · Since 2009</p>
            <h1 className="mt-3 max-w-xl font-display text-[1.85rem] leading-tight font-bold sm:text-3xl md:text-4xl lg:text-[2.75rem]">
              Addresses that hold their <span className="text-gold">value</span>, and
              their character.
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-navy-foreground/70 sm:text-base">
              From Indiranagar apartments to Kanakapura farmland — every Skyra listing is
              verified, detailed and ready to shortlist.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/listings", search: { q: term || undefined } });
              }}
              className="mt-5 flex max-w-xl flex-col gap-2 rounded-2xl border border-gold/30 bg-navy-deep/70 p-2 backdrop-blur sm:flex-row sm:items-center sm:rounded-full sm:pl-4"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2 px-2 sm:px-0">
                <Search className="h-4 w-4 shrink-0 text-gold" />
                <input
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="Whitefield villa, HSR Layout…"
                  aria-label="Search Bengaluru properties"
                  className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-navy-foreground placeholder:text-navy-foreground/45 focus:outline-none"
                />
              </div>
              <Button type="submit" variant="gold" className="w-full rounded-full px-6 sm:w-auto">
                Search
              </Button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              {LOCALITIES.slice(0, 6).map((l) => (
                <Link
                  key={l}
                  to="/listings"
                  search={{ locality: l }}
                  className="inline-flex min-h-9 items-center rounded-full border border-gold/25 px-3.5 py-2 text-xs text-navy-foreground/75 transition-colors hover:border-gold hover:text-gold"
                >
                  {l}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-md overflow-hidden rounded-xl md:max-w-sm lg:max-w-md">
              <img
                src="/hero-bengaluru-skyline.jpeg"
                alt="Bengaluru skyline and residential neighborhood at dusk"
                className="aspect-[16/10] h-auto w-full object-cover object-center sm:aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Banner carousel */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <BannerCarousel properties={properties} />
      </section>

      {/* Browse by type */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <p className="eyebrow text-gold-deep">Browse by category</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-navy">
          What are you looking for?
        </h2>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {TYPE_LINKS.map(({ label, type, icon: Icon }) => (
            <Link
              key={label}
              to="/listings"
              search={{ type }}
              className="group flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-4 sm:p-5 transition-colors hover:border-gold"
            >
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-navy">
                <Icon className="h-5 w-5 text-gold" />
              </span>
              <span className="text-sm font-semibold text-navy group-hover:text-gold-deep">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <SkylineDivider className="mx-auto max-w-7xl px-4" />

      {/* Recently listed */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="eyebrow text-gold-deep">Featured</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-navy sm:text-3xl">
              Recently listed in Bengaluru
            </h2>
          </div>
          <Button asChild variant="goldOutline" className="w-full sm:w-auto">
            <Link to="/listings">View all</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {error ? (
            <p className="col-span-full rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-6 text-sm text-destructive">
              Could not load listings from the API. Start the backend with{" "}
              <code className="font-mono">npm run api:dev</code> and refresh.
            </p>
          ) : loading && !ready ? (
            <p className="col-span-full text-sm text-muted-foreground">
              Loading listings…
            </p>
          ) : recent.length === 0 ? (
            <p className="col-span-full text-sm text-muted-foreground">
              No properties yet. Sign in to Admin and publish a listing.
            </p>
          ) : (
            recent.map((p) => <PropertyCard key={p.id} property={p} />)
          )}
        </div>
      </section>

      {/* Trust */}
      <section className="bg-navy text-navy-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <p className="eyebrow text-gold">Why Skyra Realty</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold md:text-4xl">
            Skyline ambition, grounded advice.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Verified listings",
                body: "Every address, price and floor plan is checked by our Bengaluru team before it goes live.",
              },
              {
                icon: Search,
                title: "Filters that matter",
                body: "Facing, possession status, age, amenities — filter the way buyers actually decide.",
              },
              {
                icon: Users,
                title: "Owner-direct contact",
                body: "Talk to the owner or manager listed on the property. No layers, no runaround.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="border-t border-gold/25 pt-5">
                <Icon className="h-6 w-6 text-gold" />
                <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-navy-foreground/70">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
