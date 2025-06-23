'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Chart,
} from 'chart.js';
import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import 'moment/locale/ko';
import styles from './SignupTrendBarChart.module.css';
import { FilterState } from './TimelineFilterControls';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options: ChartOptions<'bar'> = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom', align: 'start' } },
  scales: {
    y: {
      ticks: { stepSize: 10, maxTicksLimit: 10, callback: (value) => `${value}` },
      beginAtZero: false // 음수 값을 위해 false 유지
    },
    x: { ticks: { stepSize: 1, maxTicksLimit: 31, maxRotation: 0, minRotation: 0 } }
  }
};

interface SignupChartProps {
  appliedFilters: FilterState;
  masterData: { date: string, regularNetChange: number, guideNetChange: number }[];
  sectionWidth: number;
}

export default function SignupTrendChart({ appliedFilters, masterData, sectionWidth }: SignupChartProps) {
  const [chartData, setChartData] = useState<{ labels: string[], datasets: any[] }>({ labels: [], datasets: [] });
  const [chartWidth, setChartWidth] = useState(sectionWidth);
  const chartRef = useRef<ChartJS<'bar'>>(null);
  const yAxisChartRef = useRef<HTMLCanvasElement>(null);


  useEffect(() => {
    let newLabels: string[] = [];
    let newRegularData: number[] = [];
    let newGuideData: number[] = [];

    const { type, year, month, startDate, endDate } = appliedFilters;

    if (type === 'yearly') {
      const yearlySignups = masterData.reduce((acc, item) => {
        const itemYear = moment(item.date).format('YYYY');
        if (!acc[itemYear]) acc[itemYear] = { regular: 0, guide: 0 };
        acc[itemYear].regular += item.regularNetChange;
        acc[itemYear].guide += item.guideNetChange;
        return acc;
      }, {} as Record<string, { regular: number, guide: number }>);
      newLabels = Object.keys(yearlySignups).sort();
      newRegularData = newLabels.map(y => yearlySignups[y].regular);
      newGuideData = newLabels.map(y => yearlySignups[y].guide);
    }
    else if (type === 'monthly') {
      const monthlySignups = masterData.filter(item => moment(item.date).year() === year).reduce((acc, item) => {
        const m = moment(item.date).format('M월');
        if (!acc[m]) acc[m] = { regular: 0, guide: 0 };
        acc[m].regular += item.regularNetChange;
        acc[m].guide += item.guideNetChange;
        return acc;
      }, {} as Record<string, { regular: number, guide: number }>);
      const sortedMonths = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);
      newLabels = sortedMonths.filter(m => monthlySignups[m] !== undefined);
      newRegularData = newLabels.map(m => monthlySignups[m].regular);
      newGuideData = newLabels.map(m => monthlySignups[m].guide);
    }
    else if (type === 'weekly') {
      const weeklySignups: Record<string, { regular: number, guide: number }> = {}; const weeklyLabels: Record<string, string> = {};
      masterData.filter(item => moment(item.date).year() === year && moment(item.date).month() + 1 === month).forEach(item => { const date = moment(item.date); const weekKey = date.clone().startOf('week').format('YYYY-MM-DD'); if (!weeklySignups[weekKey]) { weeklySignups[weekKey] = { regular: 0, guide: 0 }; weeklyLabels[weekKey] = `${date.clone().startOf('week').format('D일')}-${date.clone().endOf('week').format('D일')}`; } weeklySignups[weekKey].regular += item.regularNetChange; weeklySignups[weekKey].guide += item.guideNetChange; });
      const sortedWeekKeys = Object.keys(weeklySignups).sort();
      newLabels = sortedWeekKeys.map(key => weeklyLabels[key]);
      newRegularData = sortedWeekKeys.map(key => weeklySignups[key].regular);
      newGuideData = sortedWeekKeys.map(key => weeklySignups[key].guide);
    }
    else if (type === 'custom' && startDate && endDate) {
      const filtered = masterData.filter(item => moment(item.date).isBetween(startDate, endDate, 'day', '[]'));
      newLabels = filtered.map(item => item.date);
      newRegularData = filtered.map(item => item.regularNetChange);
      newGuideData = filtered.map(item => item.guideNetChange);
    }

    setChartData({
      labels: newLabels,
      datasets: [
        {
          label: '일반회원 순증감',
          data: newRegularData,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
        {
          label: '가이드회원 순증감',
          data: newGuideData,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ],
    });
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
      <div className={styles.chart_area_wrapper}>
        <div style={{ width: `${chartWidth}px`, height: '340px', paddingRight: '20px' }}>
          <Bar ref={chartRef} data={chartData} options={options} plugins={[yAxisCloner]}/>
        </div>
      </div>
    </>
  );
}