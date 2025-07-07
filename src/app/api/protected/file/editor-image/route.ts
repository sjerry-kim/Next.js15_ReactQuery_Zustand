import { NextRequest, NextResponse } from 'next/server';

// 백엔드 개발자가 알려준 실제 업로드 URL
const BACKEND_UPLOAD_URL = 'http://211.188.52.63/api/file/image-upload/';

export async function POST(request: NextRequest) {
  // --- 1. API 라우트 진입 및 수신 헤더 확인 ---
  console.log("--- API 라우트 진입 ---");
  console.log("라우트가 받은 Content-Type:", request.headers.get('Content-Type'));

  try {
    // --- 2. FormData 파싱 및 내용 확인 ---
    const formData = await request.formData();
    console.log("서버가 받은 FormData의 모든 키:", Array.from(formData.keys()));

    // 'upload_file' 키로 실제 파일이 있는지 확인 (400 에러의 주된 원인)
    const file = formData.get('upload_file');
    if (!file || !(file instanceof File)) {
      console.error("'upload_file' 키에 유효한 파일이 없습니다. 받은 값:", file);
      return NextResponse.json(
        { error: "'upload_file'이라는 키로 유효한 파일을 보내야 합니다." },
        { status: 400 }
      );
    }

    // --- 3. 외부 서버로 요청 전송 ---
    console.log(`외부 서버로 POST 요청 전송: ${BACKEND_UPLOAD_URL}`);
    const response = await fetch(BACKEND_UPLOAD_URL, {
      method: 'POST',
      body: formData,
      // 중요: fetch에 FormData를 보낼 때는 Content-Type을 설정하지 않습니다.
    });

    // --- 4. 외부 서버 응답 확인 ---
    console.log(`외부 서버 응답 수신: status=${response.status}, ok=${response.ok}`);
    const responseData = await response.json();

    if (!response.ok) {
      console.error("외부 서버 에러 응답:", responseData);
      // 백엔드가 보낸 에러 상태와 메시지를 그대로 클라이언트에 전달
      return NextResponse.json(responseData, { status: response.status });
    }

    // --- 5. 최종 성공 응답 구성 및 반환 ---
    console.log("외부 서버 성공 응답:", responseData);
    // 백엔드 응답을 CKEditor가 요구하는 형식으로 변환합니다.
    const ckeditorResponse = {
      uploaded: 1,
      fileName: responseData.fileName, // 백엔드 응답에 fileName이 있다고 가정
      url: responseData.fullUrl,           // 백엔드 응답에 url이 있다고 가정
    };

    console.log("CKEditor로 최종 응답 전송:", ckeditorResponse);
    return NextResponse.json(ckeditorResponse);

  } catch (error) {
    console.error("API 라우트의 catch 블록에서 에러 발생:", error);
    return NextResponse.json(
      // @ts-ignore
      { uploaded: 0, error: { message: `파일 업로드 프록시 실패: ${error.message}` } },
      { status: 500 }
    );
  }
}
