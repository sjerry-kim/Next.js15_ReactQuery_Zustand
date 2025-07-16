'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import styles from './List.module.css';
import Accordion from '@/adm/_component/common/custom/Accordion';
import AccordionGroup from '@/adm/_component/common/custom/AccordionGroup';
import Loading from '@/adm/_component/common/Loading';
import type { Board } from '@/types/board';

interface tempItem {
  idx: number;
  title: string;
}

interface JsonData {
  tempList: tempItem[] | [];
}

export default function List() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [jsonData, setJsonData] = useState<JsonData>({
    tempList: [],
  });


  // todo 🔥 원페이지 여기서부터 작업 끊김!
  useEffect(() => {
    const getTempList = () => {

      const tempList = [
        {idx: 1, title: '첫번째 게시물'},
        {idx: 2, title: '두번째 게시물'},
        {idx: 3, title: '세번째 게시물'},
        {idx: 4, title: '네번째 게시물'},
        {idx: 5, title: '다섯번째 게시물'},
      ];

      setJsonData((prevState) => ({
        ...prevState,
        tempList: tempList,
      }))
    }

    getTempList();
  }, [])

  return (
    <>
      <main className={styles.main}>
        <section className={styles.page_wrapper}>
          <div className={styles.top}>
            <h3>카테고리</h3>
          </div>
          <div className={styles.bottom}>
            <table className={styles.table}>
              <thead>
              <tr>
                <th>No.</th>
                <th>ID</th>
                <th>제목 (내용)</th>
                <th>금액</th>
                <th>작성일</th>
                <th>수정일</th>
              </tr>
              </thead>
              <tbody>
              {
                jsonData.tempList.length > 0 && (
                  jsonData.tempList.map((item,index) => (
                  <tr key={index}>
                    <td>{item.title}</td>
                    <td>{item.title}</td>
                    <td>{item.title}</td>
                  </tr>
                ))
              )}
              </tbody>
            </table>

          </div>
        </section>
      </main>
    </>
  );
}