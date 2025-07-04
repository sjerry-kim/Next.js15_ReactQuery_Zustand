'use client';

import { useState } from 'react';
import useValidation from '@/hooks/useValidation';
import styles from './page.module.css';
import onInputsChange from '@/utils/onInputsChange';
import { useUserStore } from '@/zustand/userStore';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/zustand/authStore';
import { useSnackbar } from '@/hooks/useSnackbar';

export default function Page() {
  const router = useRouter();
  const [jsonData, setJsonData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const {handleChange} = onInputsChange(jsonData, setJsonData);
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
  const {showSnackbar} = useSnackbar();
  const { errors, validate } = useValidation(jsonData, validationRules);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validate();

    if (isValid) {
      handleLogin();
    }
  };

  // todo 에러처리 해당 로직으로 통일
  const handleLogin = async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401) {
          const errorBody = await res.json();
          return showSnackbar(errorBody.message || '아이디 또는 비밀번호가 틀렸습니다.', 'warning');
        } else {
          throw new Error('서버에 문제가 발생했습니다.');
        }
      }

      const { accessToken, user } = await res.json();

      useUserStore.getState().setUser(user);
      useAuthStore.getState().setAccessToken(accessToken);
      router.push('/');
    } catch (error) {
      showSnackbar(error.message || '로그인에 실패하였습니다.', 'error')
      console.error('[login]', error.message);
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
