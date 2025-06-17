import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  TokenPayload,
} from '@/utils/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  try {
    // 1. 쿠키에서 refresh_token 가져오기
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: '인증 토큰이 없습니다.' }, { status: 401 });
    }

    // 2. refreshToken 유효성 검사 (lib/jwt 함수 사용)
    let payload: TokenPayload;
    try {
      payload = verifyRefreshToken(refreshToken) as TokenPayload;
    } catch (e) {
      // 만료되었거나 서명이 유효하지 않은 토큰
      const response = NextResponse.json(
        { error: '토큰이 만료되었거나 유효하지 않습니다.' },
        { status: 401 }
      );
      response.cookies.delete('refresh_token'); // 클라이언트의 잘못된 쿠키는 삭제
      return response;
    }

    // 3. DB에서 토큰 조회 및 해시 값 비교
    const tokenInDb = await prisma.user_tokens.findUnique({
      where: { user_id: payload.userId },
    });

    if (!tokenInDb) {
      return NextResponse.json({ error: '서버에 토큰 정보가 없습니다. 다시 로그인해주세요.' }, { status: 401 });
    }

    // ✅ [가장 중요] 원본 토큰과 DB의 해시값을 비교
    const isMatch = await bcrypt.compare(refreshToken, tokenInDb.refresh_token);

    if (!isMatch) {
      // 토큰 불일치. 탈취 시도일 수 있으므로 DB의 토큰을 삭제하고 강제 로그아웃 처리
      await prisma.user_tokens.delete({ where: { user_id: payload.userId } });
      const response = NextResponse.json({ error: '토큰이 일치하지 않습니다.' }, { status: 401 });
      response.cookies.delete('refresh_token');
      return response;
    }

    // 4. ✅ [슬라이딩 세션] 새로운 Access Token과 '새로운 Refresh Token'을 발급 (Refresh Token Rotation)
    const newPayload: TokenPayload = { userId: payload.userId };
    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);
    const newHashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

    // 5. DB에 새로 발급한 '해싱된' Refresh Token으로 업데이트
    await prisma.user_tokens.update({
      where: { user_id: payload.userId },
      data: {
        refresh_token: newHashedRefreshToken,
      },
    });

    // 6. 응답 생성
    const response = NextResponse.json({ accessToken: newAccessToken });

    // 7. '새로운' Refresh Token을 쿠키에 설정
    response.cookies.set('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 90, // 90일로 유효기간 재설정
      sameSite: 'strict',
    });

    return response;

  } catch (error) {
    console.error('토큰 재발급 오류:', error);
    return NextResponse.json(
      { error: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}