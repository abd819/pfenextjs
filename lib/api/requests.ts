/**
 * Service Requests endpoints — strictly from /api/v1/requests/*
 *
 * Endpoints:
 *   GET  /api/v1/requests/              → listRequests
 *   POST /api/v1/requests/              → createRequest
 *   GET  /api/v1/requests/{id}/         → getRequest
 *   POST /api/v1/requests/{id}/accept/  → acceptRequest
 *   POST /api/v1/requests/{id}/cancel/  → cancelRequest
 *   POST /api/v1/requests/{id}/complete/→ completeRequest
 */

import { apiRequest, type ApiResult } from "./client";
import type {
  ServiceRequestList,
  ServiceRequestDetail,
  ServiceRequestCreateRequest,
  ServiceRequestCreateResponse,
} from "./types";

/**
 * GET /api/v1/requests/
 * Returns the list of all service requests visible to the authenticated user.
 */
export async function listRequests(): Promise<ApiResult<ServiceRequestList[]>> {
  return apiRequest<ServiceRequestList[]>("/api/v1/requests/");
}

/**
 * POST /api/v1/requests/
 * Create a new service request.
 */
export async function createRequest(
  payload: ServiceRequestCreateRequest
): Promise<ApiResult<ServiceRequestCreateResponse>> {
  return apiRequest<ServiceRequestCreateResponse>("/api/v1/requests/", {
    method: "POST",
    body: payload,
  });
}

/**
 * GET /api/v1/requests/{id}/
 * Retrieve the full detail of a single service request.
 */
export async function getRequest(
  id: number
): Promise<ApiResult<ServiceRequestDetail>> {
  return apiRequest<ServiceRequestDetail>(`/api/v1/requests/${id}/`);
}

/**
 * POST /api/v1/requests/{id}/accept/
 * Accept a service request. Returns HTTP 200 with no body.
 */
export async function acceptRequest(id: number): Promise<ApiResult<undefined>> {
  return apiRequest<undefined>(`/api/v1/requests/${id}/accept/`, {
    method: "POST",
  });
}

/**
 * POST /api/v1/requests/{id}/cancel/
 * Cancel a service request. Returns HTTP 200 with no body.
 */
export async function cancelRequest(id: number): Promise<ApiResult<undefined>> {
  return apiRequest<undefined>(`/api/v1/requests/${id}/cancel/`, {
    method: "POST",
  });
}

/**
 * POST /api/v1/requests/{id}/complete/
 * Mark a service request as completed. Returns HTTP 200 with no body.
 */
export async function completeRequest(id: number): Promise<ApiResult<undefined>> {
  return apiRequest<undefined>(`/api/v1/requests/${id}/complete/`, {
    method: "POST",
  });
}
