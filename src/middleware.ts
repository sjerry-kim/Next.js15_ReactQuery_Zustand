import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessTokenFromRequest } from '@/utils/jwt';

export const config = {
  matcher: '/api/protected/:path*',
};

export async function middleware (req: NextRequest) {
  try {
    await verifyAccessTokenFromRequest(req);
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware Auth Error:', (error as Error).message);

    // 클라이언트가 재발급을 시도할 수 있도록 명확한 401 코드를 반환합니다.
    return NextResponse.json(
      { error: (error as Error).message || 'Invalid Token' },
      { status: 401 }
    );
  }
}
