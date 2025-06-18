import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import {
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
} from '@/utils/jwt'; // ✅ jose를 사용하는 비동기 함수들
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 1. Supabase를 통한 사용자 인증
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }
    const { user } = authData;

    // 2. 역할(role) 정보를 가져오기 위해 프로필 조회
    const profileResult = await prisma.profile.findUnique({
      where: { user_id: user.id },
      select: { role: true, name: true },
    });

    if (!profileResult) {
      console.error(`[Login Error] User profile not found for user_id: ${user.id}`);
      return NextResponse.json(
        { error: '사용자 프로필을 찾을 수 없습니다. 관리자에게 문의하세요.' },
        { status: 500 }
      );
    }

    // 3. 토큰 생성을 위한 payload 구성 (역할 정보 포함)
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email!,
      role: profileResult.role!,
    };

    // 4. ✅ jose 함수는 비동기이므로, await을 사용하여 토큰 생성
    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90);

    // 5. ✅ DB 작업을 한 번의 'upsert'로 효율적으로 처리
    await prisma.user_tokens.upsert({
      where: { user_id: user.id },
      update: {
        refresh_token: hashedRefreshToken,
        expires_at: expiresAt,
      },
      create: {
        user_id: user.id,
        refresh_token: hashedRefreshToken,
        expires_at: expiresAt,
      },
    });

    // 6. 클라이언트에 전달할 사용자 데이터 조합
    const userData = {
      email: user.email,
      lastSignInAt: user.last_sign_in_at,
      createdAt: user.created_at,
      ...profileResult, // name, role 포함
    };

    // 7. 최종 응답 생성
    // 💡 Access Token은 이제 쿠키로 전달되므로, 본문에서는 제외합니다.
    const response = NextResponse.json({
      message: '로그인 성공',
      user: userData,
    });

    // 8. 두 토큰을 모두 안전한 HttpOnly 쿠키에 설정
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 5, // 5분
      sameSite: 'strict',
    });

    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 90, // 90일
      sameSite: 'strict',
    });

    return response;

  } catch (err) {
    console.error('로그인 API 처리 중 예외 발생:', err);
    return NextResponse.json(
      { error: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
