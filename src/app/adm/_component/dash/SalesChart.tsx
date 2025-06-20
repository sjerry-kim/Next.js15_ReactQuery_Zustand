'use client';

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions, Chart } from 'chart.js';
import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import 'moment/locale/ko';
import styles from './Sales.module.css';
import { FilterState } from './ChartFrame'; // 타입을 ChartFrame에서 가져옵니다.

// Chart.js 등록 및 기본 옵션
ChartJS.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const options: ChartOptions<'line'> = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom', align: 'start' } },
  scales: {
    y: { ticks: { stepSize: 10, maxTicksLimit: 10, callback: (value) => `${value}` }, beginAtZero: false },
    x: { ticks: { stepSize: 1, maxTicksLimit: 31, maxRotation: 0, minRotation: 0 } }
  }
};

interface SalesChartProps {
  appliedFilters: FilterState;
  masterData: { date: string, sales: number }[];
  sectionWidth: number;
}

export default function SalesChart({ appliedFilters, masterData, sectionWidth }: SalesChartProps) {
  const [chartData, setChartData] = useState<{ labels: string[], datasets: any[] }>({ labels: [], datasets: [] });
  const [chartWidth, setChartWidth] = useState(sectionWidth);

  const chartRef = useRef<ChartJS<'line'>>(null);
  const yAxisChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let newLabels: string[] = [];
    let newSalesData: number[] = [];
    const { type, year, month, startDate, endDate } = appliedFilters;

    // 데이터 집계 로직 (사용자님 로직 그대로 복원)
    if (type === 'yearly') {
      const yearlySales = masterData.reduce((acc, item) => { const itemYear = moment(item.date).format('YYYY'); acc[itemYear] = (acc[itemYear] || 0) + item.sales; return acc; }, {} as Record<string, number>);
      newLabels = Object.keys(yearlySales).sort(); newSalesData = newLabels.map(y => yearlySales[y]);
    } else if (type === 'monthly') {
      const monthlySales = masterData.filter(item => moment(item.date).year() === year).reduce((acc, item) => { const m = moment(item.date).format('M월'); acc[m] = (acc[m] || 0) + item.sales; return acc; }, {} as Record<string, number>);
      const sortedMonths = Array.from({ length: 12 }, (_, i) => `${i + 1}월`); newLabels = sortedMonths.filter(m => monthlySales[m] !== undefined); newSalesData = newLabels.map(m => monthlySales[m]);
    } else if (type === 'weekly') {
      const weeklySales: Record<string, number> = {}; const weeklyLabels: Record<string, string> = {};
      masterData.filter(item => moment(item.date).year() === year && moment(item.date).month() + 1 === month)
        .forEach(item => {
          const weekOfMonth = `${Math.ceil(moment(item.date).date() / 7)}주차`;
          weeklySales[weekOfMonth] = (weeklySales[weekOfMonth] || 0) + item.sales;
          if (!weeklyLabels[weekOfMonth]) {
            const weekStart = moment(item.date).startOf('week').format('MM.DD');
            const weekEnd = moment(item.date).endOf('week').format('MM.DD');
            weeklyLabels[weekOfMonth] = `${weekOfMonth} (${weekStart}~${weekEnd})`;
          }
        });
      const sortedWeeks = Object.keys(weeklySales).sort((a, b) => parseInt(a) - parseInt(b));
      newLabels = sortedWeeks.map(week => weeklyLabels[week]);
      newSalesData = sortedWeeks.map(week => weeklySales[week]);
    } else if (type === 'custom' && startDate && endDate) {
      const filtered = masterData.filter(item => moment(item.date).isBetween(startDate, endDate, 'day', '[]'));
      newLabels = filtered.map(item => item.date); newSalesData = filtered.map(item => item.sales);
    }

    setChartData({
      labels: newLabels,
      datasets: [{ label: '매출 (단위: 만원)', data: newSalesData, borderColor: 'rgb(75, 192, 192)', backgroundColor: 'rgba(75, 192, 192, 0.2)', tension: 0, clip: false }],
    });

    // chartWidth 계산 로직 (사용자님 로직 그대로 복원)
    setChartWidth(newLabels.length > 12 ? Math.max(600, newLabels.length * 70) : (sectionWidth > 10 ? sectionWidth - 10 : 880));

  }, [appliedFilters, masterData, sectionWidth]);

  // Y축 복제 플러그인 (사용자님 로직 그대로 복원)
  const yAxisCloner = {
    id: 'yAxisCloner',
    afterDraw: (chart: Chart) => {
      if (!yAxisChartRef.current || !chart.chartArea) return;
      const yAxisCanvas = yAxisChartRef.current; const { chartArea } = chart; const dpr = chart.currentDevicePixelRatio || 1;
      const logicalCopyWidth =  chartArea.left -5; const logicalCopyHeight = chartArea.bottom + 3; const logicalSourceY = chartArea.top - 5;
      const physicalCopyWidth = logicalCopyWidth * dpr; const physicalCopyHeight = logicalCopyHeight * dpr;
      if (yAxisCanvas.width !== physicalCopyWidth || yAxisCanvas.height !== physicalCopyHeight) {
        yAxisCanvas.width = physicalCopyWidth; yAxisCanvas.height = physicalCopyHeight;
        yAxisCanvas.style.width = `${logicalCopyWidth}px`; yAxisCanvas.style.height = `${logicalCopyHeight}px`;
        yAxisCanvas.style.top = `${logicalSourceY}px`;
      }
      const yAxisCtx = yAxisCanvas.getContext('2d'); if (!yAxisCtx) return;
      yAxisCtx.clearRect(0, 0, physicalCopyWidth, physicalCopyHeight);
      yAxisCtx.drawImage(chart.canvas, 0, logicalSourceY * dpr, logicalCopyWidth * dpr, logicalCopyHeight * dpr, 0, 0, physicalCopyWidth, physicalCopyHeight);
    }
  };

  return (
    <>
      <canvas ref={yAxisChartRef} className={styles.chart_y} />
      <div className={styles.chartAreaWrapper}>
        <div style={{ width: `${chartWidth}px`, height: '365px' }}>
          <Line ref={chartRef} data={chartData} options={options} plugins={[yAxisCloner]} />
        </div>
      </div>
    </>
  );
}