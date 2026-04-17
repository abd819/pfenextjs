import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Mock generic auth check
    if (email && password) {
      const token = "mocked-jwt-token-123456";
      
      const cookieStore = await cookies();
      cookieStore.set('awini_auth_token', token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });

      return NextResponse.json({
        success: true,
        data: { token, user: { name: "Admin", email } }
      });
    }

    return NextResponse.json({
      success: false,
      error: "Invalid credentials"
    }, { status: 401 });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
