import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { SiteLayout } from "@/components/skyra/SiteLayout";
import { PropertyCard } from "@/components/skyra/PropertyCard";
import { SkylineDivider } from "@/components/skyra/Logo";
import {
  AREA_MAX,
  AREA_MIN,
  FilterPanel,
  PRICE_MAX,
  PRICE_MIN,
  emptyFilters,
  type Filters,
} from "@/components/skyra/FilterPanel";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useProperties } from "@/hooks/useProperties";
import { usePageView } from "@/hooks/usePageView";
import { formatPrice } from "@/lib/skyra/format";
import type { Property } from "@/lib/skyra/types";

interface ListingSearch {
  q?: string | undefined;
  type?: string | undefined;
  locality?: string | undefined;
}

export const Route = createFileRoute("/listings")({
  validateSearch: (search: Record<string, unknown>): ListingSearch => ({
    q: typeof search["q"] === "string" ? (search["q"] as string) : undefined,
    type: typeof search["type"] === "string" ? (search["type"] as string) : undefined,
    locality:
      typeof search["locality"] === "string" ? (search["locality"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Bengaluru Property Listings — Skyra Realty" },
      {
        name: "description",
        content:
          "Filter Bengaluru flats, villas, plots, shops and commercial spaces by budget, area, BHK, facing, possession and amenities.",
      },
      { property: "og:title", content: "Bengaluru Property Listings — Skyra Realty" },
      {
        property: "og:description",
        content: "Advanced filters across 22 Bengaluru localities and 9 property types.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Listings,
});

const PAGE_SIZE = 12;

type SortKey = "newest" | "priceAsc" | "priceDesc" | "areaDesc";

function matchesBedrooms(p: Property, selected: string[]) {
  if (selected.length === 0) return true;
  return selected.some((s) => (s === "5+" ? p.bedrooms >= 5 : p.bedrooms === Number(s)));
}

function matchesBathrooms(p: Property, selected: string[]) {
  if (selected.length === 0) return true;
  return selected.some((s) =>
    s === "4+" ? p.bathrooms >= 4 : p.bathrooms === Number(s),
  );
}

function Listings() {
  usePageView("Listings page");
  const search = Route.useSearch();
  const { properties, ready } = useProperties();

  const [filters, setFilters] = useState<Filters>(() => ({
    ...emptyFilters(),
    q: search.q ?? "",
    types: search.type ? [search.type] : [],
    localities: search.locality ? [search.locality] : [],
  }));
  const [sort, setSort] = useState<SortKey>("newest");
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setFilters({
      ...emptyFilters(),
      q: search.q ?? "",
      types: search.type ? [search.type] : [],
      localities: search.locality ? [search.locality] : [],
    });
    setPage(1);
  }, [search.q, search.type, search.locality]);

  const filtered = useMemo(() => {
    const term = filters.q.trim().toLowerCase();
    const list = properties.filter((p) => {
      if (
        term &&
        !`${p.title} ${p.locality} ${p.address}`.toLowerCase().includes(term)
      )
        return false;
      if (filters.types.length && !filters.types.includes(p.type)) return false;
      if (filters.localities.length && !filters.localities.includes(p.locality))
        return false;
      if (p.price < filters.price[0] || p.price > filters.price[1]) return false;
      if (p.areaSqft < filters.area[0] || p.areaSqft > filters.area[1]) return false;
      if (!matchesBedrooms(p, filters.bedrooms)) return false;
      if (!matchesBathrooms(p, filters.bathrooms)) return false;
      if (filters.furnishing.length && !filters.furnishing.includes(p.furnishing))
        return false;
      if (filters.possession.length && !filters.possession.includes(p.possessionStatus))
        return false;
      if (filters.ages.length && !filters.ages.includes(p.ageOfProperty)) return false;
      if (filters.facings.length && !filters.facings.includes(p.facing)) return false;
      if (
        filters.amenities.length &&
        !filters.amenities.every((a) => p.amenities.includes(a))
      )
        return false;
      return true;
    });

    return list.sort((a, b) => {
      if (sort === "priceAsc") return a.price - b.price;
      if (sort === "priceDesc") return b.price - a.price;
      if (sort === "areaDesc") return b.areaSqft - a.areaSqft;
      return b.listedDate.localeCompare(a.listedDate);
    });
  }, [properties, filters, sort]);

  const visible = filtered.slice(0, page * PAGE_SIZE);

  const chips: { label: string; clear: () => void }[] = [];
  const addChips = (values: string[], key: keyof Filters, prefix = "") =>
    values.forEach((v) =>
      chips.push({
        label: `${prefix}${v}`,
        clear: () =>
          setFilters({
            ...filters,
            [key]: (filters[key] as string[]).filter((x) => x !== v),
          } as Filters),
      }),
    );
  if (filters.q)
    chips.push({ label: `“${filters.q}”`, clear: () => setFilters({ ...filters, q: "" }) });
  addChips(filters.types, "types");
  addChips(filters.localities, "localities");
  if (filters.price[0] > PRICE_MIN || filters.price[1] < PRICE_MAX) {
    chips.push({
      label: `${formatPrice(filters.price[0])} – ${formatPrice(filters.price[1])}`,
      clear: () => setFilters({ ...filters, price: [PRICE_MIN, PRICE_MAX] }),
    });
  }
  if (filters.area[0] > AREA_MIN || filters.area[1] < AREA_MAX) {
    chips.push({
      label: `${filters.area[0].toLocaleString("en-IN")}–${filters.area[1].toLocaleString("en-IN")} sq.ft`,
      clear: () => setFilters({ ...filters, area: [AREA_MIN, AREA_MAX] }),
    });
  }
  addChips(filters.bedrooms, "bedrooms", "BHK ");
  addChips(filters.bathrooms, "bathrooms", "Baths ");
  addChips(filters.furnishing, "furnishing");
  addChips(filters.possession, "possession");
  addChips(filters.ages, "ages");
  addChips(filters.facings, "facings");
  addChips(filters.amenities, "amenities");

  const applyFilters = (next: Filters) => {
    setFilters(next);
    setPage(1);
  };

  return (
    <SiteLayout>
      <div className="bg-navy text-navy-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <p className="eyebrow text-gold">Bengaluru</p>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">
            All properties
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-navy-foreground/70">
            Filter flats, villas, plots and commercial spaces across 22 localities —
            every listing verified and ready to shortlist.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-8 lg:py-10">
        <div className="hidden lg:block">
          <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6.5rem)] lg:overflow-y-auto lg:pr-1">
            <FilterPanel
              filters={filters}
              setFilters={applyFilters}
              onClear={() => applyFilters(emptyFilters())}
            />
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-w-0 text-sm text-muted-foreground">
              {ready ? (
                <>
                  <span className="font-semibold text-navy">{filtered.length}</span>{" "}
                  properties match
                </>
              ) : (
                "Loading properties…"
              )}
            </p>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <Button
                variant="goldOutline"
                className="w-full lg:hidden"
                onClick={() => setShowMobileFilters(true)}
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
                {chips.length > 0 && (
                  <span className="ml-1 rounded-full bg-gold px-1.5 text-[10px] font-bold text-gold-foreground">
                    {chips.length}
                  </span>
                )}
              </Button>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="priceAsc">Price: low to high</SelectItem>
                  <SelectItem value="priceDesc">Price: high to low</SelectItem>
                  <SelectItem value="areaDesc">Largest area</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {chips.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {chips.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => {
                    c.clear();
                    setPage(1);
                  }}
                  className="flex items-center gap-1.5 rounded-full border border-gold bg-navy px-3 py-1.5 text-xs text-gold hover:bg-navy-deep"
                >
                  {c.label} <X className="h-3 w-3" />
                </button>
              ))}
              <button
                type="button"
                onClick={() => applyFilters(emptyFilters())}
                className="rounded-full px-3 py-1.5 text-xs font-medium text-gold-deep hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

          <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
            <SheetContent
              side="left"
              className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-md"
            >
              <SheetHeader className="shrink-0 border-b border-border px-5 py-4 text-left">
                <SheetTitle className="font-display text-navy">Filters</SheetTitle>
              </SheetHeader>
              <div className="min-h-0 flex-1 overflow-y-auto p-4 pb-28">
                <FilterPanel
                  filters={filters}
                  setFilters={applyFilters}
                  onClear={() => applyFilters(emptyFilters())}
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 border-t border-border bg-background p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <Button
                  variant="gold"
                  className="w-full"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Show {filtered.length} properties
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {filtered.length === 0 && ready ? (
            <div className="mt-10 rounded-xl border border-border bg-card p-6 text-center sm:p-10">
              <SkylineDivider className="mx-auto max-w-sm" />
              <h2 className="mt-4 font-display text-xl font-semibold text-navy sm:text-2xl">
                No properties match these filters
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Try widening your budget or removing a locality.
              </p>
              <Button
                variant="gold"
                className="mt-6"
                onClick={() => applyFilters(emptyFilters())}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
              {visible.length < filtered.length && (
                <div className="mt-10 text-center">
                  <Button variant="navy" className="w-full sm:w-auto" onClick={() => setPage((p) => p + 1)}>
                    Load more properties
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
