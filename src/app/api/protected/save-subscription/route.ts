import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { message: '[GET] FCM 토큰이 쿼리 파라미터로 필요합니다. (e.g., ?token=...)' },
        { status: 400 }
      );
    }

    const targetUrl = new URL(`https://mockup.moneyflag.kr/api/lemon_crew_fcm_test`);
    targetUrl.searchParams.append('token', token);

    const response = await fetch(targetUrl.toString(), { method: 'GET', });

    // ! 현재 리턴이 json이 아님 -> 주석 처리
    // const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          message: '[GET] 외부 서버에 구독 요청을 보내는 데 실패했습니다.',
          error: response
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: '[GET] 구독이 성공적으로 저장되었습니다. (Test Mode).',
      data: response }
    );
  } catch (error) {
    console.error('[API/protected/save-subscription] Error:', error);
    return NextResponse.json(
      { message: '[GET] 통신 오류가 발생하였습니다.' },
      { status: 500 }
    );
  }
}