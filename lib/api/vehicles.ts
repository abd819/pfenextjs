/**
 * Vehicles endpoints — strictly from /api/v1/vehicles/*
 *
 * Endpoints:
 *   GET    /api/v1/vehicles/        → listVehicles
 *   POST   /api/v1/vehicles/        → createVehicle
 *   GET    /api/v1/vehicles/{id}/   → getVehicle
 *   PUT    /api/v1/vehicles/{id}/   → updateVehicle
 *   PATCH  /api/v1/vehicles/{id}/   → patchVehicle
 *   DELETE /api/v1/vehicles/{id}/   → deleteVehicle
 *
 * Note: The {id} path parameter is typed as `string` in the schema.
 */

import { apiRequest, type ApiResult } from "./client";
import type { Vehicle, VehicleWriteRequest, PatchedVehicle } from "./types";

/**
 * GET /api/v1/vehicles/
 * Returns all vehicles belonging to the authenticated driver.
 */
export async function listVehicles(): Promise<ApiResult<Vehicle[]>> {
  return apiRequest<Vehicle[]>("/api/v1/vehicles/");
}

/**
 * POST /api/v1/vehicles/
 * Create a new vehicle for the authenticated driver.
 */
export async function createVehicle(
  payload: VehicleWriteRequest
): Promise<ApiResult<Vehicle>> {
  return apiRequest<Vehicle>("/api/v1/vehicles/", {
    method: "POST",
    body: payload,
  });
}

/**
 * GET /api/v1/vehicles/{id}/
 * Note: The schema defines `id` as a string path parameter.
 */
export async function getVehicle(id: string | number): Promise<ApiResult<Vehicle>> {
  return apiRequest<Vehicle>(`/api/v1/vehicles/${id}/`);
}

/**
 * PUT /api/v1/vehicles/{id}/
 * Full replacement — supply all writable fields.
 */
export async function updateVehicle(
  id: string | number,
  payload: VehicleWriteRequest
): Promise<ApiResult<Vehicle>> {
  return apiRequest<Vehicle>(`/api/v1/vehicles/${id}/`, {
    method: "PUT",
    body: payload,
  });
}

/**
 * PATCH /api/v1/vehicles/{id}/
 * Partial update — supply only the fields you want to change.
 */
export async function patchVehicle(
  id: string | number,
  payload: PatchedVehicle
): Promise<ApiResult<Vehicle>> {
  return apiRequest<Vehicle>(`/api/v1/vehicles/${id}/`, {
    method: "PATCH",
    body: payload,
  });
}

/**
 * DELETE /api/v1/vehicles/{id}/
 * Returns HTTP 204 (no body).
 */
export async function deleteVehicle(
  id: string | number
): Promise<ApiResult<undefined>> {
  return apiRequest<undefined>(`/api/v1/vehicles/${id}/`, {
    method: "DELETE",
  });
}
