'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Add.module.css';
import onInputsChange from '@/utils/onInputsChange';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Board, BoardCreatePayload } from '@/types/board';
import CommonModal from '@/adm/_component/common/modals/CommonModal';
import { useSnackbar } from '@/hooks/useSnackbar';
import LabelTextarea from '@/adm/_component/common/inputs/LabelTextarea';
import LabelInput from '@/adm/_component/common/inputs/LabelInput';
import { createBoard } from '@/services/boardService';

export default function Page({}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [jsonData, setJsonData] = useState({
    title: '',
    content: '',
  });
  const {handleChange} = onInputsChange(jsonData, setJsonData);
  const {showSnackbar} = useSnackbar();

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
    <CommonModal
      modalTitle="글쓰기"
      buttons={[
        {
          text: '등록',
          variant: 'contained',
          color: 'primary',
          onClick: handleSubmit,
        }
      ]}
      width="900px"
      height="500px"
      onClose={() => router.back()}
    >
      <ul className={styles.content_container}>
        <li>
          <LabelInput
            label="제목"
            name="title"
            value={jsonData.title}
            maxLength={30}
            placeholder="제목을 입력하세요"
            showCharCount
            onChange={handleChange}
          />
        </li>
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
      </ul>
    </CommonModal>
  );
}
