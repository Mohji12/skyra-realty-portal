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

/**
 * Curated Unsplash photos matched to each property type.
 * Real-estate only: buildings, interiors, and land parcels — not food, tools, or lifestyle crops.
 * At least 8 unique photos per type so every seed listing can have a distinct cover.
 */
const TYPE_IMAGES: Record<PropertyType, string[]> = {
  "Flat / Apartment": [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&h=800&q=80",
  ],
  Villa: [
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&h=800&q=80",
  ],
  Penthouse: [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&h=800&q=80",
  ],
  "Independent House": [
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?auto=format&fit=crop&w=1200&h=800&q=80",
  ],
  "Commercial Building": [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&h=800&q=80",
  ],
  Shop: [
    // retail storefronts / shop interiors (verified live Unsplash IDs)
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1200&h=800&q=80",
  ],
  "PG / Co-living Building": [
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&h=800&q=80",
  ],
  "Farm / Farmhouse": [
    // full farmhouse / rural property buildings — not crops or vegetables
    "https://images.unsplash.com/photo-1756219833872-c91af1a43b92?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1761013320045-d29e4f10bcbc?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1778158257064-e8603dc1105a?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&h=800&q=80",
  ],
  "Plot / Land": [
    // empty / undeveloped land parcels for sale
    "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&h=800&q=80",
  ],
};

/** One unique cover image per listing of the same type (6 seed rows per type). */
function imagesFor(type: PropertyType, index: number): string[] {
  const pool = TYPE_IMAGES[type];
  const occurrence = Math.floor(index / PROPERTY_TYPES.length);
  const cover = pool[occurrence % pool.length] as string;
  const gallery = [1, 2, 3].map(
    (n) => pool[(occurrence + n) % pool.length] as string,
  );
  return [cover, ...gallery];
}

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
  const amenities = AMENITIES.filter((_, idx) => (idx * 7 + i * 3) % 11 < amenityCount).slice(
    0,
    amenityCount,
  );
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
    images: imagesFor(type, i),
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
