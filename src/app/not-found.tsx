'use client'

import Link from 'next/link';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function NotFound() {
  const pathname = usePathname();

  useEffect(()=>{
    console.log(pathname);
  }, [pathname])

  if (pathname === '/403') {
    return (
      <>
        <h1>403</h1>
        <p>권한이 없는 페이지입니다.</p>
      </>
    )
  }

  return (
    <>
      <h1>404</h1>
      <p>찾을 수 없는 페이지입니다.</p>
    </>
  )
}