import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('awini_auth_token')?.value;

  if (token) {
    return NextResponse.json({
      success: true,
      data: { id: "ADMIN-1", name: "Admin Awini", role: "admin" }
    });
  }

  return NextResponse.json({
    success: false,
    error: "Unauthorized"
  }, { status: 401 });
}
