import { NextResponse } from 'next/server';
import { mockConducteurs, mockPrestataires, getPopulatedDemandes } from '@/lib/mock-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.toLowerCase() || '';

    // Mock global search across three structured datasets
    let drivers = mockConducteurs.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    let providers = mockPrestataires.filter(p => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q));
    let requests = getPopulatedDemandes().filter(r => r.typePanne.toLowerCase().includes(q) || r.id.toLowerCase().includes(q));

    return NextResponse.json({
      success: true,
      data: {
        drivers,
        providers,
        requests
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Search failed" }, { status: 500 });
  }
}
