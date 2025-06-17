"use client"

import { useUserStore } from '@/zustand/userStore';

export default function Page() {
  const user = useUserStore((state) => state.user);

  return (
    <>
      {
        user && <p>안녕하세요 {user.name}님!</p>
      }
      <h1>Hi! I'm the User Page :)</h1>
    </>
  );
}
