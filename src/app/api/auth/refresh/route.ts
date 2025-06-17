import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  TokenPayload,
} from '@/utils/jwt';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: '인증 토큰이 없습니다.' }, { status: 401 });
    }

    let payload: TokenPayload;
    try {
      payload = verifyRefreshToken(refreshToken) as TokenPayload;
    } catch (e) {
      const response = NextResponse.json({ error: '토큰이 만료/유효하지 않음' }, { status: 401 });

      console.log(response);
      console.log("리프레시토큰 없앰");
      response.cookies.delete('refresh_token');
      return response;
    }

    const tokenInDb = await prisma.user_tokens.findUnique({
      where: { user_id: payload.userId },
    });

    if (!tokenInDb) {
      return NextResponse.json({ error: '서버에 토큰 정보가 없습니다.' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(refreshToken, tokenInDb.refresh_token);

    if (!isMatch) {
      await prisma.user_tokens.delete({ where: { user_id: payload.userId } });
      const response = NextResponse.json({ error: '토큰 불일치' }, { status: 401 });
      response.cookies.delete('refresh_token');
      return response;
    }

    const newPayload: TokenPayload = { userId: payload.userId, email: payload.email }; // email도 함께 전달
    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);
    const newHashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

    await prisma.user_tokens.update({
      where: { user_id: payload.userId },
      data: { refresh_token: newHashedRefreshToken },
    });

    const response = NextResponse.json({ accessToken: newAccessToken });
    response.cookies.set('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 90,
      sameSite: 'strict',
    });

    return response;

  } catch (error) {
    // 🔥 이 로그가 서버 터미널에 찍히는 내용이 결정적인 단서입니다!
    console.error('🔥 REFRESH API CRASHED:', error);
    return NextResponse.json(
      { error: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
