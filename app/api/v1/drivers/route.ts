import { NextResponse } from 'next/server';
import { mockConducteurs } from '@/lib/mock-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    // Simulate query pagination limit processing
    const total = mockConducteurs.length;
    const startIndex = (page - 1) * limit;
    const data = mockConducteurs.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      data,
      meta: {
        page,
        limit,
        total
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch drivers" }, { status: 500 });
  }
}
