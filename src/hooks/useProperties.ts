import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listProperties } from "@/lib/skyra/properties.functions";
import type { Property } from "@/lib/skyra/types";

export const PROPERTIES_QUERY_KEY = ["properties"] as const;

/**
 * Loads the shared MySQL-backed property list. Mutations should invalidate
 * via `refresh()` so home, listings, and admin stay in sync.
 */
export function useProperties() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: PROPERTIES_QUERY_KEY,
    queryFn: () => listProperties(),
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEY });
  }, [queryClient]);

  return {
    properties: (query.data ?? []) as Property[],
    ready: query.isFetched,
    loading: query.isLoading || query.isPending,
    error: query.error,
    refresh,
  };
}
