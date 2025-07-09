import { ImageListItem } from '@/types/files';
import { useSnackbar } from '@/hooks/useSnackbar';

/* ✅ 이미지 URL을 받아 사용자 컴퓨터에 파일을 다운로드시키는 함수 */
export const downloadImage = async (img: ImageListItem) => {
  const { showSnackbar } = useSnackbar();

  // 1. 다운로드할 URL이 없는 경우, 함수를 즉시 종료 (안전장치)
  if (!img.file_url) {
    console.error('다운로드할 이미지 URL이 없습니다.');
    return;
  }

  try {
    const isDev = process.env.NODE_ENV === 'development';
    const fetchUrl = isDev
      ? img.file_url.replace('https://api.moneyflag.kr', '') // 예: '/uploads/image.jpg'
      : img.file_url;

    // 2. fetch API를 사용해 이미지 URL로부터 파일 데이터를 요청
    // - mode: 'cors'는 다른 도메인(cross-origin)의 리소스에 접근하기 위해 필요할 수 있음
    const response = await fetch(fetchUrl, { mode: 'cors' });
    if (!response.ok) throw new Error('이미지 요청에 실패하였습니다.');

    // 3. 응답 본문을 Blob(Binary Large Object) 형태로 변환
    // ex) "blob:http://localhost:3000/a1b2-c3d4-e5f6"
    const blob = await response.blob();

    // 4. Blob 데이터를 가리키는 임시 URL을 브라우저 메모리에 생성
    const url = window.URL.createObjectURL(blob);

    // 5. 다운로드를 실행하기 위한 보이지 않는 <a> 태그를 동적으로 생성
    const a = document.createElement('a');
    a.href = url; // a 태그의 링크 주소로 임시 URL
    a.download = img.file_init_name || 'image.jpg'; // 다운로드될 파일의 이름을 지정

    // 6.생성한 a 태그를 문서에 추가하고, 프로그래밍 방식으로 클릭하여 다운로드를 실행
    document.body.appendChild(a);
    a.click();

    // 7. 다운로드 실행 후, 임시로 추가했던 a 태그를 문서에서 제거
    a.remove();

    // 8. 생성했던 임시 URL을 해제 (메모리 누수 방지)
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('[download]', err);
    showSnackbar( `이미지 다운로드 중 문제가 발생했습니다.`, 'warning');
  }
};