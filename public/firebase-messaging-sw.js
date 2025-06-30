importScripts("https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyDezl1d_umQb8cZWwGtDfRRcMl9zdoabP8",
  authDomain: "lemoncrew-test.firebaseapp.com",
  projectId: "lemoncrew-test",
  storageBucket: "lemoncrew-test.firebasestorage.app",
  messagingSenderId: "537216717810",
  appId: "1:537216717810:web:9e3e524612d1b11c21d16b",
};

// firebase 앱 초기화
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

/* ✅ 웹푸시 백그라운드 푸시가 오면 호출되는 함수 */
messaging.onBackgroundMessage((payload) => {
  let notificationTitle;
  let notificationOptions;

  // 1. 푸시알림이 아닌 새로고침 기능이 필요한 경우 
  if (payload.data && payload.data.type === 'force_reload') {
    notificationTitle = '새로운 업데이트 알림';
    notificationOptions = {
      body: '새로운 업데이트 사항이 있습니다. 클릭하여 확인하세요.',
      // icon: "/icons/icon-192x192.png",
      data: payload.data,
    };
  }
  // 2. 일반적인 웹푸시인 경우
  else {
    notificationTitle = payload.notification?.title || payload.data?.title || '새로운 알림';
    notificationOptions = {
      body: payload.notification?.body || payload.data?.body || '새로운 메시지가 도착했습니다.',
      icon: "/icons/icon-192x192.png",
      data: payload.data, // 서버에서 보내준 data를 그대로 사용
    };
  }

  // 결정된 내용으로 시스템 알림을 표시
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// ✅ 사용자가 알림(뒙푸시)을 클릭했을 때의 동작 정의
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const rawPath = event.notification.data?.url || event.notification.data?.path || '/';
  const urlToOpen = new URL(rawPath, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {

      // 열려있는 우리 사이트 탭이 있는지 확인
      if (clientList.length > 0) {
        // 가장 첫 번째 탭을 선택
        const client = clientList[0];

        // 해당 탭에 "이 URL로 이동하라"는 메시지를 보냄
        client.postMessage({
          action: 'navigate',
          url: urlToOpen,
        });

        // 그리고 그 탭으로 포커스를 줌
        if ('focus' in client) return client.focus();
      }

      // 열려있는 탭이 하나도 없다면, 새 탭으로 열어서 경로 이동
      if (clients.openWindow) return clients.openWindow(urlToOpen);
    })
  );
});

// ✅ 서비스 워커 자동 업데이트 로직 -> 개발 시엔 계속 사용, 배포 시에는 주석처리 필요
// 'install' 이벤트: 새로운 서비스 워커가 설치될 때 실행됨
self.addEventListener('install', (event) => {
  // 새로운 서비스 워커가 대기 상태를 건너뛰고 즉시 활성화되도록 함
  self.skipWaiting();
});

// 'activate' 이벤트: 새로운 서비스 워커가 활성화될 때 실행됨
self.addEventListener('activate', (event) => {
  // 활성화된 서비스 워커가 현재 열려있는 모든 클라이언트(탭)의 제어권을 즉시 가져오도록 함
  event.waitUntil(self.clients.claim());
});