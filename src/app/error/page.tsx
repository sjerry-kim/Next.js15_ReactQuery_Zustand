'use client';

import { useEffect } from 'react';

type ErrorProps = {
  error: Error;
  reset: () => void; // 세그먼트를 다시 렌더링하여 복구를 시도하는 함수
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 리포팅 서비스에 에러를 기록할 수 있습니다. (e.g. Sentry)
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>문제가 발생했습니다!</h2>
      <button onClick={() => reset()}>다시 시도</button>
    </div>
  );
}