/**
 * TypeScript types generated strictly from openapi.yaml
 * DO NOT add fields that are not in the schema.
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

export type RoleEnum = "driver" | "provider";

export type ReviewStatusEnum = "published" | "hidden";

/** Status of a ServiceRequest (Status416Enum in schema) */
export type ServiceRequestStatus =
  | "pending"
  | "accepted"
  | "provider_on_the_way"
  | "arrived"
  | "completed"
  | "cancelled";

export type DispatchState =
  | "pending"
  | "offered"
  | "accepted"
  | "expired"
  | "cancelled";

// ─── Auth ─────────────────────────────────────────────────────────────────────

/** POST /api/v1/accounts/login/ – request body & response */
export interface LoginCredentials {
  phone: string;
  password: string;
}

/** Response from login — contains access + refresh JWT tokens */
export interface TokenPair {
  access: string;
  refresh: string;
}

/** POST /api/v1/accounts/token/refresh/ – request body */
export interface TokenRefreshRequest {
  refresh: string;
}

/** POST /api/v1/accounts/token/refresh/ – response */
export interface TokenRefreshResponse {
  access: string;
}

/** POST /api/v1/accounts/register/ – request body */
export interface RegisterRequest {
  first_name: string;
  last_name: string;
  phone: string;
  email?: string | null;
  role: RoleEnum;
  password: string;
  password_confirmation: string;
}

/** POST /api/v1/accounts/register/ – response */
export interface RegisterResponse {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string | null;
  role: RoleEnum;
  date_creation: string; // ISO datetime, readOnly
}

// ─── Provider Profiles ────────────────────────────────────────────────────────

export interface ProviderProfile {
  id: number;                   // readOnly
  provider: number;             // readOnly
  provider_first_name: string;  // readOnly
  provider_last_name: string;   // readOnly
  provider_phone: string;       // readOnly
  is_available: boolean;
  average_rating: string;       // decimal string, readOnly
  total_reviews: number;        // readOnly
  service_zone?: string;
}

/** PATCH /api/v1/providers/profiles/{id}/ – writable fields only */
export interface PatchedProviderProfile {
  is_available?: boolean;
  service_zone?: string;
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export interface Review {
  id: number;                   // readOnly
  request: number;
  driver: number;               // readOnly
  provider: number;             // readOnly
  rating: number;
  comment: string;
  status: ReviewStatusEnum;     // readOnly
  response?: string | null;
  created_at: string;           // readOnly ISO datetime
  response_date?: string | null; // readOnly ISO datetime
  driver_first_name: string;    // readOnly
  driver_last_name: string;     // readOnly
}

/** POST /api/v1/providers/reviews/ – writable fields */
export interface ReviewCreateRequest {
  request: number;
  rating: number;
  comment: string;
  response?: string | null;
}

/** PATCH /api/v1/providers/reviews/{id}/ */
export interface PatchedReview {
  request?: number;
  rating?: number;
  comment?: string;
  response?: string | null;
}

// ─── Service Requests ─────────────────────────────────────────────────────────

/** GET /api/v1/requests/ – list item shape */
export interface ServiceRequestList {
  id: number;                   // readOnly
  vehicle?: number | null;
  vehicle_name: string;         // readOnly
  service_type: string;
  description?: string;
  status: ServiceRequestStatus;
  dispatch_state: DispatchState;
  customer_first_name: string;  // readOnly
  customer_last_name: string;   // readOnly
  customer_phone: string;       // readOnly
  provider_first_name: string;  // readOnly
  provider_last_name: string;   // readOnly
  image?: string | null;
  image_url: string;            // readOnly
  latitude: string;             // decimal string
  longitude: string;            // decimal string
  address?: string;
  created_at: string;           // readOnly ISO datetime
}

/** GET /api/v1/requests/{id}/ – full detail shape */
export interface ServiceRequestDetail extends ServiceRequestList {
  customer: number;
  customer_email: string;       // readOnly
  provider?: number | null;
  provider_email: string;       // readOnly
  accepted_at?: string | null;
  completed_at?: string | null;
  cancelled_at?: string | null;
}

/** POST /api/v1/requests/ – request body */
export interface ServiceRequestCreateRequest {
  vehicle: number;
  service_type: string;
  description?: string;
  image?: string | null;
  latitude: string;
  longitude: string;
  address?: string;
}

/** POST /api/v1/requests/ – response body */
export interface ServiceRequestCreateResponse {
  id: number;                   // readOnly
  vehicle: number;
  vehicle_name: string;         // readOnly
  service_type: string;
  description?: string;
  image?: string | null;
  image_url: string;            // readOnly
  latitude: string;
  longitude: string;
  address?: string;
  status: ServiceRequestStatus; // readOnly
  dispatch_state: DispatchState;// readOnly
  created_at: string;           // readOnly
}

// ─── Vehicles ─────────────────────────────────────────────────────────────────

export interface VehicleImage {
  id: number;         // readOnly
  image: string;      // URI
  image_url: string;  // readOnly
  created_at: string; // readOnly
}

export interface Vehicle {
  id: number;                   // readOnly
  driver: number;               // readOnly
  brand: string;
  model_name: string;
  year: number;
  registration_number: string;
  color: string;
  vehicle_type: string;
  display_name: string;         // readOnly
  images: VehicleImage[];       // readOnly
  uploaded_images?: string[];   // writeOnly (URIs)
  created_at: string;           // readOnly
}

/** POST/PUT /api/v1/vehicles/ – writable fields */
export interface VehicleWriteRequest {
  brand: string;
  model_name: string;
  year: number;
  registration_number: string;
  color: string;
  vehicle_type: string;
  uploaded_images?: string[];
}

/** PATCH /api/v1/vehicles/{id}/ */
export interface PatchedVehicle {
  brand?: string;
  model_name?: string;
  year?: number;
  registration_number?: string;
  color?: string;
  vehicle_type?: string;
  uploaded_images?: string[];
}
