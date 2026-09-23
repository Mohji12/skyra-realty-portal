import { NON_RESIDENTIAL } from "./constants";
import { formatArea, formatPrice } from "./format";
import type {
  Furnishing,
  PossessionStatus,
  Property,
  PropertyAge,
} from "./types";

export type CompareWinner = "a" | "b" | "tie" | "none";

export type CompareRow = {
  id: string;
  label: string;
  valueA: string;
  valueB: string;
  winner: CompareWinner;
  /** Used in summary text when this row has a winner */
  winLabel?: string;
};

const FURNISHING_RANK: Record<Furnishing, number> = {
  Unfurnished: 0,
  "Semi-furnished": 1,
  "Fully-furnished": 2,
};

const POSSESSION_RANK: Record<PossessionStatus, number> = {
  "Under construction": 0,
  "Ready to move": 1,
};

const AGE_RANK: Record<PropertyAge, number> = {
  "10+ years": 0,
  "5-10 years": 1,
  "0-5 years": 2,
  New: 3,
};

function pricePerSqftValue(p: Property): number {
  if (!p.areaSqft) return Number.POSITIVE_INFINITY;
  return p.price / p.areaSqft;
}

function showsBedsBaths(a: Property, b: Property): boolean {
  return !(
    NON_RESIDENTIAL.includes(a.type) || NON_RESIDENTIAL.includes(b.type)
  );
}

function numericWinner(
  a: number,
  b: number,
  prefer: "lower" | "higher",
): CompareWinner {
  if (a === b) return "tie";
  if (prefer === "lower") return a < b ? "a" : "b";
  return a > b ? "a" : "b";
}

function rankedWinner(aRank: number, bRank: number): CompareWinner {
  if (aRank === bRank) return "tie";
  return aRank > bRank ? "a" : "b";
}

export function amenityDiff(a: Property, b: Property) {
  const setA = new Set(a.amenities);
  const setB = new Set(b.amenities);
  const shared = a.amenities.filter((x) => setB.has(x));
  const onlyA = a.amenities.filter((x) => !setB.has(x));
  const onlyB = b.amenities.filter((x) => !setA.has(x));
  return { shared, onlyA, onlyB };
}

export function buildCompareRows(a: Property, b: Property): CompareRow[] {
  const rows: CompareRow[] = [
    {
      id: "type",
      label: "Property type",
      valueA: a.type,
      valueB: b.type,
      winner: "none",
    },
    {
      id: "locality",
      label: "Locality",
      valueA: `${a.locality}, Bengaluru`,
      valueB: `${b.locality}, Bengaluru`,
      winner: "none",
    },
    {
      id: "price",
      label: "Price",
      valueA: formatPrice(a.price),
      valueB: formatPrice(b.price),
      winner: numericWinner(a.price, b.price, "lower"),
      winLabel: "price",
    },
    {
      id: "pps",
      label: "Price / sq.ft",
      valueA: formatPricePerSqftRaw(pricePerSqftValue(a)),
      valueB: formatPricePerSqftRaw(pricePerSqftValue(b)),
      winner: numericWinner(pricePerSqftValue(a), pricePerSqftValue(b), "lower"),
      winLabel: "price per sq.ft (value)",
    },
    {
      id: "area",
      label: "Built-up area",
      valueA: formatArea(a.areaSqft),
      valueB: formatArea(b.areaSqft),
      winner: numericWinner(a.areaSqft, b.areaSqft, "higher"),
      winLabel: "size",
    },
  ];

  if (showsBedsBaths(a, b)) {
    rows.push(
      {
        id: "bedrooms",
        label: "Bedrooms",
        valueA: String(a.bedrooms),
        valueB: String(b.bedrooms),
        winner: numericWinner(a.bedrooms, b.bedrooms, "higher"),
        winLabel: "bedrooms",
      },
      {
        id: "bathrooms",
        label: "Bathrooms",
        valueA: String(a.bathrooms),
        valueB: String(b.bathrooms),
        winner: numericWinner(a.bathrooms, b.bathrooms, "higher"),
        winLabel: "bathrooms",
      },
    );
  }

  rows.push(
    {
      id: "furnishing",
      label: "Furnishing",
      valueA: a.furnishing,
      valueB: b.furnishing,
      winner: rankedWinner(
        FURNISHING_RANK[a.furnishing],
        FURNISHING_RANK[b.furnishing],
      ),
      winLabel: "furnishing",
    },
    {
      id: "possession",
      label: "Possession",
      valueA: a.possessionStatus,
      valueB: b.possessionStatus,
      winner: rankedWinner(
        POSSESSION_RANK[a.possessionStatus],
        POSSESSION_RANK[b.possessionStatus],
      ),
      winLabel: "possession readiness",
    },
    {
      id: "age",
      label: "Property age",
      valueA: a.ageOfProperty,
      valueB: b.ageOfProperty,
      winner: rankedWinner(AGE_RANK[a.ageOfProperty], AGE_RANK[b.ageOfProperty]),
      winLabel: "newer age",
    },
    {
      id: "floor",
      label: "Floor",
      valueA: `${a.floorNumber} of ${a.totalFloors}`,
      valueB: `${b.floorNumber} of ${b.totalFloors}`,
      winner: "none",
    },
    {
      id: "facing",
      label: "Facing",
      valueA: a.facing,
      valueB: b.facing,
      winner: "none",
    },
    {
      id: "amenities",
      label: "Amenities",
      valueA: `${a.amenities.length} listed`,
      valueB: `${b.amenities.length} listed`,
      winner: numericWinner(a.amenities.length, b.amenities.length, "higher"),
      winLabel: "amenities",
    },
  );

  return rows;
}

function formatPricePerSqftRaw(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return `₹${Math.round(value).toLocaleString("en-IN")}/sq.ft`;
}

export function summarizeCompare(
  a: Property,
  b: Property,
  rows: CompareRow[],
): { winsA: number; winsB: number; summary: string } {
  const winsA = rows.filter((r) => r.winner === "a").length;
  const winsB = rows.filter((r) => r.winner === "b").length;
  const labelsA = rows
    .filter((r) => r.winner === "a" && r.winLabel)
    .map((r) => r.winLabel!);
  const labelsB = rows
    .filter((r) => r.winner === "b" && r.winLabel)
    .map((r) => r.winLabel!);

  const nameA = shortTitle(a.title);
  const nameB = shortTitle(b.title);

  if (winsA === 0 && winsB === 0) {
    return {
      winsA,
      winsB,
      summary: `${nameA} and ${nameB} are closely matched on measurable buy factors.`,
    };
  }

  const parts: string[] = [];
  if (labelsA.length) {
    parts.push(`${nameA} leads on ${joinLabels(labelsA)}`);
  }
  if (labelsB.length) {
    parts.push(`${nameB} leads on ${joinLabels(labelsB)}`);
  }

  return { winsA, winsB, summary: `${parts.join("; ")}.` };
}

function shortTitle(title: string): string {
  return title.length > 36 ? `${title.slice(0, 36)}…` : title;
}

function joinLabels(labels: string[]): string {
  if (labels.length === 1) return labels[0]!;
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
}
