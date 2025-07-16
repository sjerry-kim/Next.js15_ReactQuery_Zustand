import { apiFetch } from '@/utils/apiFetch';

export async function getUser(id: string) {
  // const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/protected/my/${id}`;
  //
  // const response = await apiFetch(apiUrl);
  //
  // if (!response.ok) {
  //   let errorMessage = `서버 응답 오류: ${response.status}`;
  //   try {
  //     const errorBody = await response.json();
  //     errorMessage = errorBody.message || errorMessage;
  //   } catch (error) {
  //     // JSON 파싱 실패 시 기본 에러 메시지 사용
  //   }
  //   console.error("[myService]", errorMessage);
  //   throw new Error(errorMessage);
  // }
  //
  // return response.json();

  return { data: { userName: '사용자명'} };
}