'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Add.module.css';
import onTextChange from '@/utils/onTextChange';
import dynamic from 'next/dynamic';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { board } from '@prisma/client';
import { getBoardList } from '@/lib/queries/boardQuery';
import { Board } from '@/types/board';

import CloseIcon from '@mui/icons-material/Close';
import CommonModal from '@/adm/_component/common/CommonModal';
import MenuModal from '@/adm/_component/common/MenuModal';

const Editor = dynamic(() => import('@/adm/_component/common/Editor'), {
  ssr: false,
  loading: () =>
    <div>
      <p style={{textAlign: "center"}}>로딩이 지속되면 새로고침 해주세요.</p>
    </div>
});

interface Tab {
  key: string;
  label: string;
}

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
  const tabs: Tab[] = [
    { key: 'info', label: '1. 정보 입력' },
    { key: 'option', label: '2. 옵션 설정' },
    { key: 'confirm', label: '3. 최종 확인' }
  ]
  const [currentTab, setCurrentTab] = useState<string>("info");

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

    // <CommonModal
    //   modalTitle="글쓰기"
    //   submitText="등록"
    //   showSubmit={true}
    //   onClose={() => router.back()}
    //   onSubmit={() => createMutation.mutate()}
    // >
    //   <ul className={styles.content_box}>
    //     <li>
    //       <label>제목</label>
    //       <input/>
    //     </li>
    //     <li>
    //       <label>내용</label>
    //       <Editor
    //         name="content"
    //         value={jsonData.content}
    //         onChange={handleCustomChange}
    //       />
    //     </li>
    //   </ul>
    // </CommonModal>

    <MenuModal
      modalTitle="설정"
      onClose={() => router.back()}
      onSubmit={() => createMutation.mutate()}
      tabs={tabs}
      onTabChange={(key) => setCurrentTab(key)}
    >
      {currentTab === 'info' && <>info</>}
      {currentTab === 'option' && <>option</>}
      {currentTab === 'confirm' && <>confirm</>}
    </MenuModal>

  );
}
