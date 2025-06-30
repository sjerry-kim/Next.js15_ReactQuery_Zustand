'use client';

import styles from './CommonModal.module.css';
import CloseIcon from '@mui/icons-material/Close';
import { CSSProperties } from 'react';
import { CommonModalProps } from '@/types/modal';
import Button from '@/adm/_component/common/Button'

export default function CommonModal({
                                      children,
                                      modalTitle = "",
                                      buttons = [],
                                      width,
                                      maxWidth,
                                      minWidth,
                                      height,
                                      maxHeight,
                                      minHeight,
                                      onClose,
                                    }: CommonModalProps) {

  // 3. props를 기반으로 동적 스타일 객체 생성
  // React.CSSProperties 타입을 사용하면 자동 완성과 타입 체크에 용이합니다.
  const modalStyle: CSSProperties = {
    width,
    height,
    maxWidth,
    maxHeight,
    minWidth,
    minHeight,
  };

  return (
    <div className={styles.modalBackground}>
      {/* 4. 생성된 스타일 객체를 모달 래퍼에 적용 */}
      <div className={styles.modal_wrapper} style={modalStyle}>
        <div className={styles.top_container}>
          <h4>{modalTitle}</h4>
          <button className={styles.close_btn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className={styles.child_container}>{children}</div>

        {buttons.length > 0 && (
          <div className={styles.bottom_container}>
            {/*{buttons.map((button, index) => {*/}
            {/*  const buttonClasses = [*/}
            {/*    styles.button,*/}
            {/*    styles[button.variant || 'outlined'],*/}
            {/*    styles[button.color || 'white'],*/}
            {/*  ].join(' ');*/}

            {/*  return (*/}
            {/*    <button*/}
            {/*      key={`${button.text}-${index}`}*/}
            {/*      className={buttonClasses}*/}
            {/*      onClick={button.onClick}*/}
            {/*    >*/}
            {/*      {button.text}*/}
            {/*    </button>*/}
            {/*  );*/}
            {/*})}*/}

            {buttons.map((buttonProps, index) => (
              <Button
                key={`${buttonProps.text}-${index}`}
                {...buttonProps}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}