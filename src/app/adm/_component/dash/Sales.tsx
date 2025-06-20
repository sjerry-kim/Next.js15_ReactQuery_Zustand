'use client';

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions, Chart } from 'chart.js';
import { faker } from '@faker-js/faker';
import styles from './Sales.module.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import moment, { Moment } from 'moment';
import 'moment/locale/ko';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import useWindowSize from '@/hooks/useWindowSize.';
import { LuSearch } from "react-icons/lu";
import { MdOutlineReplay } from "react-icons/md";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CommonModal from '@/adm/_component/common/CommonModal';
import { CommonModalButton } from '@/types/modal';

// Chart.js 등록 및 기본 설정 (변경 없음)
ChartJS.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const generateMasterData = () => {
  const startDate = moment('2024-01-01'); const endDate = moment(); const data = [];
  for (let m = moment(startDate); m.isSameOrBefore(endDate, 'day'); m.add(1, 'days')) { data.push({ date: m.format('YYYY-MM-DD'), sales: faker.number.int({ min: 10, max: 100 }) }); }
  return data;
};

// Chart.js 옵션
const options: ChartOptions<'line'> = {
  responsive: true, // 부모 div의 크기로 제어
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      align: 'start'
    },
    // legend: false,
  },
  scales: {
    y: {
      ticks: {
        stepSize: 10,
        maxTicksLimit: 10,
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

interface FilterState {
  type: string;
  year: number;
  month: number;
  startDate: Moment | null;
  endDate: Moment | null;
}

interface SalesProps {
  sectionWidth: number;
}

export default function Sales({ sectionWidth }: SalesProps) {
  const masterData = useMemo(() => generateMasterData(), []);
  const yearOptions = useMemo(() => Array.from(new Set(masterData.map(item => moment(item.date).year()))).sort((a, b) => b - a), [masterData]);
  const initialFilters: FilterState = {
    type: 'monthly',
    year: moment().year(),
    month: moment().month() + 1,
    startDate: null,
    endDate: null,
  };
  const [draftFilters, setDraftFilters] = useState<FilterState>(initialFilters); // UI 선택값을 담는 임시 상태
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialFilters); // '검색' 눌렀을 때만 업데이트되는 실제 적용 상태
  const [chartData, setChartData] = useState<{ labels: string[], datasets: any[] }>({ labels: [], datasets: [] });
  const [chartWidth, setChartWidth] = useState(sectionWidth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const chartRef = useRef<ChartJS<'line'>>(null);
  const yAxisChartRef = useRef<HTMLCanvasElement>(null);
  const { isLaptop, isDesktop } = useWindowSize();

  const handleFilterChange = (name: string, value: any) => {
    setDraftFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setAppliedFilters(draftFilters);
    if (isModalOpen) setIsModalOpen(false);
  };

  const modalButtons: CommonModalButton[] = [{ text: '필터 적용', onClick: handleSearch, color: 'grey' }];

  const handleReset = () => {
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  const handleModalOpen = () => {
    setDraftFilters(appliedFilters);
    setIsModalOpen(true);
  };

  // Y축 복제 플러그인: react-chartjs-2
  const yAxisCloner = {
    id: 'yAxisCloner',
    afterDraw: (chart: Chart) => {
      if (!yAxisChartRef.current || !chart.chartArea) return;

      const yAxisCanvas = yAxisChartRef.current;
      const { chartArea } = chart;

      // 1. Chart.js가 사용 중인 실제 Device Pixel Ratio를 가져옴
      const dpr = chart.currentDevicePixelRatio || window.devicePixelRatio || 1;

      // 2. 모든 크기와 위치를 논리적 픽셀 기준으로 먼저 계산함.
      const logicalCopyWidth =  chartArea.left -5;
      const logicalCopyHeight = chartArea.bottom + 3;
      const logicalSourceY = chartArea.top - 5;

      // 3. 캔버스의 실제 그릴 공간(물리적 픽셀)은 DPR을 곱해 설정함.
      const physicalCopyWidth = logicalCopyWidth * dpr;
      const physicalCopyHeight = logicalCopyHeight * dpr;

      if (yAxisCanvas.width !== physicalCopyWidth || yAxisCanvas.height !== physicalCopyHeight) {
        yAxisCanvas.width = physicalCopyWidth;
        yAxisCanvas.height = physicalCopyHeight;

        // 4. 캔버스의 CSS 크기(화면에 보이는 크기)는 논리적 픽셀로 설정함.
        yAxisCanvas.style.width = `${logicalCopyWidth}px`;
        yAxisCanvas.style.height = `${logicalCopyHeight}px`;
        yAxisCanvas.style.top = `${logicalSourceY}px`;
      }

      const yAxisCtx = yAxisCanvas.getContext('2d');
      if (!yAxisCtx) return;

      yAxisCtx.clearRect(0, 0, physicalCopyWidth, physicalCopyHeight);

      // 5. drawImage의 모든 좌표와 크기도 DPR을 곱한 물리적 픽셀 기준으로 사용함.
      yAxisCtx.drawImage(
        chart.canvas,                     // 소스: 이미 고해상도인 메인 캔버스
        0,                                // 소스 x
        logicalSourceY * dpr,             // 소스 y
        logicalCopyWidth * dpr,           // 소스 너비
        logicalCopyHeight * dpr,          // 소스 높이
        0,                                // 대상 x
        0,                                // 대상 y
        physicalCopyWidth,                // 대상 너비
        physicalCopyHeight                // 대상 높이
      );
    }
  };

  const commonDatePickerStyle = {
    size: 'small',
    fullWidth: false,
    variant: 'outlined',
    inputProps: { readOnly: false },
    InputLabelProps: { shrink: true },
    sx: {
      width: isDesktop ? '105px' : "100%",
      border: '1px solid #D0D4DA',
      borderRadius: '0.375rem',
      padding: '1px 8px',
      backgroundColor: '#FFF',
      fontSize: '0.75rem',       // font size 변경
      letterSpacing: '-0.35px',
      color: '#4b4b4b',          // font color 변경
      backgroundImage: 'none',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 12px center',
      backgroundSize: '12px',
      '& input': {
        all: 'unset',
        width: '100%',
        fontSize: '0.75rem',     // input 내부 폰트 크기 변경
        letterSpacing: '-0.35px',
        color: '#4b4b4b',        // input 내부 폰트 색상 변경
        lineHeight: 1.625,
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
      },
      '& .MuiOutlinedInput-root': {
        padding: 0,
      },
      '& .MuiInputAdornment-root': {
        marginLeft: 0,
      },
    },
  };




  // 필터 UI 렌더링
  const renderFilters = () => {
    switch (draftFilters.type) {
      case 'yearly':
        return null;

      case 'monthly':
        return (
          <select
            value={draftFilters.year}
            className={styles.select}
            onChange={(e) => handleFilterChange('year', Number(e.target.value))}
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>
                {year}년
              </option>
            ))}
          </select>
        );

      case 'weekly':
        return (
          <>
            <select
              value={draftFilters.year}
              className={styles.select}
              onChange={(e) => handleFilterChange('year', Number(e.target.value))}
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>
                  {year}년
                </option>
              ))}
            </select>

            <select
              value={draftFilters.month}
              className={styles.select}
              onChange={(e) => handleFilterChange('month', Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>
                  {month}월
                </option>
              ))}
            </select>
          </>
        );

      case 'custom':
        return (
          <div className={styles.datepicker_box}>
            {/*<DatePicker*/}
            {/*  // label="시작일"*/}
            {/*  value={draftFilters.startDate}*/}
            {/*  onChange={(val) => handleFilterChange('startDate', val)}*/}
            {/*  slotProps={{ textField: { size: 'small' } }}*/}
            {/*/>*/}
            {/*<span>~</span>*/}
            {/*<DatePicker*/}
            {/*  // label="종료일"*/}
            {/*  value={draftFilters.endDate}*/}
            {/*  onChange={(val) => handleFilterChange('endDate', val)}*/}
            {/*  slotProps={{ textField: { size: 'small' } }}*/}
            {/*/>*/}

            <DatePicker
              value={draftFilters.startDate}
              onChange={(val) => handleFilterChange('startDate', val)}
              slotProps={{
                textField: { placeholder: "시작일 선택", ...commonDatePickerStyle} as any,
                actionBar: {
                  actions: ['cancel', 'accept'],
                },
                popper: {
                  sx: {
                    '& .MuiPaper-root': {
                      '@media (max-width: 600px)': {
                        width: 306,
                      },
                    },
                  },
                },
                openPickerButton: {
                  disableRipple: true,
                  sx: {
                    padding: 1,
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                    '&:focus': {
                      backgroundColor: 'transparent',
                    },
                  },
                },
              }}
              componentsProps={{
                openPickerIcon: {
                  sx: { fontSize: '0.55rem' },
                },
                openPickerButton: {
                  disableRipple: true,
                  sx: {
                    padding: 1,
                    fontSize: '0.75rem',
                    '&:hover': { backgroundColor: 'transparent' },
                    '&:focus': { backgroundColor: 'transparent' },
                  },
                },
              }}
              localeText={{
                cancelButtonLabel: '취소',
                okButtonLabel: '확인',
              }}
              desktopModeMediaQuery="@media (min-width: 0px)"
            />

            <span>~</span>

            <DatePicker
              value={draftFilters.endDate}
              onChange={(val) => handleFilterChange('endDate', val)}
              slotProps={{
                textField: { placeholder: "종료일 선택", ...commonDatePickerStyle} as any,
                actionBar: {
                  actions: ['cancel', 'accept'],
                },
                popper: {
                  sx: {
                    '& .MuiPaper-root': {
                      '@media (max-width: 600px)': {
                        width: 306,
                      },
                    },
                  },
                },
                openPickerButton: {
                  disableRipple: true,
                  sx: {
                    padding: 1,
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                    '&:focus': {
                      backgroundColor: 'transparent',
                    },
                  },
                },
              }}
              componentsProps={{
                openPickerIcon: {
                  sx: { fontSize: '0.55rem' },
                },
                openPickerButton: {
                  disableRipple: true,
                  sx: {
                    padding: 1,
                    fontSize: '0.75rem',
                    '&:hover': { backgroundColor: 'transparent' },
                    '&:focus': { backgroundColor: 'transparent' },
                  },
                },
              }}
              localeText={{
                cancelButtonLabel: '취소',
                okButtonLabel: '확인',
              }}
              desktopModeMediaQuery="@media (min-width: 0px)"
            />



          </div>
        );

      default:
        return null;
    }
  };

  // 차트는 'appliedFilters'가 바뀔 때만 업데이트
  useEffect(() => {
    let newLabels: string[] = [];
    let newSalesData: number[] = [];
    const { type, year, month, startDate, endDate } = appliedFilters;

    if (type === 'yearly') {
      const yearlySales = masterData.reduce((acc, item) => {
        const itemYear = moment(item.date).format('YYYY');
        acc[itemYear] = (acc[itemYear] || 0) + item.sales;
        return acc;
      }, {} as Record<string, number>);
      newLabels = Object.keys(yearlySales).sort();
      newSalesData = newLabels.map(y => yearlySales[y]);
    } else if (type === 'monthly') {
      const monthlySales = masterData
        .filter(item => moment(item.date).year() === year)
        .reduce((acc, item) => {
          const m = moment(item.date).format('M월');
          acc[m] = (acc[m] || 0) + item.sales;
          return acc;
        }, {} as Record<string, number>);
      const sortedMonths = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);
      newLabels = sortedMonths.filter(m => monthlySales[m] !== undefined);
      newSalesData = newLabels.map(m => monthlySales[m]);
    } else if (type === 'weekly') {
      const weeklySales: Record<string, number> = {};
      const weeklyLabels: Record<string, string> = {};
      masterData
        .filter(item => moment(item.date).year() === year && moment(item.date).month() + 1 === month)
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
      newLabels = filtered.map(item => item.date);
      newSalesData = filtered.map(item => item.sales);
    }

    setChartData({
      labels: newLabels,
      datasets: [
        {
          label: '매출 (단위: 만원)',
          data: newSalesData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0,
          clip: false,
        },
      ],
    });

    setChartWidth(newLabels.length > 12 ? Math.max(600, newLabels.length * 70) : (sectionWidth - 10));

  }, [appliedFilters, masterData, sectionWidth]);

  useEffect(() => { setAppliedFilters(initialFilters); }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="ko">
      <div className={styles.chart_top_wrapper}>
        <h4>매출 현황 통계</h4>
        <div className={styles.filter_container}>
          { isDesktop ? (
            <>
              <select name="type" value={draftFilters.type} className={styles.select} onChange={(e) => handleFilterChange('type', e.target.value)}>
                <option value="yearly">연도별 보기</option>
                <option value="monthly">월별 보기</option>
                <option value="weekly">주별 보기</option>
                <option value="custom">기간 직접 선택</option>
              </select>
              {renderFilters()}
              <div title={"필터 적용"} className={styles.filter_btn} onClick={handleSearch}><LuSearch /></div>
              <div title={"필터 초기화"} className={styles.filter_btn} onClick={handleReset}><MdOutlineReplay /></div>
            </>
          ) : (
            <>
              <button title={"필터"} className={styles.filter_btn} onClick={handleModalOpen}><FilterAltIcon /></button>
              <div title={"필터 초기화"} className={styles.filter_btn} onClick={handleReset}><MdOutlineReplay /></div>
            </>
          )}
        </div>
      </div>
      <div className={styles.chartWrapper}>
        <canvas ref={yAxisChartRef} className={styles.chart_y} />
        <div className={styles.chartAreaWrapper}>
          <div style={{ width: `${chartWidth}px`, height: '365px' }}>
            <Line ref={chartRef} data={chartData} options={options} plugins={[yAxisCloner]} />
          </div>
        </div>
      </div>

      { isModalOpen && (
        <CommonModal
          modalTitle="필터"
          buttons={modalButtons}
          width="400px"
          maxWidth="90%"
          height="350px"
          onClose={() => setIsModalOpen(false)}
        >
          <div className={styles.content_container}>
            <select name="type" value={draftFilters.type} className={styles.select} onChange={(e) => handleFilterChange('type', e.target.value)}>
              <option value="yearly">연도별 보기</option>
              <option value="monthly">월별 보기</option>
              <option value="weekly">주별 보기</option>
              <option value="custom">기간 직접 선택</option>
            </select>
            <div className={styles.filter_bottom_box}>
              {renderFilters()}
            </div>
          </div>
        </CommonModal>
      )}
    </LocalizationProvider>
  );
}