import { NextResponse, type NextRequest } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const response = await fetch('http://211.188.52.63/api/term', {
      method: "GET",
      headers: { 'Content-Type': 'application/json' },
    });

    // Prisma 없는 api 통신에서는 !response.ok가 필수
    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Detailed Server Error:", errorBody);
      throw new Error(JSON.stringify(errorBody));
    }

    const responseData = await response.json();
    return NextResponse.json(
      {
        message: '[GET] 약정 리스트 불러오기에 성공했습니다.',
        data: responseData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: '[GET] 서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
};

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { title, content } = await request.json();

    const response = await fetch('http://211.188.52.63/api/term', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });

    // Prisma 없는 api 통신에서는 !response.ok가 필수
    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Detailed Server Error:", errorBody);
      throw new Error(JSON.stringify(errorBody));
    }

    const responseData = await response.json();
    return NextResponse.json(
      {
        message: '[POST] 이용약관 등록에 성공하였습니다.',
        data: responseData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: '[POST] 서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
};