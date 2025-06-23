import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
} from '@/utils/jwt';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { PROTECTED_PATHS } from '@/lib/auth/menu-access';

export const config = {
  matcher: [
    '/api/protected/:path*', // API 보호
    '/adm/:path*', // API 보호
    '/my/:path*', // API 보호
  ],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 0. 인증 제외 경로 처리 필수
  const PUBLIC_PATHS = ['/login', '/signup', '/favicon.ico', '/public', '/_next/'];
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 1. 헤더에서 access_token, 쿠키에서 refresh_token 가져오기
  const authHeader = req.headers.get('Authorization');
  const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const refreshToken = req.cookies.get('refresh_token')?.value;

  let payload: TokenPayload | null = null;

  try {
    // 2. accessToken 유효성 검증 시도
    if (accessToken) {
      payload = await verifyAccessToken(accessToken);
    }
  } catch (err) {
    console.log('accessToken 만료 또는 에러:', err);
  }

  // 3. accessToken이 없거나 만료되었을 때 refreshToken으로 자동 로그인 시도
  // if (!payload && refreshToken) {
  //   try {
  //     // 3-1. refreshToken 검증 (서명과 유효기간)
  //     const rtPayload = await verifyRefreshToken(refreshToken);
  //
  //     // 3-2. DB에서 해당 유저의 refreshToken 저장 기록 조회
  //     const dbToken = await prisma.user_tokens.findUnique({
  //       where: { user_id: rtPayload.userId },
  //     });
  //
  //     const now = new Date();
  //
  //     // 3-3. DB에 저장된 토큰이 있고, 만료되지 않았으며,
  //     //      클라이언트에서 받은 refreshToken과 해시 비교가 성공해야 유효
  //     const isRtValid =
  //       dbToken &&
  //       dbToken.expires_at > now &&
  //       (await bcrypt.compare(refreshToken, dbToken.refresh_token));
  //
  //     if (!isRtValid) throw new Error('유효하지 않은 refreshToken');
  //
  //     // 3-4. 자동 로그인 성공 → 토큰 payload 갱신
  //     payload = {
  //       userId: rtPayload.userId,
  //       email: rtPayload.email,
  //       role: rtPayload.role,
  //     };
  //
  //     // 3-5. 새로운 accessToken, refreshToken 생성 및 만료시간 계산
  //     const newAccessToken = await generateAccessToken(payload);
  //     const newRefreshToken = await generateRefreshToken(payload);
  //     const newExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90); // 90일 후
  //
  //     // 3-6. DB에 새 refreshToken 해시와 만료시간 업데이트
  //     await prisma.user_tokens.update({
  //       where: { user_id: rtPayload.userId },
  //       data: {
  //         refresh_token: await bcrypt.hash(newRefreshToken, 10),
  //         expires_at: newExpiresAt,
  //       },
  //     });
  //
  //     // 3-7. 클라이언트 쿠키에 새 토큰 세팅 (httpOnly, secure, maxAge 등 설정)
  //     const res = NextResponse.next();
  //     res.cookies.set('access_token', newAccessToken, {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === 'production',
  //       path: '/',
  //       // maxAge: 60 * 5, // 5분
  //       maxAge: 60 * 1, // 1분
  //       sameSite: 'strict',
  //     });
  //     res.cookies.set('refresh_token', newRefreshToken, {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === 'production',
  //       path: '/',
  //       // maxAge: 60 * 60 * 24 * 90, // 90일
  //       maxAge: 60 * 1.5, // 1분 30초
  //       sameSite: 'strict',
  //     });
  //
  //     console.log("At, Rt 재발급 성공!")
  //
  //     // 3-8. 자동 로그인 성공 후 요청 계속 진행
  //     return res;
  //   } catch (err) {
  //     // 3-9. refreshToken 검증 실패 시 로그인 페이지로 리다이렉트
  //     console.log('refreshToken 재로그인 실패:', err);
  //
  //     const res = NextResponse.redirect(new URL('/login', req.url));
  //     // 쿠키 제거
  //     res.cookies.set('access_token', '', { maxAge: 0, path: '/' });
  //     res.cookies.set('refresh_token', '', { maxAge: 0, path: '/' });
  //     return res;
  //   }
  // }

  // if (!payload && refreshToken) {
  //   // refresh_token이 있다면 → /api/auth/refresh 로 리다이렉트
  //   const refreshUrl = new URL('/api/auth/refresh', req.url);
  //   refreshUrl.searchParams.set('from', pathname);
  //   return NextResponse.redirect(refreshUrl);
  // }

  if (!payload && refreshToken) {

    console.log('accessToken이 없거나 만료')

    // 자동 재로그인은 클라이언트가 처리
    return NextResponse.next(); // 그대로 진행
  }


  // 4. payload가 없다면 로그인 필요 처리
  if (!payload) {
    const isApi = pathname.startsWith('/api/');
    if (isApi) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. role 기반 권한 체크

  // - /api/protected 경로는 별도 처리
  if (pathname.startsWith('/api/protected')) {
    const allowedRoles = ['user', 'editor', 'manager', 'super_admin'];
    if (!allowedRoles.includes(payload.role)) {
      return NextResponse.json({ error: '접근 권한이 없습니다.' }, { status: 403 });
    }
    return NextResponse.next();
  }

  // - PROTECTED_PATHS를 길이 순으로 내림차순 정렬하여 가장 구체적인 경로부터 검사
  const sortedProtectedPaths = [...PROTECTED_PATHS].sort((a, b) => b.path.length - a.path.length);
  const matchedPath = sortedProtectedPaths.find(({ path }) => pathname.startsWith(path));

  // 권한 없는 경우 403 페이지로 리디렉션
  if (matchedPath && !matchedPath.roles.includes(payload.role)) {
    return NextResponse.redirect(new URL('/403', req.url));
  }

  // 6. 모든 검증 통과 시 요청 진행
  return NextResponse.next();
}
