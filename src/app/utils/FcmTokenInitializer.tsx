'use client';

import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useWebPushStore } from '@/zustand/webPushStore';
import { useUserStore } from '@/zustand/userStore';
import { requestPermissionAndGetToken } from '@/lib/firebase';
import { savePushSubscription } from '@/services/webPushService';
// import { deleteToken } from '@firebase/messaging';

/* ✅ 앱이 로드 될 때마다 Fcm토큰을 확인하고 갱신 & 브라우저의 권한 상태를 업데이트하는 컴포넌트 */
export default function FcmTokenInitializer() {
  const { isSubscribed, permission, fcmToken: storedToken, setFcmToken, setPermission, setIsSubscribed } = useWebPushStore();
  const { user } = useUserStore();

  const { mutate: updateToken } = useMutation({
    mutationFn: savePushSubscription,
    onSuccess: (data) => {
      console.log("구독 정보 저장이 성공했습니다:", data);
      setIsSubscribed(true);
    },
    onError: (error) => {
      console.error("[FcmTokenInitializer] 구독 정보 저장에 실패했습니다:", error);
      setIsSubscribed(false);
    },
  });

  useEffect(() => {
    // 1. 현재 브라우저의 실제 권한 상태를 가져와 스토어에 반영
    const currentPermission = Notification.permission;
    setPermission(currentPermission);

    if (!user) {
      return;
    }

    // 1. 사용자가 알림을 허용한 경우 -> 최초 구독 또는 토큰 갱신 로직을 수행
    if (currentPermission === 'granted') {
      const syncToken = async () => {
        try {
          const currentToken = await requestPermissionAndGetToken();
          // 새로 발급받은 토큰이 있고, 기존에 저장된 토큰과 다르다면 (최초 구독 또는 갱신)
          if (currentToken && currentToken !== storedToken) {
            console.log("새로운 FCM 토큰을 감지하여 서버에 저장합니다...");
            updateToken(currentToken);
            setFcmToken(currentToken);
          }
          console.log("기존의 FCM 토큰을 유지합니다...")
        } catch (error) {
          console.error("토큰 동기화 중 에러가 발생했습니다:", error);
        }
      };
      syncToken();
    }
    // 2. 사용자가 알림을 차단했거나 아직 결정하지 않은 경우 -> 우리 앱의 '구독중' 상태는 무조건 false여야함
    else {
      if (isSubscribed) {
        console.warn(`상태 불일치 감지! (앱: 구독중, 브라우저: ${currentPermission}). 구독 상태를 강제로 해제합니다.`);

        setIsSubscribed(false);
        setFcmToken(null);

        // TODO: 추후 서버에 구독 취소 API가 구현되면 아래 주석을 해제하여
        // DB에 남아있는 쓸모없는 토큰을 삭제하는 로직을 추가해야 합니다.
        /*
        if (storedToken) {
          removePushSubscription(storedToken);
        }
        if (messaging) {
          deleteToken(messaging);
        }
        */
      }
    }
  }, [user, permission]);

  return null;
}
