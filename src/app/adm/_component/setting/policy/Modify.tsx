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
import LabelEditor from '@/adm/_component/common/inputs/LabelEditor';
import { useConfirm } from '@/hooks/useConfirm';

type PageProps = {
  id: string;
};

export default function Modify({ id }: PageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
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
  const {showSnackbar} = useSnackbar();
  const openConfirm = useConfirm();
  const {handleChange, handleCustomChange} = onInputsChange(jsonData, setJsonData);

  // 수정
  const handleSubmit = () => {
    updateMutation.mutate();
  };

  // 삭제
  const handleDelete = async () => {
    const userConfirmed = await openConfirm({
      title: "정말 삭제하시겠습니까?",
      message: "삭제하시면 해당 데이터를 복구할 수 없습니다.",
    });

    if (userConfirmed) {
      deleteMutation.mutate();
    } else {
      console.log("취소!");
    }
  };

  // 수정 mutation
  const updateMutation = useMutation<ApiResponse<Board>, Error>({
    mutationFn: async () => updateTerm(Number(id), jsonData),
    async onSuccess(res) {
      // 리스트 갱신
      queryClient.invalidateQueries({ queryKey: ['termList'] });

      // 게시물 갱신
      queryClient.setQueryData(['term', id], { data: res.data}); // response 형식 확인 필수

      router.back();
    },
    onError() {
      showSnackbar("통신 오류가 발생하였습니다.", "error")
    },
  });

  // 삭제 mutation
  const deleteMutation = useMutation<ApiResponse<Board>, Error>({
    mutationFn: async () => deleteTerm(Number(id)),
    async onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['termList'] });
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
      modalTitle="수정"
      buttons={[
        {
          text: '삭제',
          variant: 'outlined',
          color: 'grey',
          onClick: handleDelete
        },
        {
          text: '저장',
          variant: 'contained',
          color: 'primary',
          onClick: handleSubmit
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
