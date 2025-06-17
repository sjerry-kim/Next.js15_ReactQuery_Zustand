import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import {
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
} from '@/utils/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 사용자 인증
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }
    const { user } = authData;

    // JWT 토큰 생성
    const payload: TokenPayload = { userId: user.id, email: user.email! };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const newExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90);

    // DB 작업 병렬 처리 (성능 향상)
    //    - Refresh Token 저장과 Profile 정보 조회를 동시에 처리하여 대기 시간 감소
    const [tokenResult, profileResult] = await Promise.all([
      // 작업 1: Refresh Token 저장/업데이트
      prisma.user_tokens.upsert({
        where: { user_id: user.id },
        update: {
          refresh_token: hashedRefreshToken,
          expires_at: newExpiresAt,
        },
        create: {
          user_id: user.id,
          refresh_token: hashedRefreshToken,
          expires_at: newExpiresAt,
        },
      }),
      // 작업 2: Profile 정보 조회
      prisma.profile.findUnique({
        where: { user_id: user.id },
        select: { role: true, name: true },
      }),
    ]);

    // 데이터 정합성 에러 처리
    // - Supabase Auth에는 유저가 있지만, 우리 DB에 프로필이 없는 예외적인 경우 처리
    if (!profileResult) {
      // 이 경우, 보통 회원가입 절차에서 문제가 발생했을 가능성이 높습니다.
      // 에러 로그를 남겨 원인을 파악하고, 사용자에게는 일반적인 에러 메시지를 보냅니다.
      console.error(
        `[Login Error] User profile not found for user_id: ${user.id}`
      );
      return NextResponse.json(
        { error: '사용자 프로필을 찾을 수 없습니다. 관리자에게 문의하세요.' },
        { status: 500 }
      );
    }

    // 클라이언트에 전달할 사용자 데이터 조합
    // - signInWithPassword에서 반환된 user 객체의 정보를 최대한 활용
    const userData = {
      email: user.email,
      lastSignInAt: user.last_sign_in_at,
      createdAt: user.created_at,
      ...profileResult, // name, role 포함
    };

    // 최종 응답 생성
    const response = NextResponse.json({
      message: '로그인 성공',
      accessToken,
      expiresAt: tokenResult.expires_at, // 토큰 만료 시점
      user: userData,
    });

    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: tokenResult.expires_at, // maxAge 대신 명확한 만료 일자 설정
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