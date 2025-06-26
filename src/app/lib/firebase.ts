import { initializeApp, getApp, getApps } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// firebase 설정
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 중복 초기화를 방지 (HMR 대응)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 서버 사이드 렌더링(SSR) 환경에서 에러가 나지 않도록 브라우저에서만 messaging을 초기화
const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

/* ✅ 사용자에게 알림 권한을 요청하고, 허용 시 FCM 토큰을 발급받는 함수 */
export const requestPermissionAndGetToken = async () => {
  if (!messaging) {
    console.error("Firebase Messaging is not initialized.");
    return null;
  }

  // 브라우저에 알림 권한 팝업을 띄움
  const permission = await Notification.requestPermission();

  // 사용자가 권한을 '허용(granted)'했을 경우
  if (permission === "granted") {
    try {
      // Firebase 서버에 이 브라우저를 위한 고유 푸시 토큰(FCM Token)을 요청
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
      
      // todo! 토큰을 클라이언트에 저장해둬야함

      if (currentToken) {
        return currentToken; // 발급받은 토큰을 반환
      } else {
        console.log("No registration token available. Request permission to generate one.");
        return null;
      }
    } catch (err) {
      console.error("An error occurred while retrieving token. ", err);
      return null;
    }
  } else {
    console.log("Unable to get permission to notify.");
    return null;
  }
};

export { messaging, app };