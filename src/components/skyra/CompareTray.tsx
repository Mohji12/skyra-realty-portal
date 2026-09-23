import { Link } from "@tanstack/react-router";
import { GitCompareArrows, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompareSelection } from "@/hooks/useCompareSelection";
import { useProperties } from "@/hooks/useProperties";
import { formatPrice } from "@/lib/skyra/format";

export function CompareTray() {
  const { ids, remove, clear } = useCompareSelection();
  const { properties } = useProperties();

  if (ids.length === 0) return null;

  const selected = ids
    .map((id) => properties.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const a = ids[0];
  const b = ids[1];
  const ready = ids.length === 2 && Boolean(a) && Boolean(b);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gold/30 bg-navy-deep/95 pb-[env(safe-area-inset-bottom)] text-navy-foreground shadow-[0_-8px_30px_rgba(11,22,38,0.35)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto">
          <div className="hidden shrink-0 items-center gap-2 text-gold sm:flex">
            <GitCompareArrows className="h-4 w-4" />
            <span className="text-xs font-medium tracking-wide uppercase">
              Compare ({ids.length}/2)
            </span>
          </div>

          {ids.map((id) => {
            const p = selected.find((item) => item.id === id);
            return (
              <div
                key={id}
                className="flex min-w-[12rem] max-w-[16rem] shrink-0 items-center gap-2 rounded-lg border border-gold/25 bg-navy px-2 py-1.5"
              >
                {p?.images[0] ? (
                  <img
                    src={p.images[0]}
                    alt=""
                    className="h-10 w-12 rounded object-cover"
                  />
                ) : (
                  <div className="h-10 w-12 rounded bg-muted" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-navy-foreground">
                    {p?.title ?? "Loading…"}
                  </p>
                  {p && (
                    <p className="truncate text-[11px] text-gold">
                      {formatPrice(p.price)}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Remove from compare"
                  onClick={() => remove(id)}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded text-navy-foreground/70 hover:bg-navy-deep hover:text-gold"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}

          {ids.length === 1 && (
            <p className="shrink-0 text-xs text-navy-foreground/60">
              Select one more property to compare
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-navy-foreground/70 hover:text-gold"
            onClick={clear}
          >
            Clear
          </Button>
          {ready ? (
            <Button asChild variant="gold" size="sm">
              <Link to="/compare" search={{ a: a!, b: b! }}>
                Compare now
              </Link>
            </Button>
          ) : (
            <Button variant="gold" size="sm" disabled>
              Compare now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
