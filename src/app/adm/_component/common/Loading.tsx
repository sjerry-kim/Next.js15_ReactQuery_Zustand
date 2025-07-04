'use client';

import { CircularProgress, LinearProgress } from '@mui/material';
import styles from './Loading.module.css';
import { LoadingProps } from '@/types/components';
import Box from '@mui/material/Box';
import useWindowSize from '@/hooks/useWindowSize.';
import { COLORS } from '@/_constant/colorConstants';

export default function Loading({type = "circle", title, subTitle} : LoadingProps) {
  const { isMobile } = useWindowSize();

  const circleProgressStyle = {
    color: COLORS.primary.DEFAULT,
  };

  const linearProgressStyle = {
    height: 5,
    // borderRadius: 4,
    '& .MuiLinearProgress-bar': {
      backgroundColor:  COLORS.primary.DEFAULT,
    },
    backgroundColor:  COLORS.primary.light,
  };

  return (
    <div className={styles.wrapper}>
      {
        type === "circle" &&
        <CircularProgress
          size={40}
          thickness={4}
          className={styles.spinner}
          sx={circleProgressStyle}
        />
      }
      {title && <div className={styles.title}>{title}</div>}
      {subTitle && <div className={styles.sub_title}>{subTitle}</div>}
      {
        type === "line" &&
        <Box sx={{ width: '60%', padding: "30px" }}>
          <LinearProgress sx={linearProgressStyle} />
        </Box>
      }
    </div>
  );
}
