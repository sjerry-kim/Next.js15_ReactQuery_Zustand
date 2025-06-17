// /api/auth/refresh/route.ts

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
  console.log('--- ✅ /api/auth/refresh API started ---');
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
      console.log('--- ❌ Step 1 FAILED: No refresh token in cookie ---');
      return NextResponse.json({ error: '인증 토큰이 없습니다.' }, { status: 401 });
    }
    console.log('--- ✅ Step 1: Found refresh token in cookie ---');

    let payload: TokenPayload;
    try {
      payload = verifyRefreshToken(refreshToken) as TokenPayload;
    } catch (e) {
      console.log('--- ❌ Step 2 FAILED: verifyRefreshToken failed ---', e);
      const response = NextResponse.json({ error: '토큰이 만료/유효하지 않음' }, { status: 401 });
      response.cookies.delete('refresh_token');
      return response;
    }
    console.log('--- ✅ Step 2: Refresh token is valid. UserID:', payload.userId, '---');

    console.log('--- ⏳ Step 3: Looking for token in DB... ---');
    const tokenInDb = await prisma.user_tokens.findUnique({
      where: { user_id: payload.userId },
    });

    if (!tokenInDb) {
      console.log('--- ❌ Step 3 FAILED: No token info in DB for user', payload.userId, '---');
      return NextResponse.json({ error: '서버에 토큰 정보가 없습니다.' }, { status: 401 });
    }
    console.log('--- ✅ Step 3: Found token info in DB ---');

    console.log('--- ⏳ Step 4: Comparing token hashes... ---');
    const isMatch = await bcrypt.compare(refreshToken, tokenInDb.refresh_token);

    if (!isMatch) {
      console.log('--- ❌ Step 4 FAILED: Token mismatch (hash compare failed) ---');
      await prisma.user_tokens.delete({ where: { user_id: payload.userId } });
      const response = NextResponse.json({ error: '토큰 불일치' }, { status: 401 });
      response.cookies.delete('refresh_token');
      return response;
    }
    console.log('--- ✅ Step 4: Token hash matched ---');

    console.log('--- ⏳ Step 5: Generating new tokens and updating DB... ---');
    const newPayload: TokenPayload = { userId: payload.userId, email: payload.email }; // email도 함께 전달
    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);
    const newHashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

    await prisma.user_tokens.update({
      where: { user_id: payload.userId },
      data: { refresh_token: newHashedRefreshToken },
    });
    console.log('--- ✅ Step 5: New token generated and DB updated ---');

    const response = NextResponse.json({ accessToken: newAccessToken });
    response.cookies.set('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 90,
      sameSite: 'strict',
    });

    console.log('--- ✅ /api/auth/refresh API finished successfully ---');
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