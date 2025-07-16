'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Add.module.css';
import onInputsChange from '@/utils/onInputsChange';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import CommonModal from '@/adm/_component/common/modals/CommonModal';
import { useSnackbar } from '@/hooks/useSnackbar';
import { TermsResponse } from '@/types/terms';
import { createTerms } from '@/services/termsServices';
import LabelInput from '@/adm/_component/common/inputs/LabelInput';
import LabelEditor from '../../common/inputs/LabelEditor';

interface JsonData {
  title: string;
  content: string;
}

export default function Add({}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [jsonData, setJsonData] = useState<JsonData>({
    title: "",
    content: "",
  });
  const {showSnackbar} = useSnackbar();
  const {handleChange, handleCustomChange} = onInputsChange(jsonData, setJsonData);

  // 등록 mutation
  const createMutation = useMutation<ApiResponse<TermsResponse>, Error>({
    mutationFn: () => createTerms(jsonData),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['termList'] });
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
          onClick: () => {createMutation.mutate()}
        },
      ]}
      width="1100px"
      maxWidth="90%"
      height="800px"
      onClose={() => router.back()}
    >
      <ul className={styles.content_box}>
        <LabelInput
          label="제목"
          value={jsonData.title}
          name="title"
          maxLength={30}
          placeholder="제목"
          onChange={handleChange}
        />
        <LabelEditor
          label="내용"
          name="content"
          value={jsonData.content}
          onChange={handleCustomChange}
        />
      </ul>
    </CommonModal>
  );
}
