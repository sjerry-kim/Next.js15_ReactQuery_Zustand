"use client";

import dynamic from 'next/dynamic';
import { useState } from 'react';
import styles from './page.module.css'
import Sales from '@/adm/_component/dash/Sales';
import useWindowSize from '@/hooks/useWindowSize.';

export default function Page() {
  const [jsonData, setJsonData] = useState({
    content: "",
  });
  // const {handleCustomChange} = onTextChange(jsonData, setJsonData);
  const { isMobile } = useWindowSize(); // isLaptop은 현재 사용되지 않으므로 제거해도 무방


  return (
    <>
      <main className={styles.dash_main}>
        <div className={styles.dash_top}>
          <section className={styles.chart_wrapper}>
            <article className={styles.continual_chart_container}>
              <Sales />
            </article>
          </section>
          <section className={styles.chart_wrapper}>
            <article className={styles.chart_container}>2</article>
          </section>
        </div>
        <div className={styles.dash_bottom}>
          <section className={styles.chart_wrapper}>
            <article className={styles.continual_chart_container}>3</article>
          </section>
          <section className={styles.info_wrapper}>
            <div className={styles.info_wrapper_top}>
              <article className={styles.info_container}>4</article>
              <article className={styles.info_container}>5</article>
            </div>
            <div className={styles.info_wrapper_bottom}>
              <article className={styles.info_container}>6</article>
              <article className={styles.info_container}>7</article>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
