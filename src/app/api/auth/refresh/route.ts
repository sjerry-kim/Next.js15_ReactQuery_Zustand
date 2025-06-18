import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  TokenPayload,
} from '@/utils/jwt';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest, res: NextResponse) {
  try {

    console.log("refresh api 탔음")
    // 1. 'next/headers'를 이용해 전체 쿠키 문자열 확인
    const headersList = await headers();
    const rawCookieHeader = headersList.get('cookie');
    console.log('Raw Cookie Header from next/headers:', rawCookieHeader);

    // 2. 'req' 객체를 이용해 확인 (App Router에서 권장되는 다른 방식)
    const rawCookieFromReq = req.headers.get('cookie');
    console.log('req 헤더:', req.headers);
    console.log('Raw Cookie Header from req:', rawCookieFromReq);

    // 3. 기존 방식
    const refreshToken = req.cookies.get('refresh_token')?.value;
    console.log('Parsed refresh_token from req.cookies:', refreshToken);
    console.log(refreshToken)
    console.log('1')
    if (!refreshToken) throw new Error('Refresh Token 쿠키가 없습니다.');
    console.log('2')

    const payload = await verifyRefreshToken(refreshToken);
    console.log('3')

    console.log(payload);

    const tokenInDb = await prisma.user_tokens.findUnique({ where: { user_id: payload.userId } });
    if (!tokenInDb) throw new Error('DB에 토큰 정보 없음');

    const isMatch = await bcrypt.compare(refreshToken, tokenInDb.refresh_token);
    if (!isMatch) throw new Error('토큰 불일치');

    const profile = await prisma.profile.findUnique({ where: { user_id: payload.userId }, select: { role: true } });
    if (!profile) throw new Error('프로필 정보 없음');

    const newPayload: TokenPayload = { ...payload, role: profile.role! };
    const [newAccessToken, newRefreshToken] = await Promise.all([
      generateAccessToken(newPayload),
      generateRefreshToken(newPayload)
    ]);
    const newHashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

    await prisma.user_tokens.update({
      where: { user_id: payload.userId },
      data: {
        refresh_token: newHashedRefreshToken,
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
      },
    });

    // ✅ 응답 생성: 본문 없이, 오직 쿠키만 설정하여 보냅니다.
    const response = NextResponse.json({ message: 'Tokens refreshed successfully' });

    console.log("토큰 재발급 성공!")

    // 새로운 Access Token을 쿠키에 설정
    response.cookies.set('access_token', newAccessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production' ? true : false, // <- 개발환경에선 false
      path: '/',
      maxAge: 60 * 5, // 5분
      // sameSite: 'strict',
      sameSite: 'lax',
    });

    // 새로운 Refresh Token도 쿠키에 설정 (토큰 교체)
    response.cookies.set('refresh_token', newRefreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production' ? true : false, // <- 개발환경에선 false
      path: '/',
      maxAge: 60 * 60 * 24 * 90, // 90일
      // sameSite: 'strict',
      sameSite: 'lax',
    });

    return response;

  } catch (error) {
    const response = NextResponse.json({ error: (error as Error).message }, { status: 401 });
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;
  }
}
