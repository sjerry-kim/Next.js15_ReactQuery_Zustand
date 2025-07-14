'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { board } from '@prisma/client';
import styles from './Modify.module.css';
import { getBoard } from '@/services/boardService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import onInputsChange from '@/utils/onInputsChange';
import { Board } from '@/types/board';
import { useSnackbar } from '@/hooks/useSnackbar';
import LabelTextarea from '@/adm/_component/common/inputs/LabelTextarea';
import MenuModal from '@/adm/_component/common/modals/MenuModal';
import { ButtonProps } from '@/types/components';

type PageProps = {
  id: string;
};

interface Tab {
  key: string;
  label: string;
}

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
  const [currentTab, setCurrentTab] = useState<string>("info");
  const [jsonData, setJsonData] = useState({
    id: data?.id || 0,
    content: '',
    data1: "",
    data2: "",
    data3: "",
  });
  const tabs: Tab[] = [
    { key: 'info', label: '정보 입력' },
    { key: 'option', label: '옵션 설정' },
    { key: 'confirm', label: '최종 확인' },
  ]
  const {handleChange} = onInputsChange(jsonData, setJsonData);
  const {showSnackbar} = useSnackbar();

  const handleSubmit = () => console.log('저장');

  const myModalButtons: ButtonProps[] = [
    {
      text: '수정',
      variant: 'contained',
      color: 'primary',
      onClick: handleSubmit,
    }
  ];

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
        throw new Error("통신 오류가 발생하였습니다.");
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
      showSnackbar("통신 오류가 발생하였습니다.", "error")
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

      if (!response.ok) {
        throw new Error("통신 오류가 발생하였습니다.");
      }

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
      showSnackbar("통신 오류가 발생하였습니다.", "error")
    },
  });

  useEffect(() => {
    if (data) {
      setJsonData((prevState)=>({
        ...prevState,
        content: data.content,
      }));
    }
  }, [data]);

  return (
    <MenuModal
      modalTitle="설정"
      onClose={() => router.back()}
      tabs={tabs}
      buttons={myModalButtons}
      maxWidth="90%"
      onTabChange={(key) => setCurrentTab(key)}
    >
      {currentTab === 'info' && (
        <ul className={styles.content_container}>
          <li>
            <LabelTextarea
              label="내용"
              name="data3"
              value={jsonData.content}
              maxLength={3000}
              placeholder="정보2을 입력하세요"
              showCharCount
              onChange={handleChange}
            />
          </li>
          <li>
            <LabelTextarea
              label="정보1"
              name="data1"
              value={jsonData.data1}
              maxLength={10}
              placeholder="정보1을 입력하세요"
              showCharCount
              onChange={handleChange}
            />
          </li>
        </ul>
      )}
      {currentTab === 'option' &&
        <ul className={styles.content_container}>
          <li>
            <LabelTextarea
              label="정보1"
              name="data1"
              value={jsonData.data1}
              maxLength={10}
              placeholder="정보1을 입력하세요"
              showCharCount
              onChange={handleChange}
            />
          </li>
          <li>
            <LabelTextarea
              label="정보2"
              name="data3"
              value={jsonData.data2}
              maxLength={3000}
              placeholder="정보2을 입력하세요"
              showCharCount
              onChange={handleChange}
            />
          </li>
          <li>
            <LabelTextarea
              label="정보3"
              name="data3"
              value={jsonData.data3}
              maxLength={3000}
              placeholder="정보3을 입력하세요"
              showCharCount
              onChange={handleChange}
            />
          </li>
        </ul>
      }
      {currentTab === 'confirm' &&
        <ul className={styles.content_container}>
          <li>
            <LabelTextarea
              label="정보1"
              name="data1"
              value={jsonData.data1}
              maxLength={10}
              placeholder="정보1을 입력하세요"
              showCharCount
              onChange={handleChange}
            />
          </li>
          <li>
            <LabelTextarea
              label="정보2"
              name="data3"
              value={jsonData.data2}
              maxLength={3000}
              placeholder="정보2을 입력하세요"
              showCharCount
              onChange={handleChange}
            />
          </li>
          <li>
            <LabelTextarea
              label="정보3"
              name="data3"
              value={jsonData.data3}
              maxLength={3000}
              placeholder="정보3을 입력하세요"
              showCharCount
              onChange={handleChange}
            />
          </li>
        </ul>
      }
    </MenuModal>
  );
}
