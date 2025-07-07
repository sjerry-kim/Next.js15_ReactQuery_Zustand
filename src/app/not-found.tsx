'use client'

import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@/styles/not-found.module.css'

export default function NotFound() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/403') {
    return (
      <main className={styles.main_wrapper}>
        <Image src="/images/notfound.png" alt="에러이미지" width={300} height={300}/>
        <div className={styles.comment}>
          <h1>403</h1>
          <p>권한이 없는 페이지입니다.</p>
          <button onClick={()=> router.back()}>뒤로 가기</button>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.main_wrapper}>
      <Image src="/images/notfound.png" alt="에러이미지" width={300} height={300}/>
      <div className={styles.comment}>
        <h1>404</h1>
        <p>찾을 수 없는 페이지입니다.</p>
        <button onClick={()=> router.back()}>뒤로 가기</button>
      </div>
    </main>
  )
}