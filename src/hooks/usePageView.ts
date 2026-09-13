import { useEffect } from "react";
import { logPageView } from "@/lib/skyra/storage";

/** Logs a browser-local page view entry (no backend analytics here). */
export function usePageView(page: string) {
  useEffect(() => {
    logPageView(page);
  }, [page]);
}
