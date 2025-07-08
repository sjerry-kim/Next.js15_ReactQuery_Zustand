'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Add.module.css';
import onInputsChange from '@/utils/onInputsChange';
import dynamic from 'next/dynamic';
import { useMutation } from '@tanstack/react-query';
import CommonModal from '@/adm/_component/common/modals/CommonModal';
import { useSnackbar } from '@/hooks/useSnackbar';
import { TermsResponse } from '@/types/terms';
import { createTerms } from '@/services/termsServices';
import LabelInput from '@/adm/_component/common/inputs/LabelInput';
import Loading from '@/adm/_component/common/Loading';
import LabelEditor from '../../common/inputs/LabelEditor';

const Editor = dynamic(() => import('@/adm/_component/common/inputs/Editor'), {
  ssr: false,
  loading: () =>
    <div style={{height: "500px"}}>
      <Loading subTitle={"로딩이 지속되면 새로고침 해주세요."} />
    </div>
});

interface JsonData {
  title: string;
  content: string;
}

export default function Page({}) {
  const router = useRouter();
  const [jsonData, setJsonData] = useState<JsonData>({
    title: "",
    content: "",
  });
  const {handleChange, handleCustomChange} = onInputsChange(jsonData, setJsonData);
  const {showSnackbar} = useSnackbar();
  const handleCancel = () => console.log('취소');
  const handleSubmit = () => console.log('저장');

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
