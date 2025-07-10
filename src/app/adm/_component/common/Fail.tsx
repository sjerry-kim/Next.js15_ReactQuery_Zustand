'use client';

import Image from 'next/image';
import styles from './Fail.module.css'
import Button from '@/adm/_component/common/buttons/Button';
import { MdError } from "react-icons/md";
import { FailProps } from '@/types/components';
import { COLORS } from '@/_constant/colorConstants';

export default function Fail({
  title = '문제가 발생했습니다!',
  subTitle = '새로고침하거나 관리자에게 문의해 주세요.',
  height = '80dvh',
  showButton = true,
}: FailProps) {
  return (
    <div className={styles.wrapper} style={{ height: height }}>
      <MdError fill={COLORS.neutral['250']} />
      <div className={styles.comment}>
        <h2>{title}</h2>
        <p>{subTitle}</p>
        {showButton && <Button text="새로 고침" onClick={() => window.location.reload()} /> }
      </div>
    </div>
  );
}