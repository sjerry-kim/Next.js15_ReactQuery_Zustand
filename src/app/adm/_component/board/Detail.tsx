'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { board } from '@prisma/client';
import styles from './Detail.module.css';
import { getBoard } from '@/services/boardService';
import { useQuery } from '@tanstack/react-query';
import onInputsChange from '@/utils/onInputsChange';
import LabelTextarea from '@/adm/_component/common/inputs/LabelTextarea';
import MenuModal from '@/adm/_component/common/modals/MenuModal';

type PageProps = {
  id: string;
};

interface Tab {
  key: string;
  label: string;
}

export default function Page({ id }: PageProps) {
  const router = useRouter();
  const { data } = useQuery<board>({
    queryKey: ['board', id], // 서버에서 사용한 queryKey와 동일하게 설정
    queryFn: () => getBoard(id), // 동일한 queryFn 사용
    staleTime: 60 * 1000, // 1분동안 캐시 신선함 1분뒤 재요청
    gcTime: 300 * 1000, // 5분뒤 메모리 정리
    enabled: !!id,
  });
  const [jsonData, setJsonData] = useState({
    id: data?.id || 0,
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
  const {handleChange} = onInputsChange(jsonData, setJsonData);

  const handleSubmit = () => router.replace(`/adm/board/${id}/modify`);

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
          text: '수정',
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
              disabled={true}
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
              disabled={true}
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
              disabled={true}
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
              disabled={true}
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
              disabled={true}
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
              disabled={true}
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
              disabled={true}
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
              disabled={true}
              onChange={handleChange}
            />
          </li>
        </ul>
      }
    </MenuModal>
  );
}
