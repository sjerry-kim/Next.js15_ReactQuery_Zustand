import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessTokenFromRequest } from '@/utils/jwt';

export const config = {
  /*
   * /api/protected/ 로 시작하는 모든 경로에서만 미들웨어를 실행합니다.
   * 이렇게 하면 /api/auth/... 나 /api/public/... 경로는
   * 이 미들웨어의 영향을 전혀 받지 않게 됩니다.
   */
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