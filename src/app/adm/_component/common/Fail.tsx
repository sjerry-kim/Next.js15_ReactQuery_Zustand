'use client';

import Image from 'next/image';
import styles from './Fail.module.css'

export default function Fail() {
  return (
    <div className={styles.wrapper}>
      <Image src="/images/notfound.png" alt="에러이미지" width={300} height={300}/>
      <div className={styles.comment}>
        <h2>문제가 발생했습니다!</h2>
        <button onClick={() => window.location.reload()}>다시 시도</button>
      </div>
    </div>
  );
}