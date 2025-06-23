import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  TokenPayload,
} from '@/utils/jwt';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh Token 쿠키가 없습니다.' },
        { status: 401 }
      );
    }

    // 1. Refresh Token 검증
    const payload = await verifyRefreshToken(refreshToken);

    // 2. DB에 저장된 토큰과 비교하여 유효성 확인
    const tokenInDb = await prisma.user_tokens.findUnique({
      where: { user_id: payload.userId },
    });

    if (!tokenInDb) {
      throw new Error('DB에 토큰 정보가 없습니다. 재로그인이 필요합니다.');
    }

    const isMatch = await bcrypt.compare(refreshToken, tokenInDb.refresh_token);
    if (!isMatch) {
      throw new Error('Refresh Token이 일치하지 않습니다.');
    }

    // ✅ 변경점 1: 프로필 조회 시 유저 정보 복원을 위해 필요한 필드를 더 가져옵니다.
    const profile = await prisma.profile.findUnique({
      where: { user_id: payload.userId },
      select: { name: true, role: true }, // 예: name 필드 추가
    });

    if (!profile) {
      throw new Error('프로필 정보를 찾을 수 없습니다.');
    }

    // ✅ 변경점 2: 클라이언트에 전달할 사용자 데이터 조합
    const userData = {
      email: payload.email,
      name: profile.name,
      role: profile.role,
    };

    // 3. 새로운 토큰 생성
    const newPayload: TokenPayload = { ...payload, role: profile.role };
    const [newAccessToken, newRefreshToken] = await Promise.all([
      generateAccessToken(newPayload),
      generateRefreshToken(newPayload),
    ]);
    const newHashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

    // 4. DB에 새로운 Refresh Token 정보 업데이트
    await prisma.user_tokens.update({
      where: { user_id: payload.userId },
      data: {
        refresh_token: newHashedRefreshToken,
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
      },
    });

    // ✅ 변경점 3: 응답 생성 시, 새 accessToken과 user 정보를 JSON 본문에 포함
    const response = NextResponse.json({
      message: 'Tokens refreshed successfully',
      accessToken: newAccessToken,
      user: userData,
    });

    // ✅ 변경점 4: access_token 쿠키 설정 로직은 삭제합니다.

    // 5. 새로운 Refresh Token은 계속해서 HttpOnly 쿠키로 안전하게 교체
    response.cookies.set('refresh_token', newRefreshToken, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 90, // 90일
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    console.log('토큰 재발급 및 사용자 정보 반환 성공!');
    return response;

  } catch (error) {
    // 6. 에러 발생 시, 모든 쿠키를 삭제하고 401 응답
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Refresh API 에러:', errorMessage);

    const response = NextResponse.json({ error: errorMessage }, { status: 401 });
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;
  }
}
