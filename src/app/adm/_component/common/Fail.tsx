'use client';

export default function Fail() {
  return (
    <div>
      <h2>문제가 발생했습니다!</h2>
      <button onClick={() => window.location.reload()}>다시 시도</button>
    </div>
  );
}