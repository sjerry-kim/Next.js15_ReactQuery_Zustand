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
  console.log(
    "[서비스 워커] 백그라운드 메시지를 수신했습니다:",
    payload
  );

  // payload.notification이 없을 경우를 대비하여
  // payload.data에서 제목과 내용을 가져오도록 수정함
  // 이렇게 하면 서버가 '알림 메시지'와 '데이터 메시지' 중 어떤 것을 보내도 안전하게 처리됨
  const notificationTitle = payload.notification?.title || payload.data?.title || '새로운 알림';
  const notificationBody = payload.notification?.body || payload.data?.body || '새로운 메시지가 도착했습니다.';

  const notificationOptions = {
    body: notificationBody,
    // icon: "/icons/icon-192x192.png",
    data: payload.data, 
  };

  // 서비스 워커를 통해 사용자에게 시스템 알림을 표시
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 사용자가 알림을 클릭했을 때의 동작 정의
self.addEventListener('notificationclick', (event) => {
  console.log('[서비스 워커] 알림 클릭 이벤트 수신:', event);

  event.notification.close();
  
  const pathToOpen = event.notification.data?.path || '/';
  const urlToOpen = event.notification.data?.url || '/';

  // 해당 URL을 가진 클라이언트 창이 이미 열려있는지 확인하고, 있으면 포커스, 없으면 새로 열어줌
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        const clientUrl = new URL(client.url);
        const targetUrl = new URL(pathToOpen, self.location.origin);
        if (clientUrl.pathname === targetUrl.pathname) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
