import { useCallback, useEffect, useState } from "react";
import { PROPERTIES_EVENT, getProperties } from "@/lib/skyra/storage";
import type { Property } from "@/lib/skyra/types";

/**
 * Reads the localStorage-backed property list and re-reads it whenever any
 * part of the app mutates it. Starts empty on the server / first render to
 * avoid hydration mismatches.
 */
export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setProperties(getProperties());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener(PROPERTIES_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(PROPERTIES_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  return { properties, ready, refresh };
}
