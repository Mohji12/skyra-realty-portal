import { apiFetch } from "@/lib/api/client";
import type { Property } from "@/lib/skyra/types";
import type { PropertyDraftInput } from "@/lib/skyra/schemas";

export async function listProperties(): Promise<Property[]> {
  return apiFetch("/api/properties");
}

export async function getProperty(opts: {
  data: { id: string };
}): Promise<Property | null> {
  try {
    return await apiFetch(`/api/properties/${encodeURIComponent(opts.data.id)}`);
  } catch {
    return null;
  }
}

export async function incrementPropertyViewCount(opts: {
  data: { id: string };
}): Promise<Property> {
  return apiFetch(
    `/api/properties/${encodeURIComponent(opts.data.id)}/view`,
    { method: "POST" },
  );
}

export async function createProperty(opts: {
  data: PropertyDraftInput;
}): Promise<Property> {
  return apiFetch("/api/properties", {
    method: "POST",
    body: JSON.stringify(opts.data),
  });
}

export async function updateProperty(opts: {
  data: { id: string; values: PropertyDraftInput };
}): Promise<Property> {
  return apiFetch(`/api/properties/${encodeURIComponent(opts.data.id)}`, {
    method: "PUT",
    body: JSON.stringify(opts.data.values),
  });
}

export async function deleteProperty(opts: {
  data: { id: string };
}): Promise<{ ok: true }> {
  return apiFetch(`/api/properties/${encodeURIComponent(opts.data.id)}`, {
    method: "DELETE",
  });
}
