'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { board } from '@prisma/client';
import styles from './Modify.module.css';
import { getBoard } from '@/services/boardService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import onInputsChange from '@/utils/onInputsChange';
import { Board } from '@/types/board';

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
  const {handleChange} = onInputsChange(jsonData, setJsonData);

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
    <div className={styles.modalBackground}>
      <div className={styles.modal}>
        <button onClick={() => router.back()}>X</button>
        <input type="text" id="content" name="content" value={jsonData.content} onChange={handleChange} />
        <button onClick={() => updateMutation.mutate()}>Modify</button>
        <button onClick={() => deleteMutation.mutate()}>Delete</button>
      </div>
    </div>
  );
}
