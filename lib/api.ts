// This service file abstracts data fetching, making it easy to replace mock data with actual backend API calls (e.g., fetch('/api/conducteurs')).

import { 
  mockConducteurs, 
  mockPrestataires, 
  mockSmsLogs, 
  mockEvaluations,
  mockLocations,
  getPopulatedDemandes,
  Conducteur,
  Prestataire,
  DemandeAssistance,
  MessageSMS,
  Evaluation,
  Localisation
} from "./mock-data";

// Artificial delay to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getConducteurs(): Promise<Conducteur[]> {
  await delay(200);
  return mockConducteurs;
}

export async function getPrestataires(): Promise<Prestataire[]> {
  await delay(200);
  return mockPrestataires;
}

export async function getDemandes(): Promise<any[]> {
  await delay(300);
  return getPopulatedDemandes();
}

export async function getSmsLogs(): Promise<MessageSMS[]> {
  await delay(100);
  return mockSmsLogs;
}

export async function getEvaluations(): Promise<Evaluation[]> {
  await delay(150);
  // Populate evaluations with their related Demande info for easier UI rendering
  const populated = getPopulatedDemandes();
  return mockEvaluations.map(ev => ({
    ...ev,
    demande: populated.find(d => d.id === ev.demandeId)
  }));
}

export async function getLocations(): Promise<Localisation[]> {
  await delay(100);
  return mockLocations;
}
