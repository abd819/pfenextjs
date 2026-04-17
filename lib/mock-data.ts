export type UserRole = "Admin" | "Driver" | "Provider";
export type UserStatus = "active" | "inactive" | "suspended";

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface Conducteur extends User {
  role: "Driver";
  licenseNumber: string;
  canRequestAssistance: boolean;
}

export interface Prestataire extends User {
  role: "Provider";
  availability: boolean;
  rating: number;
  serviceZone: string;
  numberOfInterventions: number;
}

export type RequestStatus = "pending" | "accepted" | "completed" | "cancelled";
export type RequestPriority = "high" | "normal" | "low";
export type RequestChannel = "App" | "SMS";

export interface DemandeAssistance {
  id: string;
  typePanne: string; // e.g., 'Flat Tire', 'Battery', 'Engine', 'Accident'
  description: string;
  status: RequestStatus;
  priority: RequestPriority;
  channel: RequestChannel;
  dateCreation: string; // ISO String
  dateDebut?: string;
  dateFin?: string;
  conducteurId: string;
  prestataireId?: string;
  locationId: string;
}

export interface Localisation {
  id: string;
  latitude: number;
  longitude: number;
  city: string;
}

export interface MessageSMS {
  id: string;
  phoneNumber: string;
  content: string;
  status: "sent" | "delivered" | "failed";
  sentAt: string;
}

export interface Evaluation {
  id: string;
  rating: number; // 1-5
  comment?: string;
  response?: string;
  createdAt: string;
  demandeId: string;
}

// ---- MOCK DATA GENERATION ----

export const mockConducteurs: Conducteur[] = [
  { id: "D1", name: "Ahmed Mansour", phone: "+966500000001", email: "ahmed@example.com", role: "Driver", status: "active", licenseNumber: "SA-123456", canRequestAssistance: true },
  { id: "D2", name: "Sara Al-Fahad", phone: "+966500000002", email: "sara@example.com", role: "Driver", status: "active", licenseNumber: "SA-654321", canRequestAssistance: true },
  { id: "D3", name: "Khalid Tariq", phone: "+966500000003", email: "khalid@example.com", role: "Driver", status: "active", licenseNumber: "SA-987654", canRequestAssistance: false },
  { id: "D4", name: "Nour Al-Huda", phone: "+966500000004", email: "nour@example.com", role: "Driver", status: "suspended", licenseNumber: "SA-112233", canRequestAssistance: false },
];

export const mockPrestataires: Prestataire[] = [
  { id: "P1", name: "Awini Towing Services", phone: "+966500000010", email: "tow1@awini.com", role: "Provider", status: "active", availability: true, rating: 4.8, serviceZone: "Riyadh", numberOfInterventions: 342 },
  { id: "P2", name: "QuickFix Auto", phone: "+966500000011", email: "quickfix@awini.com", role: "Provider", status: "active", availability: false, rating: 4.5, serviceZone: "Jeddah", numberOfInterventions: 128 },
  { id: "P3", name: "Al-Riyadh Recovery", phone: "+966500000012", email: "recovery@awini.com", role: "Provider", status: "active", availability: true, rating: 4.9, serviceZone: "Riyadh", numberOfInterventions: 890 },
];

export const mockLocations: Localisation[] = [
  { id: "L1", latitude: 24.7136, longitude: 46.6753, city: "Riyadh" },
  { id: "L2", latitude: 21.4858, longitude: 39.1925, city: "Jeddah" },
  { id: "L3", latitude: 26.4207, longitude: 50.0888, city: "Dammam" },
];

export const mockDemandes: DemandeAssistance[] = [
  {
    id: "REQ-001",
    typePanne: "Flat Tire",
    description: "Front left tire exploded on King Fahd Road.",
    status: "pending",
    priority: "high",
    channel: "App",
    dateCreation: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    conducteurId: "D1",
    locationId: "L1",
  },
  {
    id: "REQ-002",
    typePanne: "Battery Dead",
    description: "Car won't start in basement parking.",
    status: "accepted",
    priority: "normal",
    channel: "SMS",
    dateCreation: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    dateDebut: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    conducteurId: "D2",
    prestataireId: "P1",
    locationId: "L2"
  },
  {
    id: "REQ-003",
    typePanne: "Engine Overheating",
    description: "Smoke coming out of the hood.",
    status: "completed",
    priority: "high",
    channel: "App",
    dateCreation: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    dateDebut: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    dateFin: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    conducteurId: "D3",
    prestataireId: "P3",
    locationId: "L3"
  }
];

export const mockSmsLogs: MessageSMS[] = [
  { id: "SMS-1", phoneNumber: "+966500000001", content: "Awini: Your driver is arriving in 5 mins.", status: "delivered", sentAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { id: "SMS-2", phoneNumber: "+966500000002", content: "Awini Request R-002: Please confirm location.", status: "sent", sentAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  { id: "SMS-3", phoneNumber: "+966500000003", content: "Awini Offline Fallback: Location failed", status: "failed", sentAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
];

export const mockEvaluations: Evaluation[] = [
  { id: "EV-1", rating: 5, comment: "Very fast service, thanks! They brought the battery quickly.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), demandeId: "REQ-003" },
  { id: "EV-2", rating: 4, comment: "Good service but took a bit longer due to traffic.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), demandeId: "REQ-002" },
];

// Helper to fully populate a request for UI viewing
export const getPopulatedDemandes = () => {
  return mockDemandes.map(req => ({
    ...req,
    conducteur: mockConducteurs.find(c => c.id === req.conducteurId),
    prestataire: req.prestataireId ? mockPrestataires.find(p => p.id === req.prestataireId) : null,
    location: mockLocations.find(l => l.id === req.locationId)
  }));
};
