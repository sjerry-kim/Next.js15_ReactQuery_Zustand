import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: NextRequest) {
  try {
    // 1. 인증 및 권한 확인 (관리자만 허용)
    const authHeader = (await headers()).get('Authorization'); // headers()는 await이 필요 없습니다.
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'Authorization token not found' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, SECRET_KEY);
    const userRole = payload.role as string;
    const allowedRoles = ['manager', 'super_admin'];

    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json({ message: 'Forbidden: Administrator access required.' }, { status: 403 });
    }

    // 2. POST 요청의 본문(body)에서 데이터를 추출합니다. 이제 이 코드는 정상적으로 동작합니다.
    const body = await request.json();
    const {
      token: fcmToken,
      title,
      content,
      link_type,
      link_name,
      link_idx,
    } = body;

    // 3. 필수 파라미터 검증
    if (!fcmToken || !title || !content) {
      return NextResponse.json(
        { message: 'Request body must include token, title, and content.' },
        { status: 400 }
      );
    }

    // 4. 외부 백엔드 API URL 구성
    const externalBackendUrl = process.env.EXTERNAL_BACKEND_URL;
    if (!externalBackendUrl) {
      throw new Error("EXTERNAL_BACKEND_URL is not configured in .env");
    }

    const targetUrl = new URL(`${externalBackendUrl}/lemon_crew_fcm_test`);

    // 외부 서버가 쿼리 파라미터를 요구하므로, 받은 데이터를 파라미터로 추가합니다.
    targetUrl.searchParams.append('token', fcmToken);
    targetUrl.searchParams.append('title', title);
    targetUrl.searchParams.append('content', content);
    if (link_type) targetUrl.searchParams.append('link_type', link_type);
    if (link_name) targetUrl.searchParams.append('link_name', link_name);
    if (link_idx) targetUrl.searchParams.append('link_idx', String(link_idx));

    // 5. 외부 API 호출
    const response = await fetch(targetUrl.toString(), {
      method: 'POST', // 외부 서버가 요구하는 메소드
    });

    // 6. 외부 API 응답을 클라이언트에 전달
    const responseData = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { message: 'External server returned an error.', error: responseData },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: 'Test push request sent successfully.', data: responseData });

  } catch (error) {
    // console.error 로그의 경로를 파일명과 일치시켰습니다.
    console.error('[API/protected/send-test-push] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
