import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const response = await fetch(`http://211.188.52.63/api/term/${id}`, {
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
        message: '[GET] 약정 상세 불러오기에 성공했습니다.',
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
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { title, content } = await request.json();

    const targetUrl = `http://211.188.52.63/api/term/${id}`;


    const response = await fetch(targetUrl, {
      method: "PUT",
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
        message: '[PUT] 이용약관 수정에 성공하였습니다.',
        data: responseData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: '[PUT] 서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // 외부 API URL에 id를 포함시킵니다.
    const targetUrl = `http://211.188.52.63/api/term/terms/${id}`;

    const response = await fetch(targetUrl, {
      method: "DELETE",
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("External Server Error:", errorBody);
      throw new Error(JSON.stringify(errorBody));
    }

    const responseData = await response.json();
    return NextResponse.json(
      {
        message: '[DELETE] 이용약관 삭제에 성공하였습니다.',
        data: responseData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: '[DELETE] 서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}