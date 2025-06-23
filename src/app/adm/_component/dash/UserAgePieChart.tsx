'use client';

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/ko';
import { FilterState } from './TimelineFilterControls';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  appliedFilters: FilterState;
  masterData: { date: string, ageGroup: string }[];
}

export default function UserAgePieChart({ appliedFilters, masterData }: PieChartProps) {
  const [chartData, setChartData] = useState<{ labels: string[], datasets: any[] }>({ labels: [], datasets: [] });
  const [legendPosition, setLegendPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top');
  const [layoutPaddingRight, setLayoutPaddingRight] = useState(50);
  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1, // 1:1 정사각형 비율
    plugins: {
      legend: {
        position: legendPosition,
        labels: {
          padding: 30, // 레전드 항목과 차트 사이 간격 증가
          boxWidth: 30,
        },
      },
      title: {
        display: false,
        text: '기간 내 회원 연령 분포',
      },
    },
    layout: {
      padding: {
        top: 10,
        right: layoutPaddingRight,
      },
    }
  };

  useEffect(() => {
    // 반응형으로 legend 위치 조절
    const handleResize = () => {
      const isUnderLaptop = window.innerWidth < 1024;
      setLegendPosition( isUnderLaptop ? 'bottom' : 'right');
      setLayoutPaddingRight( isUnderLaptop ? 0 : 50);
    };

    handleResize(); // 초기 실행

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const { type, year, month, week, startDate, endDate } = appliedFilters;

    let filteredData: { date: string, ageGroup: string }[] = [];

    if (type === 'custom' && startDate && endDate) {
      filteredData = masterData.filter(item =>
        moment(item.date).isBetween(startDate, endDate, 'day', '[]')
      );
    }
    else if (type === 'yearly') {
      filteredData = masterData.filter(item =>
        moment(item.date).year() === year
      );
    }
    else if (type === 'monthly') {
      filteredData = masterData.filter(item =>
        moment(item.date).year() === year && moment(item.date).month() + 1 === month
      );
    }
    /* 1. 주차 기준을 일요일-토요일(달력 기준)으로 삼음 */
    else if (type === 'weekly') {
      // 1. 월의 시작일과 끝일
      const firstDayOfMonth = moment({ year, month: month - 1 }).startOf('month');
      const lastDayOfMonth = moment({ year, month: month - 1 }).endOf('month');

      // 2. 첫 번째 주의 시작일: 1일이 포함된 주의 일요일
      const startOfFirstWeek = firstDayOfMonth.clone().startOf('week'); // 일요일 기준

      // 3. 선택된 주차의 시작/끝 계산
      const startOfWeek = startOfFirstWeek.clone().add(week - 1, 'weeks');
      const endOfWeek = startOfWeek.clone().endOf('week');


      // 4. 필터링: 해당 주 안에 있고, 해당 월에 포함되는 날짜만 포함
      filteredData = masterData.filter(item => {
        const itemDate = moment(item.date);
        return (
          itemDate.isBetween(startOfWeek, endOfWeek, 'day', '[]') &&
          itemDate.isBetween(firstDayOfMonth, lastDayOfMonth, 'day', '[]')
        );
      });
    }
    /* 2. 주차 기준을 월요일-일요일으로 삼음 */
    // else if (type === 'weekly') {
    //   // 1. 월의 시작일과 끝일
    //   const firstDayOfMonth = moment({ year, month: month - 1 }).startOf('month');
    //   const lastDayOfMonth = moment({ year, month: month - 1 }).endOf('month');
    //
    //   // ✅ 2. 첫 번째 주의 시작일: 1일이 포함된 주의 월요일
    //   const startOfFirstWeek = firstDayOfMonth.clone().startOf('isoWeek'); // 월요일 시작
    //
    //   // ✅ 3. 선택된 주차의 시작/끝 계산 (n번째 주차)
    //   const startOfWeek = startOfFirstWeek.clone().add(week - 1, 'weeks');
    //   const endOfWeek = startOfWeek.clone().endOf('isoWeek'); // 일요일 끝
    //
    //   // ✅ 4. 필터링: 해당 주 안에 있고, 해당 월에 포함되는 날짜만 포함
    //   filteredData = masterData.filter(item => {
    //     const itemDate = moment(item.date);
    //     return (
    //       itemDate.isBetween(startOfWeek, endOfWeek, 'day', '[]') &&
    //       itemDate.isBetween(firstDayOfMonth, lastDayOfMonth, 'day', '[]')
    //     );
    //   });
    // }

    // 필터링된 데이터를 바탕으로 '연령대별'로 데이터를 집계
    const ageGroupCounts = filteredData.reduce((acc, user) => {
      acc[user.ageGroup] = (acc[user.ageGroup] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const newLabels = Object.keys(ageGroupCounts);
    const newData = Object.values(ageGroupCounts);

    //Pie 차트 형식에 맞는 데이터셋으로 가공
    setChartData({
      labels: newLabels,
      datasets: [
        {
          label: '사용자 수',
          data: newData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)', 'rgba(255, 159, 64, 0.5)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    });

  }, [appliedFilters, masterData]);

  return (
    <div style={{ position: 'relative', height: '350px', width: '80%' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
}