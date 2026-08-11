import { NextRequest, NextResponse } from 'next/server';
import { createLogoutCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json(
      { message: 'Logout bem-sucedido' },
      { status: 200 }
    );

    // Clear session cookie
    response.headers.set('Set-Cookie', createLogoutCookie());

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer logout. Tente novamente.' },
      { status: 500 }
    );
  }
}
