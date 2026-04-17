import { NextResponse } from 'next/server';
import { getPopulatedDemandes, mockConducteurs, mockPrestataires } from '@/lib/mock-data';

export async function GET() {
  try {
    const requests = getPopulatedDemandes();
    
    const totalUsers = mockConducteurs.length + mockPrestataires.length;
    const activeRequests = requests.filter(r => r.status === "pending" || r.status === "accepted").length;

    // Simulate structured chart data
    const chartData = [
      { name: "Mon", requests: 12 },
      { name: "Tue", requests: 19 },
      { name: "Wed", requests: 15 },
      { name: "Thu", requests: 22 },
      { name: "Fri", requests: 28 },
      { name: "Sat", requests: 35 },
      { name: "Sun", requests: 30 },
    ];

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: totalUsers + 12842, // Padding with realistic numbers
        totalDrivers: mockConducteurs.length + 842,
        activeRequests: activeRequests + 47,
        averageRating: 4.82,
        chartData,
        recentRequests: requests.slice(0, 5) // Send top 5 Recent
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to load dashboard stats" }, { status: 500 });
  }
}
