'use client';

import React, { useEffect } from 'react';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { useMutation } from '@tanstack/react-query';
import { useNotificationStore } from '@/zustand/webPushStore';
import { requestPermissionAndGetToken } from '@/lib/firebase';
import { savePushSubscription  } from '@/lib/queries/webPushService';

export default function NotificationButton() {
  const { permission, isSubscribed, setPermission, setIsSubscribed } = useNotificationStore();

  const { mutate: subscribe, isPending } = useMutation<any, Error, string>({
    mutationFn: savePushSubscription ,
    onSuccess: (data) => {
      console.log("Subscription successful:", data);
      setIsSubscribed(true);
    },
    onError: (error) => {
      console.error("Failed to subscribe:", error);
      setIsSubscribed(false);
    },
  });

  useEffect(() => {
    // 컴포넌트 마운트 시 현재 권한 상태를 스토어에 업데이트
    setPermission(Notification.permission);
  }, [setPermission]);

  const handleSubscribeClick = async () => {
    if (permission === 'denied') {
      alert('브라우저 설정에서 알림 권한을 허용해주세요.');
      return;
    }

    const token = await requestPermissionAndGetToken();
    if (token) {
      // useMutation에서 반환된 mutate 함수(subscribe)를 호출
      subscribe(token);
    }

    // 권한 요청 후 상태를 다시 업데이트
    setPermission(Notification.permission);
  };

  if (permission === 'denied') {
    return (
      <Tooltip title="알림이 차단되었습니다. 브라우저 설정을 확인해주세요.">
        <span>
          <Button variant="outlined" disabled startIcon={<NotificationsOffIcon />}>
            알림 차단됨
          </Button>
        </span>
      </Tooltip>
    );
  }

  if (isSubscribed) {
    return (
      <Button variant="contained" color="success" startIcon={<NotificationsActiveIcon />}>
        알림 구독중
      </Button>
    );
  }

  return (
    <Button
      variant="contained"
      onClick={handleSubscribeClick}
      // @ts-ignore
      disabled={isPending || permission === 'denied'}
      startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : <NotificationsActiveIcon />}
    >
      {isPending ? '처리중...' : '알림 받기'}
    </Button>
  );
}
