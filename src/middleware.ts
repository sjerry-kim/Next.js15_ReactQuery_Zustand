import { verifyAccessToken, verifyRefreshToken } from '@/lib/jwt';
import {TokenPayload} from '@/types/next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { PROTECTED_PATHS } from '@/_auth/path-auth';

export const config = {
  matcher: [
    // 제외할 경로
    '/((?!api|_next/static|_next/image|favicon.ico|fonts|\\.well-known).*)',
    // 필수 경로
    '/api/protected/:path*',
    '/api//firebase-messaging-sw.js',
    '/adm/:path*',
    '/my/:path*',
  ],
};

// 로그인 페이지로 리디렉션하고 쿠키를 삭제하는 함수
function redirectToLogin(req: NextRequest) {
  // console.log(`[Middleware] 완전한 비로그인 상태. 로그아웃 & 로그인 페이지로 리디렉션: ${req.nextUrl.pathname}`);
  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('from', req.nextUrl.pathname);
  const response = NextResponse.redirect(loginUrl);

  // 유효하지 않은 토큰 쿠키 삭제
  response.cookies.delete('refresh_token');
  return response;
}

/* ✅ 인증이 필요한 api 요청, 페이지 경로가 지나가는 middleware */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 0. 메인페이지는 경로가 정확히 '/'일 때만 예외 처리
  if (pathname === '/') {
    return NextResponse.next();
  }

  // 1. matcher로 처리할 수 없는 경우를 대비한 명시적 제외 경로
  const PUBLIC_PREFIXES = [
    '/login',
    '/signup',
    '/public',
    '/_next',
    '/favicon.ico',
    '/fonts',
    '/error',
    '/404'
  ];

  if (PUBLIC_PREFIXES.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 2. 헤더에서 access_token를 get
  const authHeader = req.headers.get('Authorization');
  const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  let payload: TokenPayload | null = null; // 토큰이 있지만 유효하지 않은 경우, payload는 null로 유지됨

  // 3. Accesstoken 검증
  if (accessToken) {
    try {
      payload = await verifyAccessToken(accessToken);
    } catch (error) {
      console.error(`[Middleware] Accesstoken 검증 실패(만료 또는 위조-유효하지 않음-): ${(error as Error).message}`);
    }
  }

  // 4. payload (인증된 사용자 정보)가 없을 경우 (헤더에 accessToken이 없거나, 만료 혹은 위조-유효하지 않음-)
  if (!payload) {
    const isApiRoute = pathname.startsWith('/api/');

    // 4-1. API 요청에 대한 처리
    // 요청이 API 경로인 경우, 401 JSON 응답을 보냄 (apiFetch의 트리거되어 refresh api를 호출)
    if (isApiRoute) {
      // console.log(`[Middleware] Accesstoken 인증 실패. 경로: ${pathname}`);
      // 클라이언트의 apiFetch가 재발급을 시도하도록 401을 보냅니다.
      return NextResponse.json({ error: '인증이 필요하거나 Accesstoken이 만료되었습니다.' }, { status: 401 });
    }

    // 4-2. 페이지 요청에 대한 처리
    const refreshToken = req.cookies.get('refresh_token')?.value;

    // 4-2-1. Refreshtoken 마저 없을 시 로그아웃 처리
    if (!refreshToken) {
      return redirectToLogin(req);
    }

    // 4-2-2. Refreshtoken이 있는 경우
    try {
      // RefreshToken을 검증하여 payload(역할 정보 포함)를 얻어냄
      const rtPayload = await verifyRefreshToken(refreshToken);

      // 역할(Role) 기반 권한 체크를 수행
      // PROTECTED_PATHS를 길이 순으로 내림차순 정렬하여 가장 구체적인 경로부터 검사
      const sortedProtectedPaths = [...PROTECTED_PATHS].sort((a, b) => b.path.length - a.path.length);
      const matchedPath = sortedProtectedPaths.find(({ path }) => pathname.startsWith(path));

      if (matchedPath && !matchedPath.roles?.includes(rtPayload.role)) {
        // console.log(`[Middleware] 접근 거부 (RefreshToken 기반): ${rtPayload.email}(${rtPayload.role}) -> ${pathname}`);
        return NextResponse.redirect(new URL('/403', req.url));
      }

      // /adm -> /adm/dash 리디렉션
      if(pathname === "/adm") {
        return NextResponse.redirect(new URL('/adm/dash', req.url));
      }

      // 1차 권한 체크를 통과한 경우, 페이지 접근을 허용
      // 그 다음, 클라이언트의 AuthInitializer가 이후의 완전한 토큰 재발급을 처리함
      // console.log(`[Middleware] 페이지 접근 허용 (RefreshToken 기반): ${rtPayload.email} -> ${pathname}`);
      return NextResponse.next();

    } catch (error) {
      // RefreshToken 검증 자체에 실패한 경우, 로그아웃 처리
      console.error('[Middleware] Refreshtoken 검증 실패, 강제 로그아웃:', (error as Error).message);
      return redirectToLogin(req);
    }
  }

  // 5. payload (인증된 사용자 정보)가 있는 경우 (AccessToken 인증 성공)
  // role 기반 권한 체크
  if (pathname.startsWith('/api/protected')) {
    const allowedRoles = ['user', 'editor', 'manager', 'super_admin'];
    if (!allowedRoles.includes(payload.role)) {
      return NextResponse.json({ error: '접근 권한이 없습니다.' }, { status: 403 });
    }
  }

  // PROTECTED_PATHS를 길이 순으로 내림차순 정렬하여 가장 구체적인 경로부터 검사
  const sortedProtectedPaths = [...PROTECTED_PATHS].sort((a, b) => b.path.length - a.path.length);
  const matchedPath = sortedProtectedPaths.find(({ path }) => pathname.startsWith(path));


  if (matchedPath && !matchedPath.roles?.includes(payload.role)) {
    // console.log(`[Middleware] 접근 거부 : ${rtPayload.email}(${rtPayload.role}) -> ${pathname}`);
    return NextResponse.redirect(new URL('/403', req.url));
  }

  // /adm -> /adm/dash 리디렉션
  if(pathname === "/adm") {
    return NextResponse.redirect(new URL('/adm/dash', req.url));
  }

  // 6. 모든 검증 통과 시 요청 진행
  return NextResponse.next();
}