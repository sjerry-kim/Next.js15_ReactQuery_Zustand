'use client';

import styles from './MiniBoard.module.css';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface MiniBoardProps {
  title: string;
  subtitle?: string;
  variation: number;
  count: number;
}

export default function MiniBoard({ title, subtitle, variation, count }: MiniBoardProps) {


  return (
    <div className={styles.mini_board_wrapper}>
      <h4>{title}</h4>
      <h1>
        <span
          className={styles.variation}
          style={{ color: variation > 0 ? '#EB5757' : variation < 0 ? '#4F46E5' : '' }}>
          (
          {variation > 0 ? <ArrowDropUpIcon/> : variation < 0 ? <ArrowDropDownIcon /> : ""}
          {variation > 0 ? variation : variation < 0 ? variation.toString().slice(1) : "-"}
          )
        </span>
        {count}
        <span>건</span>
      </h1>
    </div>
  );
}