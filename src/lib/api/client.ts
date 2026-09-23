const DEFAULT_API_URL = "http://localhost:8010";

/**
 * Absolute FastAPI base URL.
 * Keep frontend and API on the same hostname (both `localhost`) so
 * session cookies work across ports in local development.
 */
export function getApiBaseUrl(): string {
  const fromEnv = (
    import.meta.env["VITE_API_URL"] as string | undefined
  )?.replace(/\/$/, "");
  return fromEnv || DEFAULT_API_URL;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const payload = (await response.json()) as {
        detail?: string | Array<{ msg?: string }>;
      };
      if (typeof payload.detail === "string") {
        message = payload.detail;
      } else if (Array.isArray(payload.detail) && payload.detail[0]?.msg) {
        message = String(payload.detail[0].msg);
      }
    } catch {
      /* ignore non-JSON error bodies */
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
