'use client';

import {
  Chart as ChartJS, LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions, Chart,
} from 'chart.js';
import { faker } from '@faker-js/faker';
import styles from './Sales.module.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import moment, { Moment } from 'moment';
import 'moment/locale/ko';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import useWindowSize from '@/hooks/useWindowSize.';

// Chart.js 등록 및 기본 설정
ChartJS.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const generateMasterData = () => {
  const startDate = moment('2024-01-01');
  const endDate = moment();
  const data = [];
  for (let m = moment(startDate); m.isSameOrBefore(endDate, 'day'); m.add(1, 'days')) {
    data.push({ date: m.format('YYYY-MM-DD'), sales: faker.number.int({ min: 10, max: 100 }) });
  }
  return data;
};

// Chart.js 옵션
const options: ChartOptions<'line'> = {
  responsive: false,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      align: 'start'
    }
  },
  scales: {
    y: {
      ticks: {
        stepSize: 10,
        maxTicksLimit: 10, // 최대 눈금 수 제한
        callback: (value) => `${value}` },
      beginAtZero: false
    },
    x: {
      ticks: {
        stepSize: 1,
        maxTicksLimit: 31,
        maxRotation: 0,
        minRotation: 0
      }
    }
  }
};

export default function Sales() {
  const masterData = useMemo(() => generateMasterData(), []);
  const yearOptions = useMemo(() => Array.from(new Set(masterData.map(item => moment(item.date).year()))).sort((a, b) => b - a), [masterData]);
  const defaultFilterType = 'monthly';
  const defaultYear = moment().year();
  const defaultMonth = moment().month() + 1;
  const [filterType, setFilterType] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
  const [startDate, setStartDate] = useState<Moment | null>(null);
  const [endDate, setEndDate] = useState<Moment | null>(null);
  const [chartData, setChartData] = useState({ labels: [] as string[], datasets: [] as any[] });
  const [chartWidth, setChartWidth] = useState(590);
  const scrollChartRef = useRef<HTMLCanvasElement>(null);
  const yAxisChartRef = useRef<HTMLCanvasElement>(null);
  const { isMobile } = useWindowSize(); // isLaptop은 현재 사용되지 않으므로 제거해도 무방

  const updateChartByCriteria = (
    type: string,
    year: number,
    month: number,
    start: Moment | null,
    end: Moment | null
  ) => {
    let newLabels: string[] = [];
    let newSalesData: number[] = [];

    if (type === 'yearly') {
      const yearlySales = masterData.reduce((acc, item) => {
        const itemYear = moment(item.date).format('YYYY');
        acc[itemYear] = (acc[itemYear] || 0) + item.sales;
        return acc;
      }, {} as Record<string, number>);
      newLabels = Object.keys(yearlySales).sort();
      newSalesData = newLabels.map(y => yearlySales[y]);
    }
    else if (type === 'monthly') {
      const monthlySales = masterData
        .filter(item => moment(item.date).year() === year)
        .reduce((acc, item) => {
          const m = moment(item.date).format('M월');
          acc[m] = (acc[m] || 0) + item.sales;
          return acc;
        }, {} as Record<string, number>);
      const sortedMonths = Array.from({length: 12}, (_, i) => `${i+1}월`);
      newLabels = sortedMonths.filter(m => monthlySales[m] !== undefined);
      newSalesData = newLabels.map(m => monthlySales[m]);
    }
    else if (type === 'weekly') {
      const weeklySales: Record<string, number> = {};
      const weeklyLabels: Record<string, string> = {};
      masterData
        .filter(item => moment(item.date).year() === year && (moment(item.date).month() + 1) === month)
        .forEach(item => {
          const weekOfMonth = `${Math.ceil(moment(item.date).date() / 7)}주차`;
          weeklySales[weekOfMonth] = (weeklySales[weekOfMonth] || 0) + item.sales;
          if(!weeklyLabels[weekOfMonth]){
            const weekStart = moment(item.date).startOf('week').format('MM.DD');
            const weekEnd = moment(item.date).endOf('week').format('MM.DD');
            weeklyLabels[weekOfMonth] = `${weekOfMonth} (${weekStart}~${weekEnd})`
          }
        });
      newLabels = Object.keys(weeklySales).sort();
      newSalesData = newLabels.map(week => weeklySales[week]);
      newLabels = newLabels.map(week => weeklyLabels[week]);
    }
    else if (type === 'custom' && start && end) {
      const filtered = masterData.filter(item => moment(item.date).isBetween(start, end, 'day', '[]'));
      newLabels = filtered.map(item => item.date);
      newSalesData = filtered.map(item => item.sales);
    }

    setChartData({
      labels: newLabels,
      datasets: [{
        label: '매출 (단위: 만원)',
        data: newSalesData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0,
        clip: true,
      }],
    });

    console.log(newLabels)
    console.log(chartWidth)
    // console.log(Math.max(600, newLabels.length * 70))
    // setChartWidth(Math.max(600, newLabels.length * 70));

    if (newSalesData.length > 12) {
      setChartWidth(Math.max(600, newLabels.length * 70));
    }
  };

  // 필터 검색
  const handleSearch = () => {
    updateChartByCriteria(filterType, selectedYear, selectedMonth, startDate, endDate);
  };

  // 필터 초기화
  const handleReset = () => {
    // UI 상태를 기본값으로 되돌림
    setFilterType(defaultFilterType);
    setSelectedYear(defaultYear);
    setSelectedMonth(defaultMonth);
    setStartDate(moment().subtract(1, 'month'));
    setEndDate(moment());

    // 기본값 기준으로 즉시 차트를 업데이트
    updateChartByCriteria(defaultFilterType, defaultYear, defaultMonth, moment().subtract(1, 'month'), moment());
  };

  useEffect(() => {
    handleSearch();
  }, [chartWidth]);

// 차트 렌더링 로직
  useEffect(() => {
    const canvas = scrollChartRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const yAxisCloner = {
      id: 'yAxisCloner',
      afterDraw: (chart: Chart) => {
        if (!yAxisChartRef.current || !chart.chartArea) return;

        const yAxisCanvas = yAxisChartRef.current;
        const { chartArea } = chart;
        const copyWidth = chartArea.left -5;
        const copyHeight = chartArea.bottom + 5;

        if (yAxisCanvas.width !== copyWidth || yAxisCanvas.height !== copyHeight) {
          yAxisCanvas.width = copyWidth;
          yAxisCanvas.height = copyHeight;
          yAxisCanvas.style.height = `${copyHeight}px`;
        }

        const yAxisCtx = yAxisCanvas.getContext('2d');

        if (!yAxisCtx) return;

        yAxisCtx.clearRect(0, 0, copyWidth, copyHeight);
        yAxisCtx.drawImage(chart.canvas, 0, 0, copyWidth, copyHeight, 0, 0, copyWidth, copyHeight); }
    };

    const chart = new ChartJS( ctx, {
      type: 'line',
      data: chartData,
      options,
      plugins: [yAxisCloner], });

    return () => { chart.destroy(); };
  }, [chartData, chartWidth]);

  const renderFilters = () => {
    switch (filterType) {
      case 'yearly':
        // 연단위는 추가 필터 없음
        return null;
      case 'monthly':
        // 월단위는 연도 선택
        return (
          <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}년</option>
            ))}
          </select>
        );
      case 'weekly':
        // 주단위는 연도와 월 선택
        return (
          <>
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
              {yearOptions.map(year => (
                <option key={year} value={year}>{year}년</option>
              ))}
            </select>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>{month}월</option>
              ))}
            </select>
          </>
        );
      case 'custom':
        // 직접 설정은 DatePicker와 검색 버튼
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}>
            <DatePicker label="시작일" value={startDate} onChange={(val) => setStartDate(val)} slotProps={{ textField: { size: 'small' } }}/>
            <span>~</span>
            <DatePicker label="종료일" value={endDate} onChange={(val) => setEndDate(val)} slotProps={{ textField: { size: 'small' } }}/>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="ko">
      {
        !isMobile ?
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', padding: '16px' }}>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="yearly">연단위</option>
              <option value="monthly">월단위</option>
              <option value="weekly">주단위</option>
              <option value="custom">직접 설정</option>
            </select>
            {renderFilters()}
            <button onClick={handleSearch}>필터</button>
            <button onClick={handleReset}>초기화</button>
          </div> : 
          <button>필터 조건</button>
      }

      <div className={styles.chartWrapper}>
        <canvas ref={yAxisChartRef} className={styles.chart_y} />
        <div className={styles.chartAreaWrapper}>
          <canvas ref={scrollChartRef} width={chartWidth} height="365" style={{ width: `${chartWidth}px`, height: '365px' }} />
        </div>
      </div>
    </LocalizationProvider>
  );
}