import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import {
  AMENITIES,
  FACINGS,
  FURNISHINGS,
  LOCALITIES,
  POSSESSION_STATUSES,
  PROPERTY_AGES,
  PROPERTY_TYPES,
} from "@/lib/skyra/constants";
import { formatPrice } from "@/lib/skyra/format";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

export interface Filters {
  q: string;
  types: string[];
  localities: string[];
  price: [number, number];
  area: [number, number];
  bedrooms: string[];
  bathrooms: string[];
  furnishing: string[];
  possession: string[];
  ages: string[];
  facings: string[];
  amenities: string[];
}

export const PRICE_MIN = 0;
export const PRICE_MAX = 250000000;
export const AREA_MIN = 0;
export const AREA_MAX = 45000;

export const emptyFilters = (): Filters => ({
  q: "",
  types: [],
  localities: [],
  price: [PRICE_MIN, PRICE_MAX],
  area: [AREA_MIN, AREA_MAX],
  bedrooms: [],
  bathrooms: [],
  furnishing: [],
  possession: [],
  ages: [],
  facings: [],
  amenities: [],
});

export const BHK_OPTIONS = ["1", "2", "3", "4", "5+"];
export const BATH_OPTIONS = ["1", "2", "3", "4+"];

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-border pb-5">
      <h3 className="eyebrow mb-3 text-navy">{title}</h3>
      {children}
    </section>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center gap-2.5 py-1.5 text-sm text-foreground">
      <Checkbox
        checked={checked}
        onCheckedChange={onChange}
        className="size-5 data-[state=checked]:border-gold data-[state=checked]:bg-gold data-[state=checked]:text-gold-foreground"
      />
      <span className="min-w-0 whitespace-normal">{label}</span>
    </label>
  );
}

function Pills({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = selected.includes(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            className={
              active
                ? "inline-flex min-h-10 items-center rounded-full bg-gold px-3.5 py-2 text-xs font-semibold text-gold-foreground"
                : "inline-flex min-h-10 items-center rounded-full border border-border px-3.5 py-2 text-xs text-muted-foreground hover:border-gold hover:text-navy"
            }
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

export function FilterPanel({
  filters,
  setFilters,
  onClear,
}: {
  filters: Filters;
  setFilters: (next: Filters) => void;
  onClear: () => void;
}) {
  const patch = (p: Partial<Filters>) => setFilters({ ...filters, ...p });
  const [localityQuery, setLocalityQuery] = useState("");

  const localities = useMemo(() => {
    const q = localityQuery.trim().toLowerCase();
    if (!q) return LOCALITIES;
    return LOCALITIES.filter((l) => l.toLowerCase().includes(q));
  }, [localityQuery]);

  return (
    <aside className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-elegant">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold text-navy">Filters</h2>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-gold-deep">
          <X className="h-3.5 w-3.5" /> Clear
        </Button>
      </div>

      <Group title="Keyword">
        <Input
          value={filters.q}
          onChange={(e) => patch({ q: e.target.value })}
          placeholder="Title, locality or address"
        />
      </Group>

      <Group title="Property type">
        <div className="max-h-52 overflow-y-auto pr-1">
          {PROPERTY_TYPES.map((t) => (
            <CheckRow
              key={t}
              label={t}
              checked={filters.types.includes(t)}
              onChange={() => patch({ types: toggle(filters.types, t) })}
            />
          ))}
        </div>
      </Group>

      <Group title="Locality">
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={localityQuery}
            onChange={(e) => setLocalityQuery(e.target.value)}
            placeholder="Search Bengaluru localities"
            className="pl-9"
          />
        </div>
        <div className="max-h-52 overflow-y-auto pr-1">
          {localities.map((l) => (
            <CheckRow
              key={l}
              label={l}
              checked={filters.localities.includes(l)}
              onChange={() => patch({ localities: toggle(filters.localities, l) })}
            />
          ))}
          {localities.length === 0 && (
            <p className="py-2 text-xs text-muted-foreground">No localities match.</p>
          )}
        </div>
      </Group>

      <Group title="Budget">
        <Slider
          value={filters.price}
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={500000}
          onValueChange={(v) => patch({ price: [v[0] ?? 0, v[1] ?? PRICE_MAX] })}
          className="[&_[role=slider]]:border-gold-deep [&_[role=slider]]:bg-gold [&_[data-orientation=horizontal]>span]:bg-gold"
        />
        <p className="mt-3 text-xs text-muted-foreground">
          {formatPrice(filters.price[0])} — {formatPrice(filters.price[1])}
        </p>
      </Group>

      <Group title="Area (sq.ft)">
        <Slider
          value={filters.area}
          min={AREA_MIN}
          max={AREA_MAX}
          step={100}
          onValueChange={(v) => patch({ area: [v[0] ?? 0, v[1] ?? AREA_MAX] })}
          className="[&_[role=slider]]:border-gold-deep [&_[role=slider]]:bg-gold [&_[data-orientation=horizontal]>span]:bg-gold"
        />
        <p className="mt-3 text-xs text-muted-foreground">
          {filters.area[0].toLocaleString("en-IN")} —{" "}
          {filters.area[1].toLocaleString("en-IN")} sq.ft
        </p>
      </Group>

      <Group title="Bedrooms">
        <Pills
          options={BHK_OPTIONS}
          selected={filters.bedrooms}
          onToggle={(v) => patch({ bedrooms: toggle(filters.bedrooms, v) })}
        />
      </Group>

      <Group title="Bathrooms">
        <Pills
          options={BATH_OPTIONS}
          selected={filters.bathrooms}
          onToggle={(v) => patch({ bathrooms: toggle(filters.bathrooms, v) })}
        />
      </Group>

      <Group title="Furnishing">
        {FURNISHINGS.map((f) => (
          <CheckRow
            key={f}
            label={f}
            checked={filters.furnishing.includes(f)}
            onChange={() => patch({ furnishing: toggle(filters.furnishing, f) })}
          />
        ))}
      </Group>

      <Group title="Possession">
        {POSSESSION_STATUSES.map((p) => (
          <CheckRow
            key={p}
            label={p}
            checked={filters.possession.includes(p)}
            onChange={() => patch({ possession: toggle(filters.possession, p) })}
          />
        ))}
      </Group>

      <Group title="Age of property">
        <Pills
          options={PROPERTY_AGES}
          selected={filters.ages}
          onToggle={(v) => patch({ ages: toggle(filters.ages, v) })}
        />
      </Group>

      <Group title="Facing">
        <Pills
          options={FACINGS}
          selected={filters.facings}
          onToggle={(v) => patch({ facings: toggle(filters.facings, v) })}
        />
      </Group>

      <section>
        <h3 className="eyebrow mb-3 text-navy">Amenities</h3>
        <div className="max-h-56 overflow-y-auto pr-1">
          {AMENITIES.map((a) => (
            <CheckRow
              key={a}
              label={a}
              checked={filters.amenities.includes(a)}
              onChange={() => patch({ amenities: toggle(filters.amenities, a) })}
            />
          ))}
        </div>
      </section>
    </aside>
  );
}
