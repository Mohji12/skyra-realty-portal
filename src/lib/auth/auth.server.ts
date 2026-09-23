import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { and, eq, gt } from "drizzle-orm";
import {
  deleteCookie,
  getCookie,
  setCookie,
} from "@tanstack/react-start/server";
import { db } from "@/db/client.server";
import { admins, sessions } from "@/db/schema";

export const SESSION_COOKIE = "skyra_session";
const SESSION_DAYS = 7;
const BCRYPT_ROUNDS = 12;

export type SessionAdmin = {
  id: string;
  email: string;
};

function sessionMaxAgeSeconds() {
  return SESSION_DAYS * 24 * 60 * 60;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(adminId: string) {
  const id = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + sessionMaxAgeSeconds() * 1000);

  await db.insert(sessions).values({
    id,
    adminId,
    expiresAt,
  });

  setCookie(SESSION_COOKIE, id, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionMaxAgeSeconds(),
  });

  return id;
}

export async function destroySession() {
  const token = getCookie(SESSION_COOKIE);
  if (token) {
    await db.delete(sessions).where(eq(sessions.id, token));
  }
  deleteCookie(SESSION_COOKIE, { path: "/" });
}

export async function getSessionAdmin(): Promise<SessionAdmin | null> {
  const token = getCookie(SESSION_COOKIE);
  if (!token) return null;

  const rows = await db
    .select({
      sessionId: sessions.id,
      expiresAt: sessions.expiresAt,
      adminId: admins.id,
      email: admins.email,
    })
    .from(sessions)
    .innerJoin(admins, eq(sessions.adminId, admins.id))
    .where(and(eq(sessions.id, token), gt(sessions.expiresAt, new Date())))
    .limit(1);

  const row = rows[0];
  if (!row) {
    deleteCookie(SESSION_COOKIE, { path: "/" });
    return null;
  }

  return { id: row.adminId, email: row.email };
}

export async function requireAdmin(): Promise<SessionAdmin> {
  const admin = await getSessionAdmin();
  if (!admin) {
    throw new Error("Unauthorized");
  }
  return admin;
}

export async function authenticateAdmin(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const rows = await db
    .select()
    .from(admins)
    .where(eq(admins.email, normalized))
    .limit(1);
  const admin = rows[0];
  if (!admin) return null;

  const ok = await verifyPassword(password, admin.passwordHash);
  if (!ok) return null;

  return { id: admin.id, email: admin.email };
}
