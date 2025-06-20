'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css'
import Sales from '@/adm/_component/dash/Sales';

export default function Page() {
  const [jsonData, setJsonData] = useState({ content: "" });
  // line-chart width 감지용 ref
  const lineChartSectionRef = useRef<HTMLElement>(null);
  const [lineSectionWidth, setLineSectionWidth] = useState(0);

  // 각 차트를 감싸고 있는 Element의 width를 감지하기 위한 useEffect
  useEffect(() => {
    const lineChartElement = lineChartSectionRef.current;
    if (!lineChartElement) return;

    // 크기 변경을 감지
    const observer = new ResizeObserver(entries => {
      // entries[0]가 우리가 관찰하는 요소에 대한 정보를 담고 있음
      if (entries[0]) {
        const width = entries[0].contentRect.width;
        // 측정된 너비로 state 업데이트
        setLineSectionWidth(width);
      }
    });

    // 관찰 시작
    observer.observe(lineChartElement);

    // 메모리 누수 방지
    return () => {
      observer.unobserve(lineChartElement);
    };
  }, []);

  return (
    <>
      <main className={styles.dash_main}>
        <div className={styles.dash_top}>
          <section ref={lineChartSectionRef} className={styles.chart_wrapper}>
            <article className={styles.continual_chart_container}>
              <Sales sectionWidth={lineSectionWidth} />
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