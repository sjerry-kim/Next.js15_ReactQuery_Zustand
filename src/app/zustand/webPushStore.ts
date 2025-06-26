import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type NotificationState = {
  // 'permission': 현재 브라우저의 알림 권한 상태
  permission: NotificationPermission | 'default';
  // 'isSubscribed': 서버에 사용자의 FCM 토큰이 성공적으로 저장되었는지 여부를 저장
  isSubscribed: boolean;
  // 'setPermission': permission 상태를 업데이트
  setPermission: (permission: NotificationPermission) => void;
  // 'setIsSubscribed': isSubscribed 상태를 업데이트
  setIsSubscribed: (isSubscribed: boolean) => void;
};

export const useNotificationStore = create<NotificationState>()(
  // persist 미들웨어로 스토어 생성 로직을 감싸줍니다.
  persist(
    (set) => ({
      // `typeof window !== 'undefined'` 체크는 서버 사이드 렌더링(SSR) 환경에서 에러가 발생하는 것을 방지
      permission: typeof window !== 'undefined' ? window.Notification.permission : 'default',
      isSubscribed: false,
      // `permission` 값을 인자로 받아, `set` 함수를 호출하여 스토어의 `permission` 상태를 업데이트
      setPermission: (permission) => set({ permission }),
      // `isSubscribed` 값을 인자로 받아, `set` 함수를 호출하여 스토어의 `isSubscribed` 상태를 업데이트
      setIsSubscribed: (isSubscribed) => set({ isSubscribed }),
    }),
    {
      name: 'notification-subscription-status',
      // 스토어의 상태 중 어떤 것만 골라서 저장할지 선택
      partialize: (state) => ({ isSubscribed: state.isSubscribed }),
    }
  )
);
