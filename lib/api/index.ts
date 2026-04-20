/**
 * Public API surface — import everything from here.
 *
 * Usage:
 *   import { login, listRequests, listVehicles } from "@/lib/api";
 */

// Client primitives (token store, result types)
export { tokenStore } from "./client";
export { authDebug } from "./debug";
export type { ApiResult, ApiOk, ApiErr } from "./client";

// All types derived from the OpenAPI schema
export type {
  // Enums
  RoleEnum,
  ReviewStatusEnum,
  ServiceRequestStatus,
  DispatchState,
  // Auth
  LoginCredentials,
  TokenPair,
  TokenRefreshRequest,
  TokenRefreshResponse,
  RegisterRequest,
  RegisterResponse,
  // Providers
  ProviderProfile,
  PatchedProviderProfile,
  // Reviews
  Review,
  ReviewCreateRequest,
  PatchedReview,
  // Requests
  ServiceRequestList,
  ServiceRequestDetail,
  ServiceRequestCreateRequest,
  ServiceRequestCreateResponse,
  // Vehicles
  VehicleImage,
  Vehicle,
  VehicleWriteRequest,
  PatchedVehicle,
} from "./types";

// Auth
export {
  login,
  register,
  getMe,
  refreshToken,
  logout,
  isAuthenticated,
} from "./auth";

// Service Requests
export {
  listRequests,
  createRequest,
  getRequest,
  acceptRequest,
  cancelRequest,
  completeRequest,
} from "./requests";

// Providers (profiles + reviews)
export {
  listProviderProfiles,
  createProviderProfile,
  getProviderProfile,
  updateProviderProfile,
  patchProviderProfile,
  deleteProviderProfile,
  listReviews,
  createReview,
  getReview,
  updateReview,
  patchReview,
  deleteReview,
} from "./providers";

// Locations
export {
  updateProviderLocation,
  getProviderLocationForRequest,
} from "./locations";

// Dispatch
export { processOfferTimeouts, respondToDispatchRequest } from "./dispatch";

// Vehicles
export {
  listVehicles,
  createVehicle,
  getVehicle,
  updateVehicle,
  patchVehicle,
  deleteVehicle,
} from "./vehicles";
