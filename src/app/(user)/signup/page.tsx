'use client';

import { useState } from 'react';
import useValidation from '@/hooks/useValidation';
import styles from './page.module.css';
import onInputsChange from '@/utils/onInputsChange';
import {useSnackbar} from '@/hooks/useSnackbar';

export default function Page() {
  const [jsonData, setJsonData] = useState({
    name: '',
    email: '',
    password: '',
    role: "user",
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
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
  };
  const { errors, validate } = useValidation(jsonData, validationRules);
  const {showSnackbar} = useSnackbar();

  const handleTempAdminRole = () => {
    setJsonData((prevState) => ({
      ...prevState,
      role: "super_admin"
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validate();

    if (isValid) {
      handleCreate();
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch(`/api/auth/signup`, {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("통신 오류가 발생하였습니다.");
      }

    } catch (error) {
      console.error('[signup]', error.message);
      showSnackbar(error.message || '회원가입에 실패하였습니다.', 'error')
    }
  };

  return (
    <main className={styles.main}>
      <h1>회원 가입</h1>
      <section className={styles.section}>
        <ul className={styles.signupForm}>
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

          <li>
            <label htmlFor="name">이름</label>
            <input type="text" id="name" name="name" value={jsonData.name} onChange={handleChange} className={errors.name ? styles.errorInput : ''} />
          </li>
          <p className={errors.name ? styles.errorMessage : ''}>{errors.name ? errors.name : ''}</p>
        </ul>

        <button onClick={handleSubmit}>회원가입</button>
      </section>
      <button onClick={handleTempAdminRole}>관리자로 회원가입</button>
    </main>
  );
}
