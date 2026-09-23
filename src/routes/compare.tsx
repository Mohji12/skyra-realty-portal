import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, GitCompareArrows } from "lucide-react";
import { useMemo } from "react";
import { SiteLayout } from "@/components/skyra/SiteLayout";
import { SkylineDivider } from "@/components/skyra/Logo";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/useProperties";
import { usePageView } from "@/hooks/usePageView";
import {
  amenityDiff,
  buildCompareRows,
  summarizeCompare,
  type CompareWinner,
} from "@/lib/skyra/compare";
import { formatPrice } from "@/lib/skyra/format";
import type { Property } from "@/lib/skyra/types";

interface CompareSearch {
  a?: string | undefined;
  b?: string | undefined;
}

export const Route = createFileRoute("/compare")({
  validateSearch: (search: Record<string, unknown>): CompareSearch => ({
    a: typeof search["a"] === "string" ? (search["a"] as string) : undefined,
    b: typeof search["b"] === "string" ? (search["b"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Compare properties — Skyra Realty" },
      {
        name: "description",
        content:
          "Compare two Bengaluru properties side by side on price, value, size, amenities and more.",
      },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  usePageView("Compare page");
  const { a: idA, b: idB } = Route.useSearch();
  const { properties, ready } = useProperties();

  const propA = idA ? properties.find((p) => p.id === idA) : undefined;
  const propB = idB ? properties.find((p) => p.id === idB) : undefined;

  const incomplete =
    !idA || !idB || idA === idB || (ready && (!propA || !propB));

  if (!ready) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center text-sm text-muted-foreground">
          Loading properties…
        </div>
      </SiteLayout>
    );
  }

  if (incomplete || !propA || !propB) {
    return (
      <SiteLayout>
        <EmptyCompare
          reason={
            idA && idB && idA === idB
              ? "Pick two different properties to compare."
              : "Select two listings from the listings page, then open Compare."
          }
        />
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <CompareView a={propA} b={propB} />
    </SiteLayout>
  );
}

function EmptyCompare({ reason }: { reason: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <SkylineDivider className="mx-auto max-w-md" />
      <GitCompareArrows className="mx-auto mt-6 h-10 w-10 text-gold" />
      <h1 className="mt-4 font-display text-3xl font-bold text-navy">
        Compare two properties
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">{reason}</p>
      <Button asChild variant="gold" className="mt-6">
        <Link to="/listings">Browse listings</Link>
      </Button>
    </div>
  );
}

function CompareView({ a, b }: { a: Property; b: Property }) {
  const rows = useMemo(() => buildCompareRows(a, b), [a, b]);
  const { winsA, winsB, summary } = useMemo(
    () => summarizeCompare(a, b, rows),
    [a, b, rows],
  );
  const amenities = useMemo(() => amenityDiff(a, b), [a, b]);

  return (
    <>
      <section className="border-b border-border bg-navy text-navy-foreground">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 text-sm text-navy-foreground/70 hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" /> Back to listings
          </Link>
          <p className="eyebrow mt-5 text-gold">Side-by-side</p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Which is better to buy?
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-navy-foreground/70">
            Measurable factors only — price, value, size, readiness and amenities.
            Locality preference is personal, so we show it without crowning a winner.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2">
          <PropertyHeader property={a} label="Property A" wins={winsA} />
          <PropertyHeader property={b} label="Property B" wins={winsB} />
        </div>

        <div className="rounded-xl border border-gold/30 bg-gold/10 px-5 py-4">
          <p className="text-xs font-medium tracking-wide text-gold-deep uppercase">
            Buy snapshot
          </p>
          <p className="mt-2 text-sm text-navy">
            <span className="font-semibold">A {winsA}</span>
            {" · "}
            <span className="font-semibold">B {winsB}</span>
            {" measurable wins. "}
            {summary}
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-hidden rounded-xl border border-border md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy text-navy-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Parameter</th>
                <th className="px-4 py-3 font-medium">Property A</th>
                <th className="px-4 py-3 font-medium">Property B</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-navy">{row.label}</td>
                  <td className={cellClass(row.winner, "a")}>
                    <CellValue value={row.valueA} winner={row.winner} side="a" />
                  </td>
                  <td className={cellClass(row.winner, "b")}>
                    <CellValue value={row.valueB} winner={row.winner} side="b" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked rows */}
        <div className="space-y-3 md:hidden">
          {rows.map((row) => (
            <div
              key={row.id}
              className="rounded-xl border border-border bg-card p-4 shadow-elegant"
            >
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {row.label}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className={mobileCellClass(row.winner, "a")}>
                  <p className="text-[10px] text-muted-foreground">A</p>
                  <CellValue value={row.valueA} winner={row.winner} side="a" />
                </div>
                <div className={mobileCellClass(row.winner, "b")}>
                  <p className="text-[10px] text-muted-foreground">B</p>
                  <CellValue value={row.valueB} winner={row.winner} side="b" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="rounded-xl border border-border bg-card p-5 md:p-6">
          <h2 className="font-display text-xl font-bold text-navy">Amenities detail</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            <AmenityColumn title="Shared" items={amenities.shared} tone="shared" />
            <AmenityColumn title="Only in A" items={amenities.onlyA} tone="a" />
            <AmenityColumn title="Only in B" items={amenities.onlyB} tone="b" />
          </div>
        </section>
      </div>
    </>
  );
}

function PropertyHeader({
  property,
  label,
  wins,
}: {
  property: Property;
  label: string;
  wins: number;
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card shadow-elegant">
      <img
        src={property.images[0]}
        alt=""
        className="aspect-16/10 w-full object-cover"
      />
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="eyebrow text-gold-deep">{label}</p>
          <span className="rounded-full bg-navy px-2.5 py-0.5 text-[11px] text-gold">
            {wins} win{wins === 1 ? "" : "s"}
          </span>
        </div>
        <h2 className="font-display text-lg font-semibold text-navy">
          <Link
            to="/property/$id"
            params={{ id: property.id }}
            className="hover:text-gold-deep"
          >
            {property.title}
          </Link>
        </h2>
        <p className="font-display text-xl font-bold text-gold-deep">
          {formatPrice(property.price)}
        </p>
        <p className="text-xs text-muted-foreground">
          {property.type} · {property.locality}
        </p>
      </div>
    </article>
  );
}

function CellValue({
  value,
  winner,
  side,
}: {
  value: string;
  winner: CompareWinner;
  side: "a" | "b";
}) {
  const isWin = winner === side;
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span>{value}</span>
      {isWin && (
        <span className="inline-flex items-center gap-0.5 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold text-gold-deep">
          <Check className="h-3 w-3" /> Better
        </span>
      )}
    </span>
  );
}

function cellClass(winner: CompareWinner, side: "a" | "b") {
  return winner === side
    ? "bg-gold/10 px-4 py-3 text-navy"
    : "px-4 py-3 text-muted-foreground";
}

function mobileCellClass(winner: CompareWinner, side: "a" | "b") {
  return winner === side
    ? "rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-sm text-navy"
    : "rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground";
}

function AmenityColumn({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "shared" | "a" | "b";
}) {
  return (
    <div>
      <p
        className={
          tone === "shared"
            ? "text-xs font-medium text-muted-foreground uppercase"
            : "text-xs font-medium text-gold-deep uppercase"
        }
      >
        {title}
      </p>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">None</p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-navy">
              <Check className="h-3.5 w-3.5 shrink-0 text-gold-deep" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
