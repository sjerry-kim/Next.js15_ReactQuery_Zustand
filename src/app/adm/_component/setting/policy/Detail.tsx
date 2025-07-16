'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Detail.module.css';
import { useQuery } from '@tanstack/react-query';
import onInputsChange from '@/utils/onInputsChange';
import { getTerm } from '@/services/termsServices';
import CommonModal from '@/adm/_component/common/modals/CommonModal';
import LabelInput from '@/adm/_component/common/inputs/LabelInput';

type PageProps = {
  id: string;
};

export default function Detail({ id }: PageProps) {
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
  const {handleChange} = onInputsChange(jsonData, setJsonData);

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
      modalTitle="상세"
      buttons={[
        {
          text: '수정',
          variant: 'contained',
          color: 'primary',
          onClick: () => router.replace(`/adm/setting/policy/${id}/modify`),
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
          disabled={true}
          onChange={handleChange}
        />
        <div dangerouslySetInnerHTML={{ __html: jsonData.content }} />
      </ul>
    </CommonModal>
  );
}
