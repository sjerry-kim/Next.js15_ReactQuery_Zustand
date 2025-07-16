'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import styles from './List.module.css';
import Accordion from '@/adm/_component/common/custom/Accordion';
import AccordionGroup from '@/adm/_component/common/custom/AccordionGroup';

export default function List() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  return (
    <>
      <main className={styles.main}>
        <section className={styles.page_wrapper}>
          <div className={styles.top}>
            <h3>카테고리</h3>
          </div>
          <div className={styles.bottom}>
            <AccordionGroup defaultOpenId={['1']}>
              <Accordion id="1" title="검색 및 필터">
                <p>여기에 검색 필터들을 넣으세요.</p>
                <input placeholder="검색어..." />
              </Accordion>

              <Accordion id="2" title="데이터 목록">
                <p>여기에 데이터 테이블이나 카드 목록을 넣으세요.</p>
              </Accordion>
            </AccordionGroup>

          </div>
        </section>
      </main>
    </>
  );
}