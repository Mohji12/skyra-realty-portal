import type { PageViewEntry } from "./types";

/**
 * Browser-local analytics helpers. Property listings live in MySQL;
 * page views / visit counts remain device-local for this phase.
 */

const KEYS = {
  pageViews: "skyra.pageviews.v1",
  visits: "skyra.visits.v1",
} as const;

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

export function logPageView(page: string) {
  const entries = read<PageViewEntry[]>(KEYS.pageViews, []);
  entries.push({ page, timestamp: Date.now() });
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

export function clearAnalytics() {
  write(KEYS.pageViews, []);
  write(KEYS.visits, 0);
}
