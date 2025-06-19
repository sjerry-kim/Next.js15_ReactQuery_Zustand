'use client';

import styles from './CommonModal.module.css';
import CloseIcon from '@mui/icons-material/Close';
import { ReactNode } from 'react';

// 1. 버튼 개별 속성을 위한 타입 정의
export interface ModalButton {
  text: string;
  onClick: () => void;
  color?: 'primary' | 'grey' | 'info' | 'danger' | 'warn' | 'success'; // 버튼 색상 옵션
  variant?: 'contained' | 'outlined'; // 버튼 스타일 옵션
}

// 2. ModalProps에서 기존 버튼 관련 props를 제거하고 buttons 배열을 받도록 수정
interface ModalProps {
  modalTitle?: string;
  onClose: () => void;
  children: ReactNode;
  buttons?: ModalButton[]; // 버튼 배열을 옵셔널하게 받음
}

export default function CommonModal({
  modalTitle = "",
  onClose,
  children,
  buttons = [], // 기본값을 빈 배열로 설정
}: ModalProps) {
  return (
    <div className={styles.modalBackground}>
      <div className={styles.modal_wrapper}>
        <div className={styles.top_container}>
          <h4>{modalTitle}</h4>
          <button className={styles.close_btn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className={styles.child_container}>{children}</div>

        {/* 3. buttons 배열의 길이가 0보다 클 때만 버튼 컨테이너를 렌더링 */}
        {buttons.length > 0 && (
          <div className={styles.bottom_container}>
            {/* 4. buttons 배열을 순회하며 동적으로 버튼 생성 */}
            {buttons.map((button, index) => {
              // 동적 클래스 이름 생성: 기본 스타일 + variant + color
              const buttonClasses = [
                styles.button, // 기본 버튼 스타일
                styles[button.variant || 'outlined'], // variant 스타일
                styles[button.color || 'white'],   // color 스타일
              ].join(' ');

              return (
                <button
                  key={`${button.text}-${index}`}
                  className={buttonClasses}
                  onClick={button.onClick}
                >
                  {button.text}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}