"use client";

import { useMemo, useState, useRef, useEffect } from 'react';
import ChartFrame from '@/adm/_component/dash/chart/ChartFrame';
import SalesChart from '@/adm/_component/dash/chart/SalesChart';
import UserAgePieChart from '@/adm/_component/dash/chart/UserAgePieChart';
import SignupTrendBarChart from '@/adm/_component/dash/chart/SignupTrendBarChart';
import styles from './page.module.css';
import moment from 'moment';
import { faker } from '@faker-js/faker';
import MiniBoard from '@/adm/_component/dash/MiniBoard';
import { redirect } from 'next/navigation';

// 매출 현황 통계 임시 데이터 생성
// const generateSalesData = () => {
//   const startDate = moment('2024-01-01');
//   const endDate = moment();
//   const data = [];
//   for (let m = moment(startDate); m.isSameOrBefore(endDate, 'day'); m.add(1, 'days')) {
//     // 1. 서울과 부산의 매출을 각각 생성합니다.
//     const seoulSales = faker.number.int({ min: 10, max: 60 });
//     const busanSales = faker.number.int({ min: 5, max: 40 });
//
//     data.push({
//       date: m.format('YYYY-MM-DD'),
//       seoul: seoulSales,
//       busan: busanSales,
//       // 2. 전체 매출은 두 지역의 합계로 계산합니다.
//       total: seoulSales + busanSales,
//     });
//   }
//   return data;
// };
//
//
// // 회원 연령 분포 임시 데이터 생성
// const generateUserData = () => {
//   const startDate = moment('2024-01-01');
//   const endDate = moment();
//   const data = [];
//   const ageGroups = ['10대', '20대', '30대', '40대', '50대 이상'];
//   for (let m = moment(startDate); m.isSameOrBefore(endDate, 'day'); m.add(1, 'days')) {
//     // 하루에 0~10명의 신규 유저가 가입한다고 가정
//     const dailySignups = faker.number.int({ min: 0, max: 10 });
//     for (let i = 0; i < dailySignups; i++) {
//       data.push({
//         date: m.format('YYYY-MM-DD'),
//         ageGroup: faker.helpers.arrayElement(ageGroups),
//       });
//     }
//   }
//   return data;
// };
//
// // 회원가입 데이터 생성
// const generateSignupData = () => {
//   const startDate = moment('2024-01-01');
//   const endDate = moment();
//   const data = [];
//   for (let m = moment(startDate); m.isSameOrBefore(endDate, 'day'); m.add(1, 'days')) {
//     data.push({
//       date: m.format('YYYY-MM-DD'),
//       // -5(탈퇴) ~ 20(가입) 사이의 순증감 값
//       regularNetChange: faker.number.int({ min: -20, max: 20 }),
//       // -2(탈퇴) ~ 5(가입) 사이의 순증감 값
//       guideNetChange: faker.number.int({ min: -5, max: 5 }),
//     });
//   }
//   return data;
// };

export default function Page() {
  // const salesMasterData   = useMemo(() => generateSalesData (), []);
  // const userMasterData = useMemo(() => generateUserData(), []);
  // const signupMasterData = useMemo(() => generateSignupData(), []);
  // const salesSectionRef = useRef<HTMLElement>(null); // SalesChart section 너비 계산용
  // const [salesSectionWidth, setSalesSectionWidth] = useState(0);
  // const signupSectionRef = useRef<HTMLElement>(null); // SalesChart section 너비 계산용
  // const [signupSectionWidth, setSignupSectionWidth] = useState(0);
  //
  // // 각 차트를 감싸고 있는 Element의 width를 감지하기 위한 useEffect
  // useEffect(() => {
  //   const salesTargetElement = salesSectionRef.current;
  //   const signupTargetElement = signupSectionRef.current;
  //
  //   if (!salesTargetElement || !signupTargetElement) return;
  //
  //   // 크기 변경 감지
  //   const observer = new ResizeObserver(entries => {
  //     if (entries[0]) setSalesSectionWidth(entries[0].contentRect.width);
  //     if (entries[0]) setSignupSectionWidth(entries[0].contentRect.width);
  //   });
  //
  //   // 관찰 시작
  //   observer.observe(salesTargetElement);
  //   observer.observe(signupTargetElement);
  //
  //   // 메모리 누수 방지
  //   return () => {
  //     observer.unobserve(salesTargetElement);
  //     observer.unobserve(signupTargetElement);
  //   };
  // }, []);

  return null;
    // <main className={styles.dash_main}>
    //   <div className={styles.dash_top}>
    //     <section ref={salesSectionRef} className={styles.chart_wrapper}>
    //       <article className={styles.continual_chart_container}>
    //         {/* salesSectionWidth가 측정되었을 때만 렌더링 */}
    //         {salesSectionWidth > 0 && (
    //           <ChartFrame title="매출 현황 통계" masterData={salesMasterData} filterUIType="timeline">
    //             {(appliedFilters) => (
    //               <SalesChart
    //                 appliedFilters={appliedFilters}
    //                 masterData={salesMasterData}
    //                 sectionWidth={salesSectionWidth}
    //               />
    //             )}
    //           </ChartFrame>
    //         )}
    //       </article>
    //     </section>
    //     <section className={styles.chart_wrapper}>
    //       <article className={styles.chart_container}>
    //         <ChartFrame title="회원 연령 분포" masterData={userMasterData} filterUIType="categorical">
    //           {(appliedFilters) => (
    //             <UserAgePieChart
    //               appliedFilters={appliedFilters}
    //               masterData={userMasterData}
    //             />
    //           )}
    //         </ChartFrame></article>
    //     </section>
    //   </div>
    //   <div className={styles.dash_bottom}>
    //     <section ref={signupSectionRef} className={styles.chart_wrapper}>
    //       <article className={styles.continual_chart_container}>
    //         {signupSectionWidth > 0 && (
    //           <ChartFrame title="회원가입 추이" masterData={signupMasterData} filterUIType="timeline">
    //             {(appliedFilters) => (
    //               <SignupTrendBarChart
    //                 appliedFilters={appliedFilters}
    //                 masterData={signupMasterData}
    //                 sectionWidth={signupSectionWidth}
    //               />
    //             )}
    //           </ChartFrame>
    //         )}
    //       </article>
    //     </section>
    //     <section className={styles.info_wrapper}>
    //       <div className={styles.info_wrapper_top}>
    //         <article className={styles.info_container}>
    //           <MiniBoard title={"오늘 결제 건수"} variation={10} count={121} />
    //         </article>
    //         <article className={styles.info_container}>
    //           <MiniBoard title={"오늘 취소 건수"} variation={0} count={34} />
    //         </article>
    //       </div>
    //       <div className={styles.info_wrapper_bottom}>
    //         <article className={styles.info_container}>
    //           <MiniBoard title={"오늘 접속자 수"} variation={56} count={2037} />
    //         </article>
    //         <article className={styles.info_container}>
    //           <MiniBoard title={"오늘 회원가입 수"} variation={-12} count={89} />
    //         </article>
    //       </div>
    //     </section>
    //   </div>
    // </main>
}