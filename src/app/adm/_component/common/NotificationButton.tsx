'use client';

import React, { useEffect } from 'react';
import { Tooltip } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { useMutation } from '@tanstack/react-query';
import { useWebPushStore } from '@/zustand/webPushStore';
import { requestPermissionAndGetToken } from '@/lib/firebase';
import { savePushSubscription  } from '@/services/webPushService';
import Button from '@/adm/_component/common/Button';

export default function NotificationButton() {
  const { permission, isSubscribed, setPermission, setIsSubscribed, setFcmToken } = useWebPushStore();

  const { mutate: subscribe, isPending } = useMutation<any, Error, string>({
    mutationFn: savePushSubscription ,
    onSuccess: (data) => {
      // console.log("구독 정보 저장이 성공했습니다:", data);
      setIsSubscribed(true);
    },
    onError: (error) => {
      console.error("[NotificationButton] 구독 정보 저장에 실패했습니다:", error);
      setIsSubscribed(false);
    },
  });

  const handleSubscribeClick = async () => {
    if (permission === 'denied') {
      alert('브라우저 설정에서 알림 권한을 허용해주세요.');
      return;
    }

    const token = await requestPermissionAndGetToken();
    if (token) {
      subscribe(token); // 서버 DB 업데이트
      setFcmToken(token); // 클라이언트 스토어 업데이트
    }

    // 권한 요청 후 상태를 다시 업데이트
    setPermission(Notification.permission);
  };

  if (permission === 'denied') {
    return (
      <Tooltip title="알림이 차단되었습니다. 브라우저 설정을 확인해주세요.">
        <span>
          <Button text="알림 차단됨" variant="outlined" color="grey" size="md" height="100%" disabled={true}>
            알림 차단됨
          </Button>
        </span>
      </Tooltip>
    );
  }

  if (isSubscribed) {
    return (
      <Button text="알림 구독중" variant="contained" color="success" size="md" height="100%" disabled={true}>
        알림 구독중
      </Button>
    );
  }

  return (
    <Button
      text={isPending ? '처리중...' : '알림 받기'}
      variant="contained"
      color={isPending ? 'grey' : 'primary'}
      size="md"
      height="100%"
      onClick={handleSubscribeClick}
    />
  );
}
