'use client'; // 이 컴포넌트는 브라우저 전용 기능(useEffect, window)을 사용하므로 클라이언트 컴포넌트로 지정합니다.

import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import { useSnackbar } from 'notistack';

import { messaging } from '@/lib/firebase';

// 앱 전체에서 Firebase 푸시 메시지를 수신하고 처리하는 역할을 하는 컴포넌트입니다.
export default function FirebaseMessageHandler() {
  const { enqueueSnackbar } = useSnackbar(); // 스낵바 알림을 띄우기 위한 훅

  useEffect(() => {
    /**
     * 1. 서비스 워커 등록
     * 앱이 백그라운드에서도 푸시 알림을 받을 수 있도록 서비스 워커 파일을 브라우저에 등록합니다.
     * 이 코드는 앱이 시작될 때 한 번만 실행됩니다.
     */
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registration successful, scope is:', registration.scope);
        })
        .catch((err) => {
          console.log('Service Worker registration failed:', err);
        });
    }

    /**
     * 2. 포어그라운드 메시지 리스너 설정
     * 사용자가 웹사이트를 보고 있을 때 (포어그라운드 상태) 푸시 메시지가 오면,
     * OS 알림 대신 이 리스너가 메시지를 가로챕니다.
     */
    if (messaging) {
      // onMessage: 메시지를 수신할 때마다 콜백 함수를 실행하는 리스너를 설정합니다.
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Foreground message received.', payload);

        // 가로챈 메시지를 스낵바 형태의 인-앱(In-App) 알림으로 표시합니다.
        enqueueSnackbar(payload.notification?.body || '새로운 알림이 도착했습니다.', {
          variant: 'info',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        });
      });

      // 클린업(Cleanup) 함수: 컴포넌트가 사라질 때(unmount) 리스너를 정리하여 메모리 누수를 방지합니다.
      return () => {
        unsubscribe();
      };
    }
  }, [enqueueSnackbar]); // enqueueSnackbar 함수가 변경될 때만 이 효과를 다시 실행합니다.

  // 이 컴포넌트는 UI를 직접 렌더링하지 않고, 백그라운드에서 리스너 역할만 수행합니다.
  return null;
}
