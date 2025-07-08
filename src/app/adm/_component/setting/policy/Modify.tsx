'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Modify.module.css';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import onInputsChange from '@/utils/onInputsChange';
import { Board } from '@/types/board';
import { useSnackbar } from '@/hooks/useSnackbar';
import { deleteTerm, getTerm, updateTerm } from '@/services/termsServices';
import CommonModal from '@/adm/_component/common/modals/CommonModal';
import LabelInput from '@/adm/_component/common/inputs/LabelInput';
import dynamic from 'next/dynamic';
import Loading from '@/adm/_component/common/Loading';

const Editor = dynamic(() => import('@/adm/_component/common/inputs/Editor'), {
  ssr: false,
  loading: () =>
    <div style={{height: "500px"}}>
      <Loading subTitle={"로딩이 지속되면 새로고침 해주세요."} />
    </div>
});

type PageProps = {
  id: string;
};

export default function Page({ id }: PageProps) {
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ['term', id], // 서버에서 사용한 queryKey와 동일하게 설정
    queryFn: () => getTerm(id), // 동일한 queryFn 사용
    staleTime: 60 * 1000, // 1분동안 캐시 신선함 1분뒤 재요청
    gcTime: 300 * 1000, // 5분뒤 메모리 정리
    enabled: !!id,
  });
  const [jsonData, setJsonData] = useState({
    title: '',
    content: '',
  });
  const {handleChange, handleCustomChange} = onInputsChange(jsonData, setJsonData);
  const {showSnackbar} = useSnackbar();

  const updateMutation = useMutation<ApiResponse<Board>, Error>({
    mutationFn: async () => updateTerm(Number(id), jsonData),
    async onSuccess(res) {
      // // boardList 갱신
      // queryClient.setQueryData(['boardList'], (prevData?: Board[]) => {
      //   if (!prevData) return [];
      //
      //   const newList = prevData.map((item) =>
      //     item.id === res.data.id ? { ...res.data, rn: prevData.indexOf(item) + 1 } : item
      //   );
      //
      //   return newList;
      // });
      //
      // // board 갱신
      // queryClient.setQueryData(['board', id], (prevData?: board) => {
      //   return res.data;
      // });

      router.back();
    },
    onError() {
      showSnackbar("통신 오류가 발생하였습니다.", "error")
    },
  });


  const deleteMutation = useMutation<ApiResponse<Board>, Error>({
    mutationFn: async () => deleteTerm(Number(id)),
    async onSuccess() {
      // queryClient.setQueryData(['boardList'], (prevData?: Board[]) => {
      //   if (!prevData) return [];
      //   let newList = [...prevData];
      //   return newList.filter((item) => item.id !== jsonData.id);
      // });

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
        idx: data?.data.idx || 0,
        title: data?.data.title || '',
        content: data?.data.content || '',
      }));
    }
  }, [data]);

  return (
    <CommonModal
      modalTitle="수정하기"
      buttons={[
        {
          text: '수정',
          variant: 'contained',
          color: 'primary',
          onClick: () => {updateMutation.mutate()}
        },
        {
          text: '삭제',
          variant: 'outlined',
          color: 'grey',
          onClick: () => {deleteMutation.mutate()}
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
        <Editor
          name="content"
          value={jsonData.content}
          onChange={handleCustomChange}
        />
      </ul>
    </CommonModal>
  );
}
