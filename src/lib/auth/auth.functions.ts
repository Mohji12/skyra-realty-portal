import { apiFetch } from "@/lib/api/client";

export type AdminUser = { id: string; email: string };

export async function getSession(): Promise<
  | { authenticated: true; admin: AdminUser }
  | { authenticated: false }
> {
  return apiFetch("/api/auth/session");
}

export async function login(opts: {
  data: { email: string; password: string };
}): Promise<{ ok: true; admin: AdminUser }> {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(opts.data),
  });
}

export async function logout(): Promise<{ ok: true }> {
  return apiFetch("/api/auth/logout", { method: "POST" });
}
