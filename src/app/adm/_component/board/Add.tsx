'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Add.module.css';
import onInputsChange from '@/utils/onInputsChange';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBoard } from '@/services/boardService';
import MenuModal from '@/adm/_component/common/modals/MenuModal';
import LabelTextarea from '@/adm/_component/common/inputs/LabelTextarea';
import { useSnackbar } from '@/hooks/useSnackbar';
import { Board, BoardCreatePayload } from '@/types/board';

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
  const [currentTab, setCurrentTab] = useState<string>("info");
  const tabs: Tab[] = [
    { key: 'info', label: '정보 입력' },
    { key: 'option', label: '옵션 설정' },
    { key: 'confirm', label: '최종 확인' },
  ]
  const {showSnackbar} = useSnackbar();
  const {handleChange} = onInputsChange(jsonData, setJsonData);

  // 등록
  const handleSubmit = () => createMutation.mutate(jsonData);

  // 등록 mutation
  const createMutation = useMutation<ApiResponse<Board>, Error, BoardCreatePayload >({
    mutationFn: (data) => createBoard(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['boardList'] });
      router.back();
    },
    onError() {
      showSnackbar("통신 오류가 발생하였습니다.", "error")
    },
  });

  return (
    <MenuModal
      modalTitle="설정"
      onClose={() => router.back()}
      tabs={tabs}
      buttons={[
        {
          text: '등록',
          variant: 'contained',
          color: 'primary',
          onClick: handleSubmit,
        }
      ]}
      maxWidth="90%"
      onTabChange={(key) => setCurrentTab(key)}
    >
      {currentTab === 'info' && (
        <ul className={styles.content_container}>
          <li>
            <LabelTextarea
              label="내용"
              name="content"
              value={jsonData.content}
              maxLength={3000}
              placeholder="내용을 입력하세요"
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
              name="data2"
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
              name="data2"
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
