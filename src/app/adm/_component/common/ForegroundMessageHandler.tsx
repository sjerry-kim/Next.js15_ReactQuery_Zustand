'use client';

import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import { messaging } from '@/lib/firebase';
import { useSnackbar } from 'notistack'; // MUI Snackbar를 쉽게 쓰게 해주는 라이브러리 예시

export default function ForegroundMessageHandler() {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (messaging && typeof window !== 'undefined') {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Foreground message received.', payload);

        const title = payload.notification?.title || '새 알림';
        const body = payload.notification?.body || '';

        // MUI Snackbar나 커스텀 토스트로 알림 표시
        enqueueSnackbar(body, {
          variant: 'info',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
          preventDuplicate: true,
        });
      });

      return () => {
        unsubscribe(); // 컴포넌트 언마운트 시 리스너 정리
      };
    }
  }, [enqueueSnackbar]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
}