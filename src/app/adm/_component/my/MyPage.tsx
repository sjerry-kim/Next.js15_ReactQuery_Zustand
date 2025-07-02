'use client'

import styles from './MyPage.module.css';
import NotificationButton from '@/adm/_component/common/NotificationButton';
import Button from '@/adm/_component/common/buttons/Button';
import LabelInput from '@/adm/_component/common/inputs/LabelInput';
import onTextChange from '@/utils/onTextChange';
import { useState } from 'react';
import LabelTextarea from '@/adm/_component/common/inputs/LabelTextarea';
import LabelInputSet from '../common/inputs/LabelInputSet';

interface JsonData {
  userName: string;
  email: string;
  address: string;
  currentPswd: string;
  newPswd: string;
  confirmPswd: string;
  data1: string;
  data2: string;
  data3: string;
}

export default function MyPage() {
  const [jsonData, setJsonData] = useState<JsonData>({
    userName: "",
    email: "user@example.com",
    address: "",
    currentPswd: "",
    newPswd: "",
    confirmPswd: "",
    data1: "",
    data2: "",
    data3: "",
  });
  const {handleChange} = onTextChange(jsonData, setJsonData);


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
                <LabelInput
                  label="이름"
                  name="userName"
                  value={jsonData.userName}
                  maxLength={10}
                  placeholder="이름"
                  disabled
                  onChange={handleChange}
                />
                <LabelInput
                  label="이메일"
                  name="email"
                  value={jsonData.email}
                  maxLength={80}
                  placeholder="이메일"
                  disabled
                  onChange={handleChange}
                />
              </div>
            </li>

            {/* todo 비밀번호 변경은 모달로 빼기 */}
            <li className={styles.one_row_box}>
              <LabelInputSet label="비밀번호 변경">
                <LabelInput
                  type="currentPswd"
                  name="currentPswd"
                  placeholder="현재 비밀번호"
                  value={jsonData.currentPswd}
                  maxLength={15}
                  showCharCount
                  showLabel={false}
                  onChange={handleChange}
                />
                <LabelInput
                  type="newPswd"
                  name="newPswd"
                  placeholder="새 비밀번호"
                  value={jsonData.newPswd}
                  maxLength={15}
                  showCharCount
                  showLabel={false}
                  onChange={handleChange}
                />
                <LabelInput
                  type="confirmPswd"
                  name="confirmPswd"
                  placeholder="비밀번호 확인"
                  value={jsonData.confirmPswd}
                  maxLength={15}
                  showCharCount
                  showLabel={false}
                  onChange={handleChange}
                />
                <Button
                  text="변경"
                  variant="contained"
                  color="primary"
                  size="md"
                  height="100%"
                  onClick={()=>console.log("확인")}
                />
              </LabelInputSet>
            </li>

            <li>
              <LabelInput
                label="회원정보1"
                name="data1"
                value={jsonData.data1}
                maxLength={10}
                placeholder="회원정보를 입력하세요"
                required
                showCharCount
                onChange={handleChange}
              />
              <LabelInput
                label="회원정보2"
                name="data2"
                value={jsonData.data2}
                maxLength={10}
                placeholder="회원정보를 입력하세요"
                showCharCount
                required
                onChange={handleChange}
              />
            </li>

            <li className={styles.input_box}>
              <LabelInput
                label="주소"
                name="address"
                value={jsonData.address}
                maxLength={50}
                placeholder="주소를 입력하세요"
                showCharCount
                required
                onChange={handleChange}
              />
            </li>

            <li className={styles.input_box}>
              {/*<label className={styles.label}>특이사항 (관리자 메모)</label>*/}
              {/*<textarea placeholder="특이사항" rows={4} className={styles.textarea} />*/}
              
              <LabelTextarea
                label="회원정보3"
                name="data3"
                value={jsonData.data3}
                maxLength={3000}
                placeholder="회원정보3을 입력하세요"
                showCharCount
                onChange={handleChange}
              />
            </li>

            <li className={styles.one_row_box}>
              <div className={styles.inner_row}>
                <label className={styles.label}>웹 푸시 알림 설정</label>
                <NotificationButton />
              </div>
            </li>
          </ul>
        </div>
      </section>
    </main>
  )
}
