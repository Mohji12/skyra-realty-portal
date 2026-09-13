import { SEED_PROPERTIES } from "./seed";
import type { PageViewEntry, Property } from "./types";

/**
 * Browser-local persistence layer. There is no backend in this project:
 * properties, page views and per-property view counts all live in
 * localStorage, so everything below only reflects THIS browser/device.
 */

/** Bump when seed image URLs change so stored listings get fresh photos. */
const IMAGE_REVISION = 7;

const KEYS = {
  properties: "skyra.properties.v7",
  imageRevision: "skyra.image-revision",
  pageViews: "skyra.pageviews.v1",
  visits: "skyra.visits.v1",
} as const;

const LEGACY_PROPERTY_KEYS = [
  "skyra.properties.v1",
  "skyra.properties.v2",
  "skyra.properties.v3",
  "skyra.properties.v4",
  "skyra.properties.v5",
  "skyra.properties.v6",
] as const;

const isBrowser = () => typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked — ignore */
  }
}

function purgeLegacyCaches() {
  if (!isBrowser()) return;
  for (const key of LEGACY_PROPERTY_KEYS) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }
}

/** Re-apply seed cover/gallery URLs onto matching listings after image fixes. */
function syncSeedImages(list: Property[]): Property[] {
  const byId = new Map(SEED_PROPERTIES.map((p) => [p.id, p]));
  return list.map((p) => {
    const seed = byId.get(p.id);
    return seed ? { ...p, images: seed.images } : p;
  });
}

export const PROPERTIES_EVENT = "skyra:properties-changed";

function emit() {
  if (isBrowser()) window.dispatchEvent(new Event(PROPERTIES_EVENT));
}

export function getProperties(): Property[] {
  if (!isBrowser()) return SEED_PROPERTIES;

  purgeLegacyCaches();

  let stored = read<Property[] | null>(KEYS.properties, null);
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    write(KEYS.properties, SEED_PROPERTIES);
    write(KEYS.imageRevision, IMAGE_REVISION);
    return SEED_PROPERTIES;
  }

  const rev = read<number>(KEYS.imageRevision, 0);
  if (rev < IMAGE_REVISION) {
    stored = syncSeedImages(stored);
    write(KEYS.properties, stored);
    write(KEYS.imageRevision, IMAGE_REVISION);
  }

  return stored;
}

export function saveProperties(list: Property[]) {
  write(KEYS.properties, list);
  emit();
}

export function getProperty(id: string): Property | undefined {
  return getProperties().find((p) => p.id === id);
}

export function addProperty(property: Property) {
  saveProperties([property, ...getProperties()]);
}

export function updateProperty(id: string, patch: Partial<Property>) {
  saveProperties(getProperties().map((p) => (p.id === id ? { ...p, ...patch } : p)));
}

export function deleteProperty(id: string) {
  saveProperties(getProperties().filter((p) => p.id !== id));
}

export function resetToSeed() {
  write(KEYS.properties, SEED_PROPERTIES);
  write(KEYS.imageRevision, IMAGE_REVISION);
  write(KEYS.pageViews, []);
  write(KEYS.visits, 0);
  emit();
}

/** Increments the per-property view counter (analytics, browser-local). */
export function incrementViewCount(id: string) {
  const list = getProperties();
  const next = list.map((p) =>
    p.id === id ? { ...p, viewCount: (p.viewCount ?? 0) + 1 } : p,
  );
  write(KEYS.properties, next);
  emit();
}

export function logPageView(page: string) {
  const entries = read<PageViewEntry[]>(KEYS.pageViews, []);
  entries.push({ page, timestamp: Date.now() });
  // keep the log bounded so localStorage never fills up
  write(KEYS.pageViews, entries.slice(-2000));
}

export function getPageViews(): PageViewEntry[] {
  return read<PageViewEntry[]>(KEYS.pageViews, []);
}

export function incrementVisits() {
  write(KEYS.visits, read<number>(KEYS.visits, 0) + 1);
}

export function getVisits(): number {
  return read<number>(KEYS.visits, 0);
}
