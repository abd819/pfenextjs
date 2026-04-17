/**
 * Locations endpoints — strictly from /api/v1/locations/*
 *
 * Endpoints:
 *   POST /api/v1/locations/provider/update/              → updateProviderLocation
 *   GET  /api/v1/locations/request/{request_id}/provider/ → getProviderLocationForRequest
 *
 * Note: Both endpoints return "No response body" (HTTP 200) in the schema.
 * The request body for updateProviderLocation is also undefined in the schema —
 * no body shape is specified, so we accept an arbitrary object (`unknown`).
 */

import { apiRequest, type ApiResult } from "./client";

/**
 * POST /api/v1/locations/provider/update/
 *
 * Update the authenticated provider's current location.
 * The schema does not define a request body shape — pass coordinates
 * as a plain object. Returns HTTP 200 with no body.
 */
export async function updateProviderLocation(
  payload: Record<string, unknown>
): Promise<ApiResult<undefined>> {
  return apiRequest<undefined>("/api/v1/locations/provider/update/", {
    method: "POST",
    body: payload,
  });
}

/**
 * GET /api/v1/locations/request/{request_id}/provider/
 *
 * Retrieve the current location of the provider assigned to a request.
 * The schema defines no response body — typed as `unknown`.
 */
export async function getProviderLocationForRequest(
  requestId: number
): Promise<ApiResult<unknown>> {
  return apiRequest<unknown>(
    `/api/v1/locations/request/${requestId}/provider/`
  );
}
