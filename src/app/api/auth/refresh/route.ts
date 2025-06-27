import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@/lib/jwt';
import prisma from '@/lib/prisma';
import {TokenPayload} from '@/types/next-auth';

/* ✅ Refreshtoken 검증 후, Accesstoken과 Refreshtoken을 재발급 받는 refresh api */
export async function POST(req: NextRequest) {
  try {
    // 0. 쿠키에서 Refreshtoken 가져옴
    const refreshToken = req.cookies.get('refresh_token')?.value;

    // 1. Refreshtoken이 없을 경우, apiFetch의 catch에서 로그아웃 처리 됨
    if (!refreshToken) {
      return NextResponse.json(
        { error: '[Refresh] Refresh Token이 존재하지 않습니다.' },
        { status: 401 }
      );
    }

    // 2. Refresh Token 검증
    const payload = await verifyRefreshToken(refreshToken);

    // 3. DB에 저장된 토큰과 비교하여 유효성 확인
    const tokenInDb = await prisma.user_tokens.findUnique({
      where: { user_id: payload.userId },
    });

    // 4. Refreshtoken 정보가 DB와 불일치할 경우, apiFetch의 catch에서 로그아웃 처리 됨
    if (!tokenInDb) throw new Error('[Refresh] DB에 토큰 정보가 없습니다.');

    // 5. bcrypt를 사용하여 해싱되어 저장된 DB의 Refreshtoken과 현재 가지고 있는 Refeshtoken이 일치하는지 확인
    const isMatch = await bcrypt.compare(refreshToken, tokenInDb.refresh_token);
    if (!isMatch) throw new Error("[Refresh] Refreshtoken이 일치하지 않습니다.");


    /* --- 현재 로그인한 유저 세션 복원 (Silent Refresh) --- */

    // 6. 현재 로그인한 유저 프로필 조회 및 userData 생성
    // Silent Refresh(조용한 재발급)를 위한 사용자 정보 조회 단계
    // 유저가 페이지를 새로고침하면 클라이언트의 유저 정보(이름, 역할 등)가 사라짐 ->
    // 따라서 DB의 최신 프로필 정보를 다시 조회해서 보내줘야 클라이언트의 UI 상태를 완벽하게 복원할 수 있음
    const profileAndUser = await prisma.profile.findUnique({
      where: { user_id: payload.userId },
      select: {
        name: true,
        role: true,
        users: {
          select: {
            created_at: true,
            last_sign_in_at: true,
          }
        }
      },
    });

    if (!profileAndUser || !profileAndUser.users) throw new Error('[Refresh] 프로필 또는 사용자 정보를 찾을 수 없습니다.');

    const userData = {
      email: payload.email, // email은 토큰 페이로드에서
      lastSignInAt: profileAndUser.users.last_sign_in_at,
      createdAt: profileAndUser.users.created_at,
      name: profileAndUser.name,
      role: profileAndUser.role,
    };

    // 7. 새로운 토큰 생성
    // accessToken이 zustand에서 날아갈 때(보통 새로고침한 경우), Accesstoken & Refreshtoken 모두 새로 발급 받음
    // DB에서 조회한 최신 역할(role) 정보를 포함함
    const newPayload: TokenPayload = { ...payload, role: profileAndUser.role! };

    // 8. 보안 강화를 위한 '토큰 순환(Token Rotation)'을 실행
    // Accesstoken뿐만 아니라 Refreshtoken도 새롭게 발급
    // 이렇게 하면 한번 사용된 Refreshtoken은 즉시 무효화되어 재사용 공격을 방지할 수 있음
    const [newAccessToken, newRefreshToken] = await Promise.all([
      generateAccessToken(newPayload),
      generateRefreshToken(newPayload),
    ]);

    // 새로 발급된 Refresh Token을 DB에 저장하기 위해 해싱
    const newHashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90);

    // 9. DB에 새로운 Refresh Token 정보 업데이트
    // 이를 통해 이전에 사용된 토큰(혹은 탈취되었을 수 있는 토큰)을 완전히 무효화시킴
    await prisma.user_tokens.update({
      where: { user_id: payload.userId },
      data: {
        refresh_token: newHashedRefreshToken,
        expires_at: expiresAt,
      },
    });

    // 10. 최종 응답 생성
    // 새로 발급된 `accessToken`과 `user` 정보는 클라이언트의 메모리(Zustand)에 저장될 수 있도록 JSON 본문에 담아 전달
    const response = NextResponse.json({
      message: '[Refresh] Tokens refreshed successfully',
      accessToken: newAccessToken,
      user: userData,
    });

    // 11. 새로운 Refreshtoken은 계속해서 HttpOnly 쿠키로 안전하게 교체
    response.cookies.set('refresh_token', newRefreshToken, {
      httpOnly: true, // JavaScript가 접근할 수 없음
      secure: process.env.NODE_ENV === 'production' ? true : false, // <- 개발환경에선 false
      path: '/',
      maxAge: 60 * 60 * 24 * 90, // 90일
      // maxAge: 45, // 1분 30초 - 테스트용
      // sameSite: 'strict',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    // 12. 에러 발생 시, 모든 쿠키를 삭제하고 401 응답
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Refresh]', errorMessage);

    const response = NextResponse.json({ error: errorMessage }, { status: 401 });
    response.cookies.delete('refresh_token');
    return response;
  }
}
