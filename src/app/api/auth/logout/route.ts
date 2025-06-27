import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken } from '@/lib/jwt';
import prisma from '@/lib/prisma';
import {TokenPayload} from '@/types/next-auth';

export async function POST(req: NextRequest) {
  try {
    // 0. refresh_token 쿠키 get
    const refreshToken = req.cookies.get('refresh_token')?.value;

    // 2. 서버 측 정리 작업
    // 이 작업은 클라이언트의 로그아웃 성공 여부와는 독립적으로, 서버의 데이터를 깔끔하게 유지하기 위한 것
    if (refreshToken) {
      try {
        const payload = await verifyRefreshToken(refreshToken) as TokenPayload;

        // 해당 유저의 토큰 정보를 DB에서 삭제
        // findUnique + delete 대신 deleteMany를 사용하면 토큰이 없어도 에러를 발생시키지 않아 더 안정적
        await prisma.user_tokens.deleteMany({
          where: { user_id: payload.userId },
        });
      } catch (error) {
        // 이 catch 블록은 서버 측 정리 작업 중 발생하는 에러만 처리
        // 예를 들어, 받은 토큰이 만료되었거나 유효하지 않으면 verifyRefreshToken에서 에러가 발생함
        // 하지만 이 경우에도 클라이언트의 로그아웃(쿠키 삭제)은 정상적으로 진행되어야 함
        // 여기서는 에러를 로깅만 하고 무시함
        console.warn('로그아웃 시 서버 토큰 정리 중 에러 발생 (클라이언트 로그아웃은 정상 진행됨):', (error as Error).message);
      }
    }

    // 3. 클라이언트에게 보낼 최종 응답을 생성
    const response = NextResponse.json({ message: '성공적으로 로그아웃되었습니다.' });

    // 4. 클라이언트의 쿠키를 삭제
    response.cookies.set('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    });

    // 이후 클라이언트에서 zustand의 Accesstoken 및 유저 정보를 제거
    return response;
  } catch (error) {
    // todo 에러처리
    console.error('[Logout] 예기치 못한 서버 오류:', error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}