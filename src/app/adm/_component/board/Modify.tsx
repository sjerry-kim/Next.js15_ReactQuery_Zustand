'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { board } from '@prisma/client';
import styles from './Modify.module.css';
import { deleteBoard, getBoard, updateBoard } from '@/services/boardService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import onInputsChange from '@/utils/onInputsChange';
import { Board, BoardUpdatePayload } from '@/types/board';
import { useSnackbar } from '@/hooks/useSnackbar';
import LabelTextarea from '@/adm/_component/common/inputs/LabelTextarea';
import MenuModal from '@/adm/_component/common/modals/MenuModal';
import { useConfirm } from '@/hooks/useConfirm';

type PageProps = {
  id: string;
};

interface Tab {
  key: string;
  label: string;
}

export default function Page({ id }: PageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useQuery<board>({
    queryKey: ['board', id], // 서버에서 사용한 queryKey와 동일하게 설정
    queryFn: () => getBoard(id), // 동일한 queryFn 사용
    staleTime: 60 * 1000, // 1분동안 캐시 신선함 1분뒤 재요청
    gcTime: 300 * 1000, // 5분뒤 메모리 정리
    enabled: !!id,
  });
  const [currentTab, setCurrentTab] = useState<string>("info");
  const [jsonData, setJsonData] = useState({
    id: data?.id || 0,
    content: '',
    data1: "",
    data2: "",
    data3: "",
  });
  const tabs: Tab[] = [
    { key: 'info', label: '정보 입력' },
    { key: 'option', label: '옵션 설정' },
    { key: 'confirm', label: '최종 확인' },
  ]
  const {handleChange} = onInputsChange(jsonData, setJsonData);
  const {showSnackbar} = useSnackbar();
  const openConfirm = useConfirm();

  // 수정
  const handleSubmit = () => {
    updateMutation.mutate({ id: Number(id), data: jsonData });
  };

  // 삭제
  const handleDelete = async () => {
    const userConfirmed = await openConfirm({
      title: "정말 삭제하시겠습니까?",
      message: "삭제하시면 해당 데이터를 복구할 수 없습니다.",
    });

    if (userConfirmed) {
      deleteMutation.mutate(Number(id));
    } else {
      console.log("취소!");
    }
  };

  // 수정 mutation
  const updateMutation = useMutation<ApiResponse<Board>, Error, { id: number; data: BoardUpdatePayload }>({
    mutationFn: (variables: { id: number; data: BoardUpdatePayload }) =>
      updateBoard(variables.id, variables.data),
    async onSuccess(res) {
      // 'boardList'로 시작하는 모든 목록 관련 쿼리를 무효화
      queryClient.invalidateQueries({ queryKey: ['boardList'] });

      // board 갱신
      queryClient.setQueryData(['board', id], res.data);

      router.back();
    },
    onError() {
      showSnackbar("통신 오류가 발생하였습니다.", "error")
    },
  });

  // 삭제 mutation
  const deleteMutation = useMutation<ApiResponse<Board>, Error, number>({
    mutationFn: (id: number) => deleteBoard(id),
    async onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['boardList'] });
      router.back();
    },
    onError(error) {
      console.error(error);
      showSnackbar("통신 오류가 발생하였습니다.", "error")
    },
  });

  useEffect(() => {
    if (data) {
      setJsonData((prevState)=>({
        ...prevState,
        content: data.content,
      }));
    }
  }, [data]);

  return (
    <MenuModal
      modalTitle="설정"
      onClose={() => router.back()}
      tabs={tabs}
      buttons={[
        {
          text: '삭제',
          variant: 'contained',
          color: 'error',
          onClick: handleDelete,
        },
        {
          text: '저장',
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
              placeholder="정보2을 입력하세요"
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
