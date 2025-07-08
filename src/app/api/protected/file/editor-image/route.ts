import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // 'upload_file' 키로 실제 파일이 있는지 확인 (400 에러의 주된 원인)
    const file = formData.get('upload_file');
    if (!file || !(file instanceof File)) {
      console.error("'upload_file' 키에 유효한 파일이 없습니다. 받은 값:", file);
      return NextResponse.json(
        { error: "'upload_file'이라는 키로 유효한 파일을 보내야 합니다." },
        { status: 400 }
      );
    }

    const response = await fetch('http://211.188.52.63/api/file/image-upload/', {
      method: 'POST',
      body: formData,
      // fetch에 FormData를 보낼 때는 Content-Type을 제거 해야함
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("외부 서버 에러 응답:", responseData);
      return NextResponse.json(responseData, { status: response.status });
    }

    // 백엔드 응답을 CKEditor가 요구하는 형식으로 변환
    const ckeditorResponse = {
      uploaded: 1,
      fileName: responseData.fileName,
      url: responseData.url,
      fullUrl: responseData.fullUrl,
    };

    return NextResponse.json(ckeditorResponse);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { uploaded: 0, error: { message: `[POST] 서버 내부 오류가 발생했습니다.` } },
      { status: 500 }
    );
  }
}
