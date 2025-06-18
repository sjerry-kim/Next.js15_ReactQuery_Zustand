import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyRefreshToken, TokenPayload } from '@/utils/jwt';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    // 1. 클라이언트로부터 refresh_token 쿠키를 가져옵니다.
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    // 응답 객체를 미리 생성합니다. 쿠키를 삭제하려면 이 객체가 필요합니다.
    const response = NextResponse.json({ message: '성공적으로 로그아웃되었습니다.' });

    // 2. 🚨 결정적 오류 수정: 쿠키 삭제는 Response 객체를 통해 이루어져야 합니다.
    // maxAge를 0 또는 음수로 설정하여 쿠키를 즉시 만료시킵니다.
    response.cookies.set('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false, // <- 개발환경에선 false
      path: '/',
      maxAge: 0, // 쿠키를 삭제하는 표준적인 방법
    });
    response.cookies.set('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false, // <- 개발환경에선 false
      path: '/',
      maxAge: 0, // 쿠키를 삭제하는 표준적인 방법
    });
    // response.cookies.delete('mini_token');

    // 3. 토큰이 없는 경우, 쿠키만 삭제하고 성공적으로 응답합니다.
    // 사용자는 이미 로그아웃된 상태나 마찬가지입니다.
    if (!refreshToken) {
      return response;
    }

    // 4. (서버 측 정리) DB에 저장된 토큰을 삭제하기 위해 토큰을 검증하고 userId를 추출합니다.
    // 💡 로직 개선: 이 과정이 실패하더라도 클라이언트의 쿠키는 이미 위에서 삭제 처리되었으므로
    // 사용자는 로그아웃됩니다. 이 부분은 서버의 데이터를 깔끔하게 정리하는 역할입니다.
    try {
      const payload = verifyRefreshToken(refreshToken) as TokenPayload;

      // 해당 유저의 토큰 정보를 DB에서 삭제합니다.
      await prisma.user_tokens.delete({
        where: { user_id: payload.userId },
      });

    } catch (error) {
      // 토큰이 만료되었거나 유효하지 않은 경우, DB 삭제는 건너뜁니다.
      // 어차피 유효하지 않은 토큰이므로 문제가 되지 않으며, 사용자는 이미 로그아웃 처리되었습니다.
      console.error('로그아웃 처리 중 유효하지 않은 토큰 확인:', (error as Error).message);
    }

    // 5. 최종적으로 쿠키가 삭제된 응답을 반환합니다.
    return response;

  } catch(error) {
    console.error('로그아웃 오류:', error);
    // 예기치 못한 서버 오류 발생 시
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}