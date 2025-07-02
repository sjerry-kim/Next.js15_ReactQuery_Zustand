'use client';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { CustomTabsProps } from '@/types/components'; // 아래에서 정의할 타입

export default function CustomTabs({
                                     tabs,
                                     activeTabKey,
                                     onTabChange,
                                     ...props // variant, scrollButtons 등 Tabs의 다른 props를 받을 수 있도록
                                   }: CustomTabsProps) {

  // todo 여기서부터 이어서 작업!
  const tabsContainerSx = {
    width: '100%',
    borderBottom: 1,
    borderColor: 'divider',
    // 탭 하단에 움직이는 인디케이터 스타일
    '& .MuiTabs-indicator': {
      backgroundColor: '#1890ff', // 원하는 색상으로 변경
    },
  };

  // 2. 개별 Tab에 공통적으로 적용될 스타일 (호버 효과, 애니메이션 등)
  const commonTabSx = {
    transition: 'background-color 0.3s, color 0.3s',
    '&:hover': {
      backgroundColor: 'rgba(24, 144, 255, 0.08)',
    },
  };


  // 활성 탭과 비활성 탭에 대한 스타일을 sx prop 객체로 정의합니다.
  const activeTabStyle = {
    fontWeight: 700,
    color: 'primary.main', // theme에 정의된 primary 색상 사용
  };

  const inactiveTabStyle = {
    fontWeight: 500,
    color: 'text.secondary', // theme에 정의된 secondary 텍스트 색상 사용
  };

  return (
    <Tabs
      value={activeTabKey}
      onChange={(_event, newValue) => onTabChange(newValue)}
      variant="scrollable"
      scrollButtons="auto"
      sx={tabsContainerSx}
      {...props}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.key}
          label={tab.label}
          value={tab.key}
          sx={{
            ...commonTabSx,
            ...(activeTabKey === tab.key ? activeTabStyle : inactiveTabStyle)
        }}
        />
      ))}
    </Tabs>
  );
}