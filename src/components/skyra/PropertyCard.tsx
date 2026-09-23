import { Link } from "@tanstack/react-router";
import { Bath, BedDouble, Compass, Eye, GitCompareArrows, MapPin, Ruler } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCompareSelection, MAX_COMPARE } from "@/hooks/useCompareSelection";
import { formatArea, formatPrice, pricePerSqft } from "@/lib/skyra/format";
import type { Property } from "@/lib/skyra/types";

export function PropertyCard({ property }: { property: Property }) {
  const { isSelected, toggle } = useCompareSelection();
  const selected = isSelected(property.id);
  const [notice, setNotice] = useState<string | null>(null);

  function onCompareClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const result = toggle(property.id);
    if (result.rejected) {
      setNotice(`You can compare only ${MAX_COMPARE} properties. Remove one first.`);
      window.setTimeout(() => setNotice(null), 2800);
    } else {
      setNotice(null);
    }
  }

  return (
    <div className="relative">
      <Link
        to="/property/$id"
        params={{ id: property.id }}
        className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-elegant transition-transform hover:-translate-y-1"
      >
        <div className="relative aspect-4/3 overflow-hidden bg-muted">
          <img
            src={property.images[0]}
            alt={property.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 max-w-[70%] truncate rounded-full bg-navy-deep/90 px-3 py-1 text-[11px] font-medium text-gold">
            {property.type}
          </span>
          <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-navy-deep/85 px-2.5 py-1 text-[11px] text-navy-foreground/85">
            <Eye className="h-3 w-3 text-gold" /> {property.viewCount}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="font-display text-xl font-semibold text-gold-deep">
              {formatPrice(property.price)}
            </p>
            <p className="shrink-0 pt-1 text-xs text-muted-foreground">
              {pricePerSqft(property.price, property.areaSqft)}
            </p>
          </div>

          <h3 className="line-clamp-2 text-base font-semibold text-foreground">
            {property.title}
          </h3>

          <p className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-gold-deep" />
            <span className="truncate">{property.locality}, Bengaluru</span>
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-3 text-xs text-muted-foreground">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <BedDouble className="h-3.5 w-3.5 text-gold-deep" /> {property.bedrooms} BHK
              </span>
            )}
            {property.bathrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bath className="h-3.5 w-3.5 text-gold-deep" /> {property.bathrooms}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Ruler className="h-3.5 w-3.5 text-gold-deep" /> {formatArea(property.areaSqft)}
            </span>
            <span className="flex items-center gap-1">
              <Compass className="h-3.5 w-3.5 text-gold-deep" /> {property.facing}
            </span>
          </div>
        </div>
      </Link>

      <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1">
        <Button
          type="button"
          size="sm"
          variant={selected ? "gold" : "secondary"}
          className="h-8 rounded-full px-2.5 text-[11px] shadow-md"
          onClick={onCompareClick}
        >
          <GitCompareArrows className="h-3.5 w-3.5" />
          {selected ? "Selected" : "Compare"}
        </Button>
        {notice && (
          <span className="max-w-[10rem] rounded bg-navy-deep/95 px-2 py-1 text-[10px] text-gold">
            {notice}
          </span>
        )}
      </div>
    </div>
  );
}
