import {
  AMENITIES,
  FACINGS,
  FURNISHINGS,
  LOCALITIES,
  NON_RESIDENTIAL,
  POSSESSION_STATUSES,
  PROPERTY_AGES,
  PROPERTY_TYPES,
} from "./constants";
import type { Property, PropertyType } from "./types";

/**
 * Deterministic pseudo-random generator so the seed dataset is identical
 * on every browser and across server render / hydration.
 */
function makeRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const rand = makeRandom(20260913);
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)] as T;
const between = (min: number, max: number) => Math.floor(min + rand() * (max - min + 1));

const PROJECT_NAMES = [
  "Skyline Crest",
  "Emerald Court",
  "Palm Meadows",
  "Brigade Nest",
  "Aster Grove",
  "Lakeview Enclave",
  "Sunridge Terraces",
  "Whispering Oaks",
  "Ivory Heights",
  "Sanctum Residences",
  "Northwood Villas",
  "Amber Square",
  "Casa Bella",
  "Prestige Vantage",
  "Silver Fern",
  "Orchid Landing",
  "Banyan Row",
  "Vista Verde",
];

/** Broad per-sqft price bands (INR) used to keep seed prices plausible. */
const RATE: Record<PropertyType, [number, number]> = {
  "Flat / Apartment": [6500, 13000],
  Villa: [9000, 17000],
  Penthouse: [12000, 22000],
  "Independent House": [7000, 13000],
  "Commercial Building": [11000, 20000],
  Shop: [12000, 24000],
  "PG / Co-living Building": [6000, 11000],
  "Farm / Farmhouse": [1800, 4200],
  "Plot / Land": [4500, 11000],
};

const AREA: Record<PropertyType, [number, number]> = {
  "Flat / Apartment": [620, 2100],
  Villa: [1800, 4200],
  Penthouse: [2400, 5200],
  "Independent House": [1200, 3200],
  "Commercial Building": [2500, 12000],
  Shop: [320, 1400],
  "PG / Co-living Building": [1800, 5000],
  "Farm / Farmhouse": [8000, 43000],
  "Plot / Land": [1200, 9600],
};

const OWNERS = [
  ["Ananya Rao", "+91 98450 21134"],
  ["Vikram Shetty", "+91 99860 44217"],
  ["Meera Krishnan", "+91 90080 71265"],
  ["Rahul Deshpande", "+91 98807 33902"],
  ["Farhan Ahmed", "+91 97418 55620"],
  ["Divya Nagaraj", "+91 88840 19073"],
  ["Sandeep Reddy", "+91 95388 60411"],
  ["Kavya Iyer", "+91 96865 22748"],
];

function describe(p: Omit<Property, "description">) {
  const base = `${p.title} in ${p.locality}, Bengaluru. Spread across ${p.areaSqft.toLocaleString("en-IN")} sq.ft, this ${p.type.toLowerCase()} is ${p.possessionStatus.toLowerCase()} and ${p.furnishing.toLowerCase()}, facing ${p.facing}.`;
  const extra = p.bedrooms
    ? ` It offers ${p.bedrooms} bedrooms and ${p.bathrooms} bathrooms with ${p.amenities.slice(0, 3).join(", ").toLowerCase()} on site.`
    : ` Well suited for investors and businesses, with ${p.amenities.slice(0, 3).join(", ").toLowerCase()} available.`;
  return (
    base +
    extra +
    ` The neighbourhood is well connected to major tech corridors, schools and hospitals, making it a dependable long-term address.`
  );
}

function buildProperty(i: number): Property {
  const type = PROPERTY_TYPES[i % PROPERTY_TYPES.length] as PropertyType;
  const locality = LOCALITIES[(i * 5 + 3) % LOCALITIES.length] as string;
  const areaSqft = between(AREA[type][0], AREA[type][1]);
  const rate = between(RATE[type][0], RATE[type][1]);
  const price = Math.round((areaSqft * rate) / 50000) * 50000;
  const residential = !NON_RESIDENTIAL.includes(type);
  const bedrooms = residential
    ? type === "Penthouse"
      ? between(3, 5)
      : type === "Villa"
        ? between(3, 5)
        : type === "PG / Co-living Building"
          ? between(6, 14)
          : between(1, 4)
    : 0;
  const bathrooms = residential ? Math.max(1, Math.min(bedrooms, between(1, 4))) : between(1, 3);
  const totalFloors = type === "Plot / Land" ? 0 : between(1, 18);
  const amenityCount = between(3, 7);
  const amenities = AMENITIES.filter((_, idx) => (idx * 7 + i * 3) % 11 < amenityCount).slice(0, amenityCount);
  const owner = OWNERS[i % OWNERS.length] as [string, string];
  const day = 1 + ((i * 11) % 27);
  const month = 1 + ((i * 5) % 9);
  const label =
    type === "Flat / Apartment"
      ? `${bedrooms} BHK Apartment at ${pick(PROJECT_NAMES)}`
      : type === "Plot / Land"
        ? `${areaSqft} sq.ft Residential Plot`
        : type === "Shop"
          ? `Retail Shop on Main Road`
          : type === "Commercial Building"
            ? `Commercial Building with Office Floors`
            : type === "PG / Co-living Building"
              ? `Running Co-living Building, ${bedrooms} Rooms`
              : type === "Farm / Farmhouse"
                ? `Farmhouse with Landscaped Grounds`
                : `${bedrooms} BHK ${type.replace(" / Apartment", "")} — ${pick(PROJECT_NAMES)}`;

  const partial = {
    id: `SKY-${String(1000 + i)}`,
    title: label,
    type,
    locality,
    address: `${between(1, 180)}, ${pick(["1st", "2nd", "3rd", "5th", "7th", "9th"])} Cross, ${locality}, Bengaluru ${560001 + ((i * 7) % 99)}`,
    price,
    areaSqft,
    bedrooms,
    bathrooms,
    furnishing: type === "Plot / Land" ? "Unfurnished" : pick(FURNISHINGS),
    possessionStatus: pick(POSSESSION_STATUSES),
    ageOfProperty: pick(PROPERTY_AGES),
    facing: pick(FACINGS),
    floorNumber: totalFloors ? between(0, totalFloors) : 0,
    totalFloors,
    amenities: amenities.length ? amenities : ["Parking", "Security"],
    images: [0, 1, 2, 3].map(
      (n) => `https://picsum.photos/seed/skyra-${i}-${n}/1200/800`,
    ),
    listedDate: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    ownerContactName: owner[0],
    ownerContactPhone: owner[1],
    viewCount: 0,
  } satisfies Omit<Property, "description">;

  return { ...partial, description: describe(partial) };
}

export const SEED_PROPERTIES: Property[] = Array.from({ length: 54 }, (_, i) =>
  buildProperty(i),
);
