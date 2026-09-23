import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "skyra.compare.ids";
export const COMPARE_EVENT = "skyra:compare-changed";
export const MAX_COMPARE = 2;

function isBrowser() {
  return typeof window !== "undefined";
}

function readIds(): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string").slice(0, MAX_COMPARE);
  } catch {
    return [];
  }
}

function writeIds(ids: string[]) {
  if (!isBrowser()) return;
  const next = ids.slice(0, MAX_COMPARE);
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(COMPARE_EVENT));
}

export function getCompareIds(): string[] {
  return readIds();
}

export function toggleCompareId(id: string): { ids: string[]; added: boolean; rejected?: boolean } {
  const current = readIds();
  if (current.includes(id)) {
    const ids = current.filter((x) => x !== id);
    writeIds(ids);
    return { ids, added: false };
  }
  if (current.length >= MAX_COMPARE) {
    return { ids: current, added: false, rejected: true };
  }
  const ids = [...current, id];
  writeIds(ids);
  return { ids, added: true };
}

export function removeCompareId(id: string) {
  writeIds(readIds().filter((x) => x !== id));
}

export function clearCompareIds() {
  writeIds([]);
}

export function useCompareSelection() {
  const [ids, setIds] = useState<string[]>([]);

  const refresh = useCallback(() => {
    setIds(readIds());
  }, []);

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener(COMPARE_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(COMPARE_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  const toggle = useCallback((id: string) => toggleCompareId(id), []);
  const remove = useCallback((id: string) => removeCompareId(id), []);
  const clear = useCallback(() => clearCompareIds(), []);
  const isSelected = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, toggle, remove, clear, isSelected, count: ids.length };
}
