'use client';

import React from 'react';
import { SnackbarContent, useSnackbar, CustomContentProps } from 'notistack';
import { styled } from '@mui/material/styles';
import {
  CheckCircleOutline as SuccessIcon,
  WarningAmber as WarningIcon,
  InfoOutlined as InfoIcon,
  ErrorOutline as ErrorIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { COLORS } from '@/_constant/colorConstants';
import styles from './CustomSnackbar.module.css'

// 아이콘을 variant에 따라 매핑합니다.
const ICONS = {
  success: <SuccessIcon />,
  warning: <WarningIcon />,
  error: <ErrorIcon />,
  info: <InfoIcon />,
};

const StyledSnackbar = styled(SnackbarContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '8px',
  borderRadius: '8px',
  padding: '3px 12px',
  fontSize: '0.8125rem',
  fontWeight: 500,
  boxShadow: '0 2px 4px -1px rgba(0,0,0,0.12), 0 4px 6px 0 rgba(0,0,0,0.1), 0 1px 10px 0 rgba(0,0,0,0.1)',
  color: 'white',
  '& .MuiSnackbarContent-message': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
}));

// 2. 이제 단 하나의 커스텀 스낵바 컴포넌트만 존재합니다.
const CustomSnackbar = React.forwardRef<HTMLDivElement, CustomContentProps>(
  (
    {
      // 우리가 직접 사용할 props
      message,
      id,
      variant,

      // HTML에 전달되면 안 되는 notistack 전용 props들
      persist,
      anchorOrigin,
      autoHideDuration,
      hideIconVariant,
      iconVariant,

      // 나머지 진짜 HTML 속성들 (e.g., style, className)
      ...restProps
    }, ref) => {
    const { closeSnackbar } = useSnackbar();

    // 3. variant에 맞는 아이콘과 색상 팔레트를 선택합니다. (기본값은 info)
    const Icon = ICONS[variant as keyof typeof ICONS] || <InfoIcon />;
    const palette = COLORS[variant as keyof typeof COLORS] || COLORS.info;

    return (
      <StyledSnackbar
        ref={ref}
        {...restProps}
        // 4. sx prop에 COLOR 객체의 bg, text 값을 동적으로 적용합니다.
        sx={{ // @ts-ignore
          backgroundColor: palette.bg, // @ts-ignore
          color: palette.text,
        }}
      >
        <div className={styles.content_box}>
          { /* @ts-ignore */}
          <span style={{ color: palette.DEFAULT }}>{Icon}</span>
          {message}
        </div>
        <IconButton
          size="small"
          disableRipple={true}
          onClick={() => closeSnackbar(id)}
        >
          { /* @ts-ignore */}
          <CloseIcon sx={{ color: palette.text }} fontSize="small" />
        </IconButton>
      </StyledSnackbar>
    );
  }
);

// 5. default로 export하여 Provider에서 사용하기 쉽게 합니다.
export default CustomSnackbar;