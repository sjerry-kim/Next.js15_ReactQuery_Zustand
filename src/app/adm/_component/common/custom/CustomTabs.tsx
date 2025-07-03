'use client';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { CustomTabsProps } from '@/types/components';

export default function CustomTabs({
  tabs,
  activeTabKey,
  onTabChange,
  ...props
}: CustomTabsProps) {

  const tabsContainerSx = {
    width: '100%',
    height: '48px', // 원하는 탭 높이
    borderBottom: 1,
    borderColor: 'divider',
    flexShrink: 0,
    position: 'sticky',
    backgroundColor: '#ffffff',
    top: 0,
    '& .MuiTabs-indicator': {
      backgroundColor: '#A5B4FC', // 인디케이터 색상
    },
    '& .MuiTab-root': {
      minHeight: '48px', // 각 Tab 버튼의 높이
    },
    '& .Mui-selected': {
      color: '#A5B4FC !important', // 선택된 탭의 폰트 색상
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
    },
    '& .MuiTabScrollButton-root': {
      '& .MuiTouchRipple-root': {
        display: 'none',
      },
      '&:hover': {
        backgroundColor: 'rgba(25, 118, 210, 0.08)',
      },
    },
  };

  // 개별 Tab에 공통적으로 적용될 스타일
  const commonTabSx = {
    transition: 'background-color 0.3s, color 0.3s',
    color: '#4B4B4B',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
    },
  };

  // 활성 탭과 비활성 탭에 대한 스타일을 sx prop 객체로 정의합니다.
  // const activeTabStyle = {
  //   fontWeight: 700,
  //   color: '#6366F1', // theme에 정의된 primary 색상 사용
  // };
  //
  // const inactiveTabStyle = {
  //   fontWeight: 500,
  //   color: 'text.secondary', // theme에 정의된 secondary 텍스트 색상 사용
  // };

  return (
    <Tabs
      value={activeTabKey}
      onChange={(_event, newValue) => onTabChange?.(newValue)}
      variant="scrollable"
      scrollButtons="auto"
      allowScrollButtonsMobile
      sx={tabsContainerSx}
      {...props}
    >
      {tabs.map((tab) => (
        <Tab
          disableRipple
          key={tab.key}
          label={tab.label}
          value={tab.key}
          sx={{
            ...commonTabSx,
            // ...(activeTabKey === tab.key ? activeTabStyle : inactiveTabStyle)
        }}
        />
      ))}
    </Tabs>
  );
}