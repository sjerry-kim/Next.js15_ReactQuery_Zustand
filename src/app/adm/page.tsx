"use client";

import { useMemo, useState, useRef, useEffect } from 'react';
import ChartFrame from '@/adm/_component/dash/ChartFrame';
import SalesChart from '@/adm/_component/dash/SalesChart';
import UserAgePieChart from '@/adm/_component/dash/UserAgePieChart';
import styles from './page.module.css';
import moment from 'moment';
import { faker } from '@faker-js/faker';

// 매출 현황 통계 임시 데이터 생성
const generateSalesData  = () => {
  const startDate = moment('2024-01-01'); const endDate = moment(); const data = [];
  for (let m = moment(startDate); m.isSameOrBefore(endDate, 'day'); m.add(1, 'days')) {
    data.push({ date: m.format('YYYY-MM-DD'), sales: faker.number.int({ min: 10, max: 100 }) });
  }
  return data;
};

// 회원 연령 분포 임시 데이터 생성
const generateUserData = () => {
  const startDate = moment('2024-01-01');
  const endDate = moment();
  const data = [];
  const ageGroups = ['10대', '20대', '30대', '40대', '50대 이상'];
  for (let m = moment(startDate); m.isSameOrBefore(endDate, 'day'); m.add(1, 'days')) {
    // 하루에 0~10명의 신규 유저가 가입한다고 가정
    const dailySignups = faker.number.int({ min: 0, max: 10 });
    for (let i = 0; i < dailySignups; i++) {
      data.push({
        date: m.format('YYYY-MM-DD'),
        ageGroup: faker.helpers.arrayElement(ageGroups),
      });
    }
  }
  return data;
};

export default function Page() {
  const salesMasterData   = useMemo(() => generateSalesData (), []);
  const userMasterData = useMemo(() => generateUserData(), []);
  const salesSectionRef = useRef<HTMLElement>(null); // SalesChart section 너비 계산용
  const [salesSectionWidth, setSalesSectionWidth] = useState(0);

  // 각 차트를 감싸고 있는 Element의 width를 감지하기 위한 useEffect
  useEffect(() => {
    const targetElement = salesSectionRef.current;

    if (!targetElement) return;

    // 크기 변경을 감지
    const observer = new ResizeObserver(entries => {
      if (entries[0]) setSalesSectionWidth(entries[0].contentRect.width);
    });
    observer.observe(targetElement); // 관찰 시작

    return () => { observer.unobserve(targetElement); }; // 메모리 누수 방지
  }, []);

  return (
    <main className={styles.dash_main}>
      <div className={styles.dash_top}>
        <section ref={salesSectionRef} className={styles.chart_wrapper}>
          <article className={styles.continual_chart_container}>
            {/* salesSectionWidth가 측정되었을 때만 렌더링 */}
            {salesSectionWidth > 0 && (
              <ChartFrame title="매출 현황 통계" masterData={salesMasterData} filterUIType="timeline">
                {(appliedFilters) => (
                  <SalesChart
                    appliedFilters={appliedFilters}
                    masterData={salesMasterData  }
                    sectionWidth={salesSectionWidth}
                  />
                )}
              </ChartFrame>
            )}
          </article>
        </section>
        <section className={styles.chart_wrapper}>
          <article className={styles.chart_container}>
            <ChartFrame title="회원 연령 분포" masterData={userMasterData} filterUIType="categorical">
              {(appliedFilters) => (
                <UserAgePieChart
                  appliedFilters={appliedFilters}
                  masterData={userMasterData}
                />
              )}
            </ChartFrame></article>
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