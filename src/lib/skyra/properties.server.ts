import { eq, sql } from "drizzle-orm";
import { db } from "@/db/client.server";
import { properties } from "@/db/schema";
import type { Property } from "@/lib/skyra/types";
import type { PropertyDraftInput } from "@/lib/skyra/schemas";
import { propertyToInsert, rowToProperty } from "@/lib/skyra/property-mapper";
import { requireAdmin } from "@/lib/auth/auth.server";

export async function listAllProperties(): Promise<Property[]> {
  const rows = await db.select().from(properties);
  return rows.map(rowToProperty);
}

export async function findPropertyById(id: string): Promise<Property | null> {
  const rows = await db
    .select()
    .from(properties)
    .where(eq(properties.id, id))
    .limit(1);
  const row = rows[0];
  return row ? rowToProperty(row) : null;
}

export async function bumpViewCount(id: string): Promise<Property | null> {
  await db
    .update(properties)
    .set({ viewCount: sql`${properties.viewCount} + 1` })
    .where(eq(properties.id, id));
  return findPropertyById(id);
}

export async function insertProperty(draft: PropertyDraftInput): Promise<Property> {
  await requireAdmin();
  const id = draft.id?.trim() || `skyra-${crypto.randomUUID()}`;
  const property: Property = {
    ...draft,
    id,
    type: draft.type as Property["type"],
    furnishing: draft.furnishing as Property["furnishing"],
    possessionStatus: draft.possessionStatus as Property["possessionStatus"],
    ageOfProperty: draft.ageOfProperty as Property["ageOfProperty"],
    facing: draft.facing as Property["facing"],
    viewCount: 0,
  };
  await db.insert(properties).values(propertyToInsert(property));
  return property;
}

export async function patchProperty(
  id: string,
  draft: PropertyDraftInput,
): Promise<Property> {
  await requireAdmin();
  const existing = await findPropertyById(id);
  if (!existing) {
    throw new Error("Property not found");
  }
  const property: Property = {
    ...draft,
    id,
    type: draft.type as Property["type"],
    furnishing: draft.furnishing as Property["furnishing"],
    possessionStatus: draft.possessionStatus as Property["possessionStatus"],
    ageOfProperty: draft.ageOfProperty as Property["ageOfProperty"],
    facing: draft.facing as Property["facing"],
    viewCount: existing.viewCount,
  };
  const { id: _id, viewCount: _vc, ...rest } = propertyToInsert(property);
  await db.update(properties).set(rest).where(eq(properties.id, id));
  return property;
}

export async function removeProperty(id: string): Promise<void> {
  await requireAdmin();
  await db.delete(properties).where(eq(properties.id, id));
}
