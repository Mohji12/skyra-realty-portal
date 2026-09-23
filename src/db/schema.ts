import {
  index,
  int,
  json,
  mysqlTable,
  timestamp,
  varchar,
  text,
  double,
} from "drizzle-orm/mysql-core";

export const admins = mysqlTable("admins", {
  id: varchar("id", { length: 64 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = mysqlTable(
  "sessions",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    adminId: varchar("admin_id", { length: 64 })
      .notNull()
      .references(() => admins.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("sessions_admin_id_idx").on(table.adminId)],
);

export const properties = mysqlTable(
  "properties",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    type: varchar("type", { length: 64 }).notNull(),
    locality: varchar("locality", { length: 128 }).notNull(),
    address: text("address").notNull(),
    price: double("price").notNull(),
    areaSqft: double("area_sqft").notNull(),
    bedrooms: int("bedrooms").notNull().default(0),
    bathrooms: int("bathrooms").notNull().default(0),
    furnishing: varchar("furnishing", { length: 64 }).notNull(),
    possessionStatus: varchar("possession_status", { length: 64 }).notNull(),
    ageOfProperty: varchar("age_of_property", { length: 64 }).notNull(),
    facing: varchar("facing", { length: 32 }).notNull(),
    floorNumber: int("floor_number").notNull().default(0),
    totalFloors: int("total_floors").notNull().default(0),
    amenities: json("amenities").$type<string[]>().notNull(),
    description: text("description").notNull(),
    images: json("images").$type<string[]>().notNull(),
    listedDate: varchar("listed_date", { length: 32 }).notNull(),
    ownerContactName: varchar("owner_contact_name", { length: 128 }).notNull(),
    ownerContactPhone: varchar("owner_contact_phone", { length: 32 }).notNull(),
    viewCount: int("view_count").notNull().default(0),
  },
  (table) => [
    index("properties_listed_date_idx").on(table.listedDate),
    index("properties_type_idx").on(table.type),
    index("properties_locality_idx").on(table.locality),
  ],
);

export type AdminRow = typeof admins.$inferSelect;
export type PropertyRow = typeof properties.$inferSelect;
