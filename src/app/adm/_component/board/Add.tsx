'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Modal.module.css';
import onTextChange from '@/utils/onTextChange';
import dynamic from 'next/dynamic';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { board } from '@prisma/client';
import { getBoardList } from '@/lib/boardQuery';
import { Board } from '@/types/board';

const Editor = dynamic(() => import('@/adm/_component/common/Editor'), {
  ssr: false,
  loading: () =>
    <div>
      <p style={{textAlign: "center"}}>로딩이 지속되면 새로고침 해주세요.</p>
    </div>
});

export default function Page({}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ['boardList'],
    queryFn: getBoardList,
  });
  const [jsonData, setJsonData] = useState({
    content: '',
  });
  const {handleChange, handleCustomChange} = onTextChange(jsonData, setJsonData);

  const createMutation = useMutation<ApiResponse<Board>, Error>({
    mutationFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/board`, {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) {
        throw new Error("통신 오류 발생!");
      }

      return await response.json();
    },
    onSuccess: (res) => {
      queryClient.setQueryData(['boardList'], (prevData?: Board[]) => {
        return prevData ? [...prevData, {...res.data, rn: prevData.length+1}] : [res.data];
      });

      router.back();
    },
    onError() {
      alert('오류가 발생하였습니다. 관리자에게 문의하세요.');
    },
  });

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modal}>
        <button onClick={() => router.back()}>X</button>
        <input type="text" id="content" name="content" value={jsonData.content} onChange={handleChange} />
        <Editor
          name="content"
          value={jsonData.content}
          onChange={handleCustomChange}
        />
        <button onClick={() => createMutation.mutate()}>Submit</button>
      </div>
    </div>
  );
}
