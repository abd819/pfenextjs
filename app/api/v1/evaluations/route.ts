import { NextResponse } from 'next/server';
import { mockEvaluations, getPopulatedDemandes } from '@/lib/mock-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    // Populate
    const populatedReqs = getPopulatedDemandes();
    const parsed = mockEvaluations.map(ev => ({
      ...ev,
      demande: populatedReqs.find(d => d.id === ev.demandeId)
    }));

    const total = parsed.length;
    const startIndex = (page - 1) * limit;
    const data = parsed.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      data,
      meta: { page, limit, total }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch evaluations" }, { status: 500 });
  }
}
