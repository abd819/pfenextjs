/**
 * Core API client for the Django REST backend.
 *
 * Responsibilities:
 *  - Build absolute URLs from NEXT_PUBLIC_API_URL
 *  - Inject the JWT Bearer token on every authenticated request
 *  - Transparently refresh the access token on 401 (once per request)
 *  - Return a discriminated union: { ok: true, data } | { ok: false, ... }
 *
 * Only use this module via the domain files (auth.ts, requests.ts, ...).
 */

// ─── Result type ──────────────────────────────────────────────────────────────

export type ApiOk<T> = { ok: true; data: T };
export type ApiErr = {
  ok: false;
  status: number;
  error: string;
  detail?: unknown;
};
export type ApiResult<T> = ApiOk<T> | ApiErr;

// ─── Base URL ──────────────────────────────────────────────────────────────────

/**
 * Set NEXT_PUBLIC_API_URL in your .env.local, e.g.:
 *   NEXT_PUBLIC_API_URL=http://localhost:8000
 *
 * Falls back to empty string (same origin) when not set.
 */
const BASE_URL: string =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) || "";

// Log the BASE_URL on client init
if (typeof window !== "undefined") {
  console.log(`[API] Initialized with BASE_URL: "${BASE_URL}"`);
}

// ─── Token storage ─────────────────────────────────────────────────────────────

const STORAGE_KEY_ACCESS = "access";
const STORAGE_KEY_REFRESH = "refresh";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export const tokenStore = {
  getAccess(): string | null {
    if (!isBrowser()) return null;
    const token = localStorage.getItem(STORAGE_KEY_ACCESS);
    if (!token) {
      console.warn(`[AUTH] No access token found in localStorage`);
    } else {
      console.log(
        `[AUTH] Retrieved access token: ${token.substring(0, 20)}...`
      );
    }
    return token;
  },
  getRefresh(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(STORAGE_KEY_REFRESH);
  },
  setTokens(access: string, refresh: string): void {
    if (!isBrowser()) return;
    localStorage.setItem(STORAGE_KEY_ACCESS, access);
    localStorage.setItem(STORAGE_KEY_REFRESH, refresh);
    console.log(
      `[AUTH] Tokens stored: access=${access.substring(0, 20)}..., refresh=${refresh.substring(0, 20)}...`
    );
  },
  setAccess(access: string): void {
    if (!isBrowser()) return;
    localStorage.setItem(STORAGE_KEY_ACCESS, access);
    console.log(`[AUTH] Access token updated: ${access.substring(0, 20)}...`);
  },
  clear(): void {
    if (!isBrowser()) return;
    localStorage.removeItem(STORAGE_KEY_ACCESS);
    localStorage.removeItem(STORAGE_KEY_REFRESH);
    console.log(`[AUTH] Tokens cleared`);
  },
};

// ─── Token refresh ─────────────────────────────────────────────────────────────

/** Lock to prevent concurrent refresh storms */
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refresh = tokenStore.getRefresh();
    if (!refresh) return false;

    try {
      const res = await fetch(`${BASE_URL}/api/v1/accounts/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      if (!res.ok) {
        tokenStore.clear();
        return false;
      }

      const data: { access: string } = await res.json();
      tokenStore.setAccess(data.access);
      return true;
    } catch {
      tokenStore.clear();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ─── Core request function ─────────────────────────────────────────────────────

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean; // default: true — set false only for login/register
  isRetry?: boolean; // internal — prevents infinite refresh loop
  headers?: Record<string, string>;
}

/**
 * The single fetch gateway for all API calls.
 *
 * @param path  Absolute path starting with /api/...
 * @param opts  Request options
 */
export async function apiRequest<T>(
  path: string,
  opts: RequestOptions = {},
): Promise<ApiResult<T>> {
  const {
    method = "GET",
    body,
    auth = true,
    isRetry = false,
    headers: extraHeaders = {},
  } = opts;

  // Build headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  const token = auth ? tokenStore.getAccess() : null;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    console.log(
      `[API] Authorization header: Bearer ${token.substring(0, 20)}...`
    );
  } else if (auth) {
    console.warn(`[API] No token available for authenticated request!`);
  }

  // Build request
  const init: RequestInit = {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  };

  const url = `${BASE_URL}${path}`;

  // Debug logging
  if (typeof window !== "undefined") {
    console.log(`[API] ${method} ${url}`, {
      baseUrl: BASE_URL,
      path,
      hasToken: !!token,
      headers,
    });
  }

  let response: Response;

  try {
    response = await fetch(url, init);
  } catch (networkError) {
    const errorMsg =
      networkError instanceof Error
        ? networkError.message
        : String(networkError);
    console.error(`[API] Network error on ${url}:`, errorMsg);
    return {
      ok: false,
      status: 0,
      error: `Network error: ${errorMsg} (backend: ${BASE_URL})`,
      detail: networkError,
    };
  }

  // ── 401: attempt token refresh then retry once ──
  if (response.status === 401 && auth && !isRetry) {
    console.log(`[API] 401 Unauthorized on ${url}`);
    console.log(`[API] - Token was present: ${!!token}`);
    console.log(`[API] - Auth header value: ${headers["Authorization"]}`);
    console.log(`[API] Attempting token refresh...`);

    const refreshed = await refreshAccessToken();

    if (refreshed) {
      console.log(`[API] Token refreshed successfully, retrying ${url}`);
      return apiRequest<T>(path, { ...opts, isRetry: true });
    }

    // Refresh failed — session expired
    console.error(`[API] Token refresh failed, session expired`);
    tokenStore.clear();
    // Emit a custom event so UI can redirect to login
    if (isBrowser()) {
      window.dispatchEvent(new CustomEvent("najda:unauthorized"));
    }
    return {
      ok: false,
      status: 401,
      error: "Session expired — please log in again",
    };
  }

  // ── 204 No Content ──
  if (response.status === 204) {
    console.log(`[API] 204 No Content from ${url}`);
    return { ok: true, data: undefined as T };
  }

  // ── Parse body ──
  let data: unknown;
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    // Django REST Framework error shape: { detail: "..." } or field error map
    let errorMessage = `Request failed with status ${response.status}`;

    if (data && typeof data === "object") {
      const d = data as Record<string, unknown>;
      if (typeof d["detail"] === "string") {
        errorMessage = d["detail"];
      } else {
        // Field validation errors — flatten to readable string
        errorMessage = Object.entries(d)
          .map(
            ([field, msgs]) =>
              `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`,
          )
          .join(" | ");
      }
    }

    console.error(`[API] Error ${response.status} from ${url}:`, errorMessage, data);
    return {
      ok: false,
      status: response.status,
      error: errorMessage,
      detail: data,
    };
  }

  console.log(`[API] Success ${response.status} from ${url}:`, data);
  return { ok: true, data: data as T };
}
