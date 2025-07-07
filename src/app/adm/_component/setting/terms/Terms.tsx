'use client'

import styles from './Terms.module.css';
import onInputsChange from '@/utils/onInputsChange';
import { useEffect, useState } from 'react';
import Editor from '@/adm/_component/common/inputs/Editor';
import LabelInput from '@/adm/_component/common/inputs/LabelInput';
import Button from '@/adm/_component/common/buttons/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Board } from '@/types/board';
import { router } from 'next/client';
import { useSnackbar } from '@/hooks/useSnackbar';
import { createTerms } from '@/services/termsServices';
import { TermsResponse } from '@/types/terms';

interface JsonData {
  title: string;
  content: string;
}

export default function MyPage() {
  const queryClient = useQueryClient();
  const [jsonData, setJsonData] = useState<JsonData>({
    title: "",
    content: "",
  });
  const {handleChange, handleCustomChange} = onInputsChange(jsonData, setJsonData);
  const {showSnackbar} = useSnackbar();

  const createMutation = useMutation<ApiResponse<TermsResponse>, Error>({
    mutationFn: () => createTerms(jsonData),
    onSuccess: (res) => {
      // queryClient.setQueryData(['Term'], (prevData: any) => {
      //   return prevData ? [...prevData, {...res.data, rn: prevData.length+1}] : [res.data];
      // });
      // console.log(res);
    },
    onError() {
      showSnackbar("통신 오류가 발생하였습니다.", "error")
    },
  });

  // useEffect(() => {
  //   console.log(jsonData);
  // }, [jsonData]);

  return (
    <main className={styles.main}>
      <section className={styles.page_wrapper}>
        <div className={styles.top}>
          <h3>이용약관</h3>
        </div>
        <div className={styles.bottom}>
          <LabelInput
            label="제목"
            value={jsonData.title}
            name="title"
            maxLength={30}
            placeholder="제목"
            onChange={handleChange}
          />
          <Editor
            name="content"
            value={jsonData.content}
            onChange={handleCustomChange}
          />
          <Button
            text="수정"
            variant="contained"
            color="primary"
            size="md"
            height="100%"
            onClick={()=> createMutation.mutate()}
          />
        </div>
      </section>
    </main>
  )
}
