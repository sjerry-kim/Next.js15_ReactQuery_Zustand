import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<Response> {
  try {
    const { title, content } = await request.json();

    const response = await fetch('https://mockup.moneyflag.kr/api/lemon_crew_fcm_test',
      {
        method: "POST",
        body: JSON.stringify({ title, content })}
    );

    return NextResponse.json(
      { message: '[POST] 이용약관 등록에 성공하였습니다.', userId: response },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: '[POST] 서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}