import "dotenv/config";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import { SEED_PROPERTIES } from "../lib/skyra/seed";
import { propertyToInsert } from "../lib/skyra/property-mapper";

async function main() {
  const databaseUrl = process.env["DATABASE_URL"];
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  const adminEmail = (process.env["ADMIN_EMAIL"] ?? "admin@skyrarealty.local")
    .trim()
    .toLowerCase();
  const adminPassword = process.env["ADMIN_PASSWORD"] ?? "skyra2026";

  const connection = await mysql.createConnection(databaseUrl);
  const db = drizzle(connection, { schema, mode: "default" });

  try {
    const existingAdmins = await db
      .select()
      .from(schema.admins)
      .where(eq(schema.admins.email, adminEmail))
      .limit(1);

    if (existingAdmins.length === 0) {
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      await db.insert(schema.admins).values({
        id: `admin-${randomUUID()}`,
        email: adminEmail,
        passwordHash,
      });
      console.log(`Created admin: ${adminEmail}`);
    } else {
      console.log(`Admin already exists: ${adminEmail}`);
    }

    for (const property of SEED_PROPERTIES) {
      await db
        .insert(schema.properties)
        .values(propertyToInsert(property))
        .onDuplicateKeyUpdate({
          set: {
            title: property.title,
            type: property.type,
            locality: property.locality,
            address: property.address,
            price: property.price,
            areaSqft: property.areaSqft,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            furnishing: property.furnishing,
            possessionStatus: property.possessionStatus,
            ageOfProperty: property.ageOfProperty,
            facing: property.facing,
            floorNumber: property.floorNumber,
            totalFloors: property.totalFloors,
            amenities: property.amenities,
            description: property.description,
            images: property.images,
            listedDate: property.listedDate,
            ownerContactName: property.ownerContactName,
            ownerContactPhone: property.ownerContactPhone,
          },
        });
    }

    console.log(`Upserted ${SEED_PROPERTIES.length} seed properties.`);
  } finally {
    await connection.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
