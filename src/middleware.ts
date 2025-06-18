import { NextRequest, NextResponse } from 'next/server';
// 'jose'를 사용하는 verifyAccessToken을 임포트했다고 가정합니다.
import { verifyAccessToken, TokenPayload } from '@/utils/jwt';
import { PROTECTED_PATHS } from '@/lib/auth/menu-access';

// 'jose'를 사용하므로 'runtime' 설정은 필요 없습니다.
// 만약 'jsonwebtoken'을 계속 쓰신다면 'export const runtime = 'nodejs';'를 유지하세요.

export const config = {
  matcher: [
    '/api/protected/:path*',
    '/adm/:path*',
    '/mypage/:path*',
  ],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  try {
    // ✅ 헤더 대신, 요청에 자동으로 포함된 쿠키에서 토큰을 가져옵니다.
    const token = req.cookies.get('access_token')?.value;

    if (!token) {
      throw new Error('Access Token 쿠키를 찾을 수 없습니다.');
    }

    // 가져온 토큰을 검증합니다. (jose는 비동기)
    const payload = await verifyAccessToken(token);
    const { role } = payload;

    // 토큰에서 추출한 role에 따라 페이지 접근 권한 부여
    // '/api/protected'는 로그인 인증이 필요한 경로로, 페이지 접근과 관련없으므로 로그인한 유저라면 NextResponse.next()로 넘김
    if (pathname.startsWith('/api/protected')) {
      const allowedRoles = ['user', 'admin', 'super_admin'];
      if (!allowedRoles.includes(role)) {
        return NextResponse.json({ error: '접근 권한이 없습니다.' }, { status: 403 });
      }
      return NextResponse.next();
    }

    // 1. 경로를 길이 순으로 정렬하여, 가장 구체적인 경로가 먼저 오게 합니다.
    // 예: ['/adm/board', '/adm'] 순서로 바뀝니다.
    const sortedProtectedPaths = [...PROTECTED_PATHS].sort((a, b) => b.path.length - a.path.length);

    // 2. 'startsWith'로 검사하여 "해당 경로로 시작하는가?" 만을 명확하게 확인합니다.
    const matchedPath = sortedProtectedPaths.find(({ path }) => pathname.startsWith(path));

    if (matchedPath && !matchedPath.roles.includes(role)) {
      return NextResponse.redirect(new URL('/403', req.url));
    }

    return NextResponse.next();

  } catch (error) {
    // 인증 실패 시의 처리 로직은 그대로 유지합니다.
    const isApi = pathname.startsWith('/api/');

    if (isApi) {
      return NextResponse.json({ error: (error as Error).message }, { status: 401 });
    }

    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
}
