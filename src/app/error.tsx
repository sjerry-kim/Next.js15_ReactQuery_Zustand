'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import styles from '@/styles/error.module.css'

type ErrorProps = {
  error: Error;
  reset: () => void; // 세그먼트를 다시 렌더링하여 복구를 시도하는 함수
};

export default function error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 리포팅 서비스에 에러를 기록할 수 있습니다. (e.g. Sentry)
    console.error(error);
  }, [error]);

  return (
    <main className={styles.main_wrapper}>
      <Image src="/images/notfound.png" alt="에러이미지" width={300} height={300}/>
      <div>
        <h2>문제가 발생했습니다!</h2>
        <button onClick={() => reset()}>다시 시도</button>
      </div>
    </main>
  );
}