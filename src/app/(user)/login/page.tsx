'use client';

import { useState } from 'react';
import useValidation from '@/hooks/useValidation';
import styles from './page.module.css';
import onTextChange from '@/utils/onTextChange';
import { useUserStore } from '@/zustand/userStore';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [jsonData, setJsonData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const {handleChange} = onTextChange(jsonData, setJsonData);
  const validationRules = {
    email: {
      required: true,
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    password: {
      required: true,
      minLength: 6,
      maxLength: 12,
    },
  };
  const { errors, validate } = useValidation(jsonData, validationRules);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validate();

    if (isValid) {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '로그인 실패');
      }

      const {
        accessToken,
        expiresAt,
        user,
      } = await res.json();

      localStorage.setItem('accessToken', accessToken);
      // localStorage.setItem('accessTokenExpiresAt', expiresAt.toString());
      useUserStore.getState().setUser(user);
      // todo: 로그아웃 ui 생성 시 아래 코드 추가 필요
      //   useUserStore.getState().clearUser();

      router.push('/');
    } catch (error) {
      console.error('로그인 에러:');
    }
  };

  return (
    <main className={styles.main}>
      <h1>로그인</h1>
      <section className={styles.section}>
        <ul className={styles.loginForm}>
          <li>
            <label htmlFor="email">이메일</label>
            <input type="email" id="email" name="email" value={jsonData.email} onChange={handleChange} className={errors.email ? styles.errorInput : ''} />
          </li>
          <p className={errors.email ? styles.errorMessage : ''}>{errors.email ? errors.email : ''}</p>

          <li>
            <label htmlFor="password">비밀번호</label>
            <input type="password" id="password" name="password" value={jsonData.password} onChange={handleChange} className={errors.password ? styles.errorInput : ''} />
          </li>
          <p className={errors.password ? styles.errorMessage : ''}>{errors.password ? errors.password : ''}</p>
        </ul>

        <button onClick={handleSubmit}>로그인</button>
      </section>
    </main>
  );
}
