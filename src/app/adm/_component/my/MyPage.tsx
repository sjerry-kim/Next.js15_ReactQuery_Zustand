'use client'

import styles from './MyPage.module.css';
import NotificationButton from '@/adm/_component/common/NotificationButton';

export default function MyPage() {

  return (
    <main>
      <section className={styles.form_wrapper}>
        <div className={styles.top}>
          <h3>내 정보</h3>
        </div>
        <div className={styles.bottom}>
          <ul className={styles.content_container}>
            <li className={styles.profile_box}>
              <div className={styles.profile_set}>
                <div className={styles.avatarSkeleton}></div>
              </div>
              <div className={styles.inner_column}>
                <div className={styles.inner_row}>
                  <label className={styles.label}>이름</label>
                  <input type="text" placeholder="이름" className={styles.input} />
                </div>
                <div className={styles.inner_row}>
                  <label className={styles.label}>이메일</label>
                  <input type="email" value="user@example.com" disabled className={styles.inputDisabled} />
                </div>
              </div>
            </li>

            <li className={styles.one_row_box}>
              <div className={styles.inner_row}>
                <label className={styles.label}>비밀번호 변경</label>
                <div className={styles.inner_row_set}>
                  <input type="password" placeholder="현재 비밀번호" className={styles.input} />
                  <input type="password" placeholder="새 비밀번호" className={styles.input} />
                  <input type="password" placeholder="비밀번호 확인" className={styles.input} />
                  <button className={styles.button}>변경</button>
                </div>
              </div>
            </li>

            <li className={styles.input_box}>
              <label className={styles.label}>주소</label>
              <input type="text" placeholder="주소" className={styles.input} />
            </li>

            <li className={styles.input_box}>
              <label className={styles.label}>특이사항 (관리자 메모)</label>
              <textarea placeholder="특이사항" rows={4} className={styles.textarea} />
            </li>

            <li className={styles.one_row_box}>
              <div className={styles.inner_row}>
                <label className={styles.label}>푸시 알림 설정</label>
                <NotificationButton />
              </div>
            </li>
          </ul>
        </div>
      </section>
    </main>
  )
}
