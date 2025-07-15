'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { board } from '@prisma/client';
import styles from './Detail.module.css';
import { getBoard } from '@/services/boardService';
import { useQuery } from '@tanstack/react-query';
import onInputsChange from '@/utils/onInputsChange';
import CommonModal from '@/adm/_component/common/modals/CommonModal';
import Button from '@/adm/_component/common/buttons/Button'
import {ButtonProps} from '@/types/components'
import LabelInput from '@/adm/_component/common/inputs/LabelInput';
import LabelInputSet from '@/adm/_component/common/inputs/LabelInputSet';
import LabelTextarea from '@/adm/_component/common/inputs/LabelTextarea';

type PageProps = {
  id: string;
};

interface JsonData {
  id: string | number;
  content: string;
  createdAt: string | Date;
  updatedAt: string | Date;
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

export default function Page({ id }: PageProps) {
  const router = useRouter();
  const [jsonData, setJsonData] = useState<JsonData>({
    id: 0,
    content: '',
    createdAt: '',
    updatedAt: '',
    userName: '', // Test용으로 data.id 추가함
    email: "user@example.com",
    address: "",
    currentPswd: "",
    newPswd: "",
    confirmPswd: "",
    data1: "",
    data2: "",
    data3: "",
  });
  const modalButtons: ButtonProps[] = [
    {
      text: '정지',
      onClick: () => {
        handleTempBtn();
      },
      variant: 'outlined',
      color: 'grey',
    },
    {
      text: '탈퇴',
      onClick: () => {
        handleTempBtn();
      },
      variant: 'contained',
      color: 'error',
      size: "md",
    },
  ];
  const {handleChange} = onInputsChange(jsonData, setJsonData);

  const { data } = useQuery<board>({
    queryKey: ['board', id], // 서버에서 사용한 queryKey와 동일하게 설정
    queryFn: () => getBoard(id), // 동일한 queryFn 사용
    staleTime: 60 * 1000, // 1분동안 캐시 신선함 1분뒤 재요청
    gcTime: 300 * 1000, // 5분뒤 메모리 정리
    enabled: !!id,
  });

  const handleTempBtn = () => {
    console.log("클릭했습니다.")
  }

  useEffect(() => {
    if (data) {
      setJsonData((prevState)=>({
        ...prevState,
        content: data?.content,
        id: data?.id,
        createdAt: String(data?.created_at),
        updatedAt: String(data?.updated_at),
      }));
    }
  }, [data]);

  return (
    <CommonModal
      modalTitle="회원 정보"
      width="1000px"
      buttons={modalButtons}
      onClose={() => router.back()}
    >
        <ul className={styles.content_container}>
          <li className={styles.profile_box}>
            <div className={styles.profile_set}>
              <div className={styles.avatarSkeleton}></div>
            </div>
            <div className={styles.inner_column}>
              <LabelInput
                label="이름"
                name="userName"
                value={jsonData.content} // 테스트용으로 임시로 content 넣어둠
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
              <input
                type="newPswd"
                name="newPswd"
                placeholder="새 비밀번호"
                value={jsonData.newPswd}
                maxLength={15}
                onChange={handleChange}
              />
              <input
                type="confirmPswd"
                name="confirmPswd"
                placeholder="비밀번호 확인"
                value={jsonData.confirmPswd}
                maxLength={15}
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

          <li className={styles.input_box}>
            <LabelInput
              label="주소"
              name="address"
              value={jsonData.address}
              maxLength={50}
              placeholder="주소를 입력하세요"
              showCharCount
              required
              disabled={true}
              onChange={handleChange}
            />
          </li>

          <li className={styles.input_box}>
            <LabelTextarea
              label="회원정보3"
              name="data3"
              value={jsonData.data3}
              maxLength={3000}
              placeholder="회원정보3을 입력하세요"
              showCharCount
              disabled={true}
              onChange={handleChange}
            />
          </li>
        </ul>
    </CommonModal>
  );
}
