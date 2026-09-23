import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const databaseUrl = process.env["DATABASE_URL"];

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env and configure MySQL.",
  );
}

const connectionUrl: string = databaseUrl;

const globalForDb = globalThis as unknown as {
  skyraMysqlPool?: mysql.Pool;
};

function createPool() {
  return mysql.createPool(connectionUrl);
}

export const pool = globalForDb.skyraMysqlPool ?? createPool();

if (process.env["NODE_ENV"] !== "production") {
  globalForDb.skyraMysqlPool = pool;
}

export const db = drizzle(pool, { schema, mode: "default" });
