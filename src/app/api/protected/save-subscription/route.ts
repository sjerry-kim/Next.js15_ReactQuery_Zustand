import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { message: 'FCM token is required as a query parameter. (e.g., ?token=...)' },
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
        { message: 'Failed to subscribe on external server.', error: response },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: 'Subscription saved successfully (Test Mode).', data: response });

  } catch (error) {
    console.error('[API/protected/save-subscription] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}