// 'use client';
//
// import { useState, useRef, useEffect, useMemo } from 'react';
// import styles from './page.module.css'
// import Sales from '@/adm/_component/dash/Sales';
// import ChartFrame from '@/adm/_component/dash/ChartFrame';
// import SalesChart from '@/adm/_component/dash/SalesChart';
// import moment from 'moment';
// import { faker } from '@faker-js/faker';
//
// export default function Page() {
//   const [jsonData, setJsonData] = useState({ content: "" });
//   // line-chart width 감지용 ref
//   const lineChartSectionRef = useRef<HTMLElement>(null);
//   const [lineSectionWidth, setLineSectionWidth] = useState(0);
//
//   const generateMasterData = () => {
//     const startDate = moment('2024-01-01');
//     const endDate = moment();
//     const data = [];
//     for (let m = moment(startDate); m.isSameOrBefore(endDate, 'day'); m.add(1, 'days')) {
//       data.push({ date: m.format('YYYY-MM-DD'), sales: faker.number.int({ min: 10, max: 100 }) });
//     }
//     return data;}
//
//   // 각 차트를 감싸고 있는 Element의 width를 감지하기 위한 useEffect
//   useEffect(() => {
//     const lineChartElement = lineChartSectionRef.current;
//     if (!lineChartElement) return;
//
//     // 크기 변경을 감지
//     const observer = new ResizeObserver(entries => {
//       // entries[0]가 우리가 관찰하는 요소에 대한 정보를 담고 있음
//       if (entries[0]) {
//         const width = entries[0].contentRect.width;
//         // 측정된 너비로 state 업데이트
//         setLineSectionWidth(width);
//       }
//     });
//
//     // 관찰 시작
//     observer.observe(lineChartElement);
//
//     // 메모리 누수 방지
//     return () => {
//       observer.unobserve(lineChartElement);
//     };
//   }, []);
//
//   const masterData = useMemo(() => generateMasterData(), []);
//
//
//   return (
//     <>
//       <main className={styles.dash_main}>
//         <div className={styles.dash_top}>
//           <section ref={lineChartSectionRef} className={styles.chart_wrapper}>
//             <article className={styles.continual_chart_container}>
//               {/*<Sales sectionWidth={lineSectionWidth} />*/}
//               {/* ChartFrame이 필터를 책임지고, SalesChart가 내용물을 그립니다. */}
//               <ChartFrame title="매출 현황 통계" masterData={masterData}>
//                 {(appliedFilters) => (
//                   <SalesChart appliedFilters={appliedFilters} masterData={masterData} />
//                 )}
//               </ChartFrame>
//             </article>
//           </section>
//           <section className={styles.chart_wrapper}>
//             <article className={styles.chart_container}>2</article>
//           </section>
//         </div>
//         <div className={styles.dash_bottom}>
//           <section className={styles.chart_wrapper}>
//             <article className={styles.continual_chart_container}>3</article>
//           </section>
//           <section className={styles.info_wrapper}>
//             <div className={styles.info_wrapper_top}>
//               <article className={styles.info_container}>4</article>
//               <article className={styles.info_container}>5</article>
//             </div>
//             <div className={styles.info_wrapper_bottom}>
//               <article className={styles.info_container}>6</article>
//               <article className={styles.info_container}>7</article>
//             </div>
//           </section>
//         </div>
//       </main>
//     </>
//   );
// }

"use client";

import { useMemo, useState, useRef, useEffect } from 'react';
import styles from './page.module.css';
import ChartFrame from '@/adm/_component/dash/ChartFrame';
import SalesChart from '@/adm/_component/dash/SalesChart'; // 파일명 변경에 주의
import moment from 'moment';
import { faker } from '@faker-js/faker';

const generateMasterData = () => {
  const startDate = moment('2024-01-01'); const endDate = moment(); const data = [];
  for (let m = moment(startDate); m.isSameOrBefore(endDate, 'day'); m.add(1, 'days')) {
    data.push({ date: m.format('YYYY-MM-DD'), sales: faker.number.int({ min: 10, max: 100 }) });
  }
  return data;
};

export default function Page() {
  const masterData = useMemo(() => generateMasterData(), []);

  const sectionRef = useRef<HTMLElement>(null);
  const [sectionWidth, setSectionWidth] = useState(0);

  useEffect(() => {
    const targetElement = sectionRef.current;
    if (!targetElement) return;
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        setSectionWidth(entries[0].contentRect.width);
      }
    });
    observer.observe(targetElement);
    return () => { observer.unobserve(targetElement); };
  }, []);

  return (
    <main className={styles.dash_main}>
      <div className={styles.dash_top}>
        <section ref={sectionRef} className={styles.chart_wrapper}>
          <article className={styles.continual_chart_container}>
            {/* sectionWidth가 측정되었을 때만 렌더링 */}
            {sectionWidth > 0 && (
              <ChartFrame title="매출 현황 통계" masterData={masterData}>
                {(appliedFilters) => (
                  <SalesChart
                    appliedFilters={appliedFilters}
                    masterData={masterData}
                    sectionWidth={sectionWidth}
                  />
                )}
              </ChartFrame>
            )}
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
  );
}