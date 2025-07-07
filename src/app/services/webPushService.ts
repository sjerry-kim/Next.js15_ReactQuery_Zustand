import { apiFetch } from '@/utils/apiFetch';

export const savePushSubscription  = async (fcmToken: string) => {
  const apiUrl = '/api/protected/save-subscription';
  const params = { token: fcmToken, };
  const options = {
    method: 'GET',
    params: params,
  };

  const response = await apiFetch(apiUrl, options);

  if (!response.ok) {
    let errorMessage = `서버 응답 오류: ${response.status}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorMessage;
    } catch (e) {
      // JSON 파싱 실패 시 기본 에러 메시지 사용
    }
    // 실패 시, 에러를 발생시켜 useMutation의 onError 콜백이 실행되도록 함
    console.error("[webPushService]", errorMessage);
    throw new Error(errorMessage);
  }

  return response.json();
};