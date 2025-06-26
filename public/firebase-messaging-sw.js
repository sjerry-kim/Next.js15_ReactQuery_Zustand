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

/**
 * onBackgroundMessage 핸들러
 * 앱이 백그라운드에 있거나 닫혀 있을 때 푸시가 오면 이 함수가 호출됩니다.
 */
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  // 푸시 메시지에서 제목과 내용을 추출
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icons/icon-192x192.png", // public/icons 폴더에 아이콘 이미지 준비
    // 클릭 시 이동할 URL 등 추가 데이터 설정 가능
    data: {
      url: payload.data?.link || '/', // 푸시 페이로드에 url이 있으면 그 url로, 없으면 메인으로
    }
  };

  // 서비스 워커를 통해 사용자에게 시스템 알림을 표시
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 사용자가 알림을 클릭했을 때의 동작 정의
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click Received.', event);

  const clickedUrl = event.notification.data.url;
  console.log(`[Service Worker] User wants to open URL: ${clickedUrl}`);

  event.notification.close();

  // 해당 URL을 가진 클라이언트 창이 이미 열려있는지 확인하고, 있으면 포커스, 없으면 새로 엽니다.
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 이미 열려있는 탭이 있으면 그 탭으로 포커스
      for (const client of clientList) {
        // URL의 경로 부분만 비교하여 같은 페이지인지 확인
        const clientUrl = new URL(client.url);
        const targetUrl = new URL(clickedUrl, self.location.origin); // 상대 경로를 절대 경로로 변환
        if (clientUrl.pathname === targetUrl.pathname) {
          return client.focus();
        }
      }
      // 열려있는 탭이 없으면 새 탭으로 연다
      if (clients.openWindow) {
        return clients.openWindow(clickedUrl);
      }
    })
  );
});