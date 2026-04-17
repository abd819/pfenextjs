/**
 * Auth endpoints — strictly from /api/v1/accounts/*
 *
 * Endpoints:
 *   POST /api/v1/accounts/login/           → login
 *   POST /api/v1/accounts/register/        → register
 *   POST /api/v1/accounts/token/refresh/   → refreshToken
 *   GET  /api/v1/accounts/me/              → getMe
 */

import { apiRequest, tokenStore, type ApiResult } from "./client";
import type {
  LoginCredentials,
  TokenPair,
  RegisterRequest,
  RegisterResponse,
  TokenRefreshResponse,
} from "./types";

/**
 * Log in with phone + password.
 * On success, stores the access and refresh tokens automatically.
 */
export async function login(
  credentials: LoginCredentials
): Promise<ApiResult<TokenPair>> {
  const result = await apiRequest<TokenPair>("/api/v1/accounts/login/", {
    method: "POST",
    body: credentials,
    auth: false, // login does not need a token
  });

  if (result.ok) {
    tokenStore.setTokens(result.data.access, result.data.refresh);
  }

  return result;
}

/**
 * Register a new user (driver or provider).
 * Registration does not automatically log in — call login() afterwards.
 */
export async function register(
  payload: RegisterRequest
): Promise<ApiResult<RegisterResponse>> {
  return apiRequest<RegisterResponse>("/api/v1/accounts/register/", {
    method: "POST",
    body: payload,
    auth: false,
  });
}

/**
 * Get the currently authenticated user's profile.
 * The backend returns no body (HTTP 200 with no schema defined),
 * so we type the response as `unknown`.
 */
export async function getMe(): Promise<ApiResult<unknown>> {
  return apiRequest<unknown>("/api/v1/accounts/me/");
}

/**
 * Manually refresh the access token using the stored refresh token.
 * Normally this is called automatically by the client on 401 responses.
 */
export async function refreshToken(): Promise<ApiResult<TokenRefreshResponse>> {
  const refresh = tokenStore.getRefresh();

  if (!refresh) {
    return { ok: false, status: 0, error: "No refresh token stored" };
  }

  const result = await apiRequest<TokenRefreshResponse>(
    "/api/v1/accounts/token/refresh/",
    {
      method: "POST",
      body: { refresh },
      auth: false,
    }
  );

  if (result.ok) {
    tokenStore.setAccess(result.data.access);
  }

  return result;
}

/**
 * Log out — clears stored tokens.
 * The backend has no logout endpoint, so this is client-side only.
 */
export function logout(): void {
  tokenStore.clear();
}

/** Returns true if an access token is currently stored. */
export function isAuthenticated(): boolean {
  return Boolean(tokenStore.getAccess());
}
