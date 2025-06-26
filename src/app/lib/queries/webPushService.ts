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
    let errorMessage = 'Failed to save subscription.';
    try {
      const errorBody = await response.json();
      // API 라우트에서 message 필드로 에러를 보내므로 errorBody.message를 확인합니다.
      errorMessage = errorBody.message || errorMessage;
    } catch (e) {
      // JSON 파싱 실패 시 기본 에러 메시지 사용
    }
    // 실패 시, 에러를 발생시켜 useMutation의 onError 콜백이 실행되도록 합니다.
    throw new Error(errorMessage);
  }

  return response.json();
};