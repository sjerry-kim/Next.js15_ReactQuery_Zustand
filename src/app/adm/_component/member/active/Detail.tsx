'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { board } from '@prisma/client';
import styles from './Detail.module.css';
import { getBoard } from '@/services/boardService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import onInputsChange from '@/utils/onInputsChange';
import { Board } from '@/types/board';
import CommonModal from '@/adm/_component/common/modals/CommonModal';
import Editor from '@/adm/_component/common/inputs/Editor';
import Button from '@/adm/_component/common/buttons/Button'
import {ButtonProps} from '@/types/components'


type PageProps = {
  id: string;
};

export default function Page({ id }: PageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useQuery<board>({
    queryKey: ['board', id], // 서버에서 사용한 queryKey와 동일하게 설정
    queryFn: () => getBoard(id), // 동일한 queryFn 사용
    staleTime: 60 * 1000, // 1분동안 캐시 신선함 1분뒤 재요청
    gcTime: 300 * 1000, // 5분뒤 메모리 정리
    enabled: !!id,
  });
  const [jsonData, setJsonData] = useState({
    id: data?.id || 0,
    content: data?.content || '',
  });
  const {handleChange, handleCustomChange} = onInputsChange(jsonData, setJsonData);
  const confirmationButtons: ButtonProps[] = [
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

  const handleTempBtn = () => {
    console.log("클릭했습니다.")
  }

  const updateMutation = useMutation<ApiResponse<Board>, Error>({
    mutationFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/protected/board/${data?.id}`, {
        method: 'PATCH',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) {
        throw new Error("통신 오류 발생!");
      }

      return response.json();
    },
    async onSuccess(res) {
      // boardList 갱신
      queryClient.setQueryData(['boardList'], (prevData?: Board[]) => {
        if (!prevData) return [];

        const newList = prevData.map((item) =>
          item.id === res.data.id ? { ...res.data, rn: prevData.indexOf(item) + 1 } : item
        );

        return newList;
      });

      // board 갱신
      queryClient.setQueryData(['board', id], (prevData?: board) => {
        return res.data;
      });

      router.back();
    },
    onError() {
      alert('오류가 발생하였습니다. 관리자에게 문의하세요.');
    },
  });


  const deleteMutation = useMutation<ApiResponse<Board>, Error>({
    mutationFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/protected/board/${data?.id}`, {
        method: 'DELETE',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });

      return response.json();
    },
    async onSuccess() {
      queryClient.setQueryData(['boardList'], (prevData?: Board[]) => {
        if (!prevData) return [];
        let newList = [...prevData];
        return newList.filter((item) => item.id !== jsonData.id);
      });

      router.back();
    },
    onError() {
      alert('오류가 발생하였습니다. 관리자에게 문의하세요.');
    },
  });

  useEffect(() => {
    if (data) {
      setJsonData({
        ...data,
      });
    }
  }, [data]);

  return (
    <CommonModal
      modalTitle="회원 정보"
      width="1000px"
      buttons={confirmationButtons} // 원하는 버튼 배열을 전달
      onClose={() => router.back()}
    >
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
                <input type="password" placeholder="새 비밀번호" className={styles.input} />
                <input type="password" placeholder="비밀번호 확인" className={styles.input} />
                <Button
                  text="변경"
                  variant="contained"
                  color="primary"
                  size="md"
                  height="100%"
                  onClick={()=>console.log("확인")}
                />
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
        </ul>
    </CommonModal>
  );
}
