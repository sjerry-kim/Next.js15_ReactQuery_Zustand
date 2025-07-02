'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Add.module.css';
import onInputsChange from '@/utils/onInputsChange';
import dynamic from 'next/dynamic';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { board } from '@prisma/client';
import { getBoardList } from '@/services/boardService';
import { Board } from '@/types/board';

import CloseIcon from '@mui/icons-material/Close';
import CommonModal from '@/adm/_component/common/modals/CommonModal';
import MenuModal from '@/adm/_component/common/modals/MenuModal';
import { ButtonProps } from '@/types/components';
import LabelTextarea from '@/adm/_component/common/inputs/LabelTextarea';

const Editor = dynamic(() => import('@/adm/_component/common/inputs/Editor'), {
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
  const [jsonData, setJsonData] = useState({
    content: '',
    data1: "",
    data2: "",
    data3: "",
  });
  const {handleChange, handleCustomChange} = onInputsChange(jsonData, setJsonData);
  const tabs: Tab[] = [
    { key: 'info', label: '1. 정보 입력' },
    { key: 'option', label: '2. 옵션 설정' },
    { key: 'confirm', label: '3. 최종 확인' }
  ]
  const [currentTab, setCurrentTab] = useState<string>("info");

  const handleCancel = () => console.log('취소');
  const handleSubmit = () => console.log('저장');

  const myModalButtons: ButtonProps[] = [
    {
      text: '취소',
      variant: 'outlined',
      color: 'grey',
      onClick: handleCancel,
    },
    {
      text: '저장하기',
      variant: 'contained',
      color: 'primary',
      onClick: handleSubmit,
    }
  ];

  const createMutation = useMutation<ApiResponse<Board>, Error>({
    mutationFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/protected/board`, {
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
    //   onClose={() => router.back()}
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
      tabs={tabs}
      buttons={myModalButtons}
      maxWidth="90%"
      onTabChange={(key) => setCurrentTab(key)}
    >
      {currentTab === 'info' && (
        <>
          <LabelTextarea
            label="정보1"
            name="data1"
            value={jsonData.data1}
            maxLength={3000}
            placeholder="정보1을 입력하세요"
            showCharCount
            onChange={handleChange}
          />
          <LabelTextarea
            label="정보2"
            name="data3"
            value={jsonData.data2}
            maxLength={3000}
            placeholder="정보2을 입력하세요"
            showCharCount
            onChange={handleChange}
          />
          <LabelTextarea
            label="정보3"
            name="data3"
            value={jsonData.data3}
            maxLength={3000}
            placeholder="정보3을 입력하세요"
            showCharCount
            onChange={handleChange}
          />
        </>
      )}
      {currentTab === 'option' && <>option</>}
      {currentTab === 'confirm' && <>confirm</>}
    </MenuModal>

  );
}
