/**
 * Dispatch endpoints — strictly from /api/v1/dispatch/*
 *
 * Endpoints:
 *   POST /api/v1/dispatch/offers/process-timeouts/         → processOfferTimeouts
 *   POST /api/v1/dispatch/requests/{request_id}/respond/   → respondToDispatchRequest
 *
 * Both return HTTP 200 with no response body (schema: "No response body").
 */

import { apiRequest, type ApiResult } from "./client";

/**
 * POST /api/v1/dispatch/offers/process-timeouts/
 *
 * Triggers processing of expired dispatch offers.
 * Typically called by an admin or scheduled job.
 * Returns HTTP 200 with no body.
 */
export async function processOfferTimeouts(): Promise<ApiResult<undefined>> {
  return apiRequest<undefined>("/api/v1/dispatch/offers/process-timeouts/", {
    method: "POST",
  });
}

/**
 * POST /api/v1/dispatch/requests/{request_id}/respond/
 *
 * Respond to a dispatched service request offer.
 * The schema does not define a request body — the server likely reads
 * the provider identity from the JWT token.
 * Returns HTTP 200 with no body.
 */
export async function respondToDispatchRequest(
  requestId: number
): Promise<ApiResult<undefined>> {
  return apiRequest<undefined>(
    `/api/v1/dispatch/requests/${requestId}/respond/`,
    { method: "POST" }
  );
}
