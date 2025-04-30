'use client';

import { useState } from 'react';
import useValidation from '@/hooks/useValidation';
import styles from './page.module.css';
import onTextChange from '@/utils/onTextChange';

export default function Page() {
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
      await fetch(`${process.env.PUBLIC_URL}/api/auth/login`, {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });
    } catch (err) {
      console.log(err);
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
