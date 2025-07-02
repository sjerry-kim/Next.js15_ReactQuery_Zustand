'use client';

import { styled } from '@mui/material/styles';
import MuiSwitch, { SwitchProps as MuiSwitchProps } from '@mui/material/Switch';

const CustomStyledSwitch = styled(MuiSwitch)(({ theme }) => ({
  width: 32,
  height: 18,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 1,
    margin: 1,
    transitionDuration: '200ms',
    '&.Mui-checked': {
      transform: 'translateX(14px)', // 이동 거리 축소
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#6366F1',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 14,
    height: 14,
  },
  '& .MuiSwitch-track': {
    borderRadius: 18 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
  '& .MuiSwitch-input': {
    cursor: 'pointer',
  },
}));


export default function Switch(props: MuiSwitchProps) {
  return <CustomStyledSwitch {...props} />;
}