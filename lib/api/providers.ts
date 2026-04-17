/**
 * Providers endpoints — strictly from /api/v1/providers/*
 *
 * Provider Profiles:
 *   GET    /api/v1/providers/profiles/        → listProviderProfiles
 *   POST   /api/v1/providers/profiles/        → createProviderProfile
 *   GET    /api/v1/providers/profiles/{id}/   → getProviderProfile
 *   PUT    /api/v1/providers/profiles/{id}/   → updateProviderProfile
 *   PATCH  /api/v1/providers/profiles/{id}/   → patchProviderProfile
 *   DELETE /api/v1/providers/profiles/{id}/   → deleteProviderProfile
 *
 * Reviews:
 *   GET    /api/v1/providers/reviews/         → listReviews
 *   POST   /api/v1/providers/reviews/         → createReview
 *   GET    /api/v1/providers/reviews/{id}/    → getReview
 *   PUT    /api/v1/providers/reviews/{id}/    → updateReview
 *   PATCH  /api/v1/providers/reviews/{id}/    → patchReview
 *   DELETE /api/v1/providers/reviews/{id}/    → deleteReview
 */

import { apiRequest, type ApiResult } from "./client";
import type {
  ProviderProfile,
  PatchedProviderProfile,
  Review,
  ReviewCreateRequest,
  PatchedReview,
} from "./types";

// ─── Provider Profiles ────────────────────────────────────────────────────────

/**
 * GET /api/v1/providers/profiles/
 * Returns all provider profiles.
 */
export async function listProviderProfiles(): Promise<ApiResult<ProviderProfile[]>> {
  return apiRequest<ProviderProfile[]>("/api/v1/providers/profiles/");
}

/**
 * POST /api/v1/providers/profiles/
 * Create a provider profile for the authenticated user.
 * The schema marks most fields readOnly — only `is_available` and `service_zone`
 * are writable on creation.
 */
export async function createProviderProfile(
  payload: PatchedProviderProfile
): Promise<ApiResult<ProviderProfile>> {
  return apiRequest<ProviderProfile>("/api/v1/providers/profiles/", {
    method: "POST",
    body: payload,
  });
}

/**
 * GET /api/v1/providers/profiles/{id}/
 */
export async function getProviderProfile(
  id: number
): Promise<ApiResult<ProviderProfile>> {
  return apiRequest<ProviderProfile>(`/api/v1/providers/profiles/${id}/`);
}

/**
 * PUT /api/v1/providers/profiles/{id}/
 * Full replacement — supply all writable fields.
 */
export async function updateProviderProfile(
  id: number,
  payload: PatchedProviderProfile
): Promise<ApiResult<ProviderProfile>> {
  return apiRequest<ProviderProfile>(`/api/v1/providers/profiles/${id}/`, {
    method: "PUT",
    body: payload,
  });
}

/**
 * PATCH /api/v1/providers/profiles/{id}/
 * Partial update — supply only the fields you want to change.
 */
export async function patchProviderProfile(
  id: number,
  payload: PatchedProviderProfile
): Promise<ApiResult<ProviderProfile>> {
  return apiRequest<ProviderProfile>(`/api/v1/providers/profiles/${id}/`, {
    method: "PATCH",
    body: payload,
  });
}

/**
 * DELETE /api/v1/providers/profiles/{id}/
 * Returns HTTP 204 (no body).
 */
export async function deleteProviderProfile(
  id: number
): Promise<ApiResult<undefined>> {
  return apiRequest<undefined>(`/api/v1/providers/profiles/${id}/`, {
    method: "DELETE",
  });
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/providers/reviews/
 */
export async function listReviews(): Promise<ApiResult<Review[]>> {
  return apiRequest<Review[]>("/api/v1/providers/reviews/");
}

/**
 * POST /api/v1/providers/reviews/
 */
export async function createReview(
  payload: ReviewCreateRequest
): Promise<ApiResult<Review>> {
  return apiRequest<Review>("/api/v1/providers/reviews/", {
    method: "POST",
    body: payload,
  });
}

/**
 * GET /api/v1/providers/reviews/{id}/
 * Note: id is a string in the schema path.
 */
export async function getReview(id: string | number): Promise<ApiResult<Review>> {
  return apiRequest<Review>(`/api/v1/providers/reviews/${id}/`);
}

/**
 * PUT /api/v1/providers/reviews/{id}/
 */
export async function updateReview(
  id: string | number,
  payload: ReviewCreateRequest
): Promise<ApiResult<Review>> {
  return apiRequest<Review>(`/api/v1/providers/reviews/${id}/`, {
    method: "PUT",
    body: payload,
  });
}

/**
 * PATCH /api/v1/providers/reviews/{id}/
 */
export async function patchReview(
  id: string | number,
  payload: PatchedReview
): Promise<ApiResult<Review>> {
  return apiRequest<Review>(`/api/v1/providers/reviews/${id}/`, {
    method: "PATCH",
    body: payload,
  });
}

/**
 * DELETE /api/v1/providers/reviews/{id}/
 * Returns HTTP 204 (no body).
 */
export async function deleteReview(
  id: string | number
): Promise<ApiResult<undefined>> {
  return apiRequest<undefined>(`/api/v1/providers/reviews/${id}/`, {
    method: "DELETE",
  });
}
