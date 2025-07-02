'use client';

import { styled } from '@mui/material/styles';
import MuiSwitch, { SwitchProps as MuiSwitchProps } from '@mui/material/Switch';

// 1. `styled`를 사용하여 MUI Switch에 커스텀 스타일을 적용한 새 컴포넌트를 만듭니다.
const CustomStyledSwitch = styled(MuiSwitch)(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    // 스위치가 켜졌을 때 (checked)
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#1677ff', // 켜졌을 때 트랙 색상
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
  },
  // 동그란 손잡이 부분 스타일
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  // 스위치의 배경(트랙) 부분 스타일
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA', // 꺼졌을 때 트랙 색상
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

// 2. 최종적으로 export할 Switch 컴포넌트
// MuiSwitchProps를 그대로 받아 CustomStyledSwitch에 전달합니다.
export default function Switch(props: MuiSwitchProps) {
  return <CustomStyledSwitch {...props} />;
}