'use client';

import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import { useSnackbar } from 'notistack';
import { messaging } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

/* ✅ 앱 전체에서 Firebase 푸시 메시지를 client에서 수신하고 처리하는 역할을 하는 컴포넌트 */
export default function WebPushMessageListener() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar(); // 스낵바 알림을 띄우기 위한 훅

  // 포어그라운드 웹 푸시 수신하기 위한 로직
  useEffect(() => {
    // 1. 서비스 워커 등록 (웹푸시를 받기 위한 필수 조건)
    // 앱이 시작될 때 한번만 실행
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          // console.log('서비스워커가 성공적으로 등록되었습니다. 범위:', registration.scope);
        })
        .catch((error) => {
          console.error('서비스 워커 등록에 실패했습니다:', error);
        });
    }

    // 2. 포어그라운드 메시지 리스너 설정
    if (messaging) {
      // 2-1. 커스텀 푸시 : 사용자가 웹사이트를 보고 있을 때는 OS 알림이 아닌 이 리스너가 메시지를 가로챔)
      // onMessage: 메시지를 수신할 때마다 콜백 함수를 실행하는 리스너를 설정
      // const unsubscribe = onMessage(messaging, (payload) => {
      //
      //   // 가로챈 메시지를 스낵바 형태의 인-앱(In-App) 알림으로 표시
      //   enqueueSnackbar(payload.notification?.body || '새로운 알림이 도착했습니다.', {
      //     variant: 'info',
      //     anchorOrigin: {
      //       vertical: 'top',
      //       horizontal: 'center',
      //     },
      //   });
      // });

      // 2-2. 기본 OS 알림
      const unsubscribe = onMessage(messaging, (payload) => {
        const notificationTitle = payload.notification?.title || payload.data?.title || '새로운 알림';
        const notificationOptions = {
          body: payload.notification?.body || payload.data?.body || '새로운 메시지가 도착했습니다.',
          // icon: '/icons/icon-192x192.png', // public 폴더에 아이콘,
          data: payload.data,
        };

        const notification = new Notification(notificationTitle, notificationOptions);

        // 새로고침의 경우
        if (payload.data && payload.data.type === 'force_reload') {
          notification.onclick = (event) => {
            event.preventDefault();

            window.location.reload();
          };
          return;
        }

        // 웹푸시의 경우
        notification.onclick = (event) => {
          event.preventDefault();

          const path = payload.data?.path;
          if (path) {
            router.push(path);
          } else {
            window.focus();
          }
        };
      });

      // 2-3. 메모리 누수 방지
      return () => {
        unsubscribe();
      };
    }
  }, [enqueueSnackbar]); // enqueueSnackbar 함수가 변경될 때만

  // 백그라운드 클릭 이벤트 메시징으로 경로 이동하기 위한 effect
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const handleMessage = (event: MessageEvent) => {

        // 'navigate' 액션이 포함된 메시지인지 확인
        if (event.data && event.data.action === 'navigate') {
          // router.push()를 사용해 페이지를 이동
          router.push(event.data.url);
        }
      };

      // 'message' 이벤트 리스너를 등록
      navigator.serviceWorker.addEventListener('message', handleMessage);

      // 메모리 누수 방지
      return () => {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      };
    }
  }, [router]);

  return null;
}
