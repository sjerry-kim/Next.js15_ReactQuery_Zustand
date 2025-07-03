'use client';

import styles from './MenuModal.module.css';
import CloseIcon from '@mui/icons-material/Close';
import { CSSProperties, useState } from 'react';
import { MemuModalProps } from '@/types/modal';
import Button from '@/adm/_component/common/buttons/Button'
import useWindowSize from '@/hooks/useWindowSize.';
import CustomTabs from '@/adm/_component/common/custom/CustomTabs';
import { LuDot } from 'react-icons/lu';

export default function MenuModal({
  children,
  modalTitle = "",
  buttons = [],
  width = "1100px",
  maxWidth = "90%",
  minWidth,
  height = "700px",
  maxHeight = "90%",
  minHeight,
  tabs,
  defaultTabKey,
  onTabChange,
  onClose,
}: MemuModalProps) {
  const [activeTabKey, setActiveTabKey] = useState(defaultTabKey || tabs[0]?.key);
  const modalStyle: CSSProperties = {
    width,
    height,
    maxWidth,
    maxHeight,
    minWidth,
    minHeight,
  };
  const {isMobile} = useWindowSize();

  const handleTabClick = (key: string) => {
    setActiveTabKey(key);
    onTabChange(key);
  };

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modal_wrapper} style={modalStyle}>
        <div className={styles.top_container}>
          <h4>{modalTitle}</h4>
          <button className={styles.close_btn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className={styles.middle_container}>
          {
            isMobile ?
              <CustomTabs
                tabs={tabs}
                activeTabKey={activeTabKey}
                onTabChange={handleTabClick}
              />
              :
              <ul className={styles.sidebar}>
                {tabs.map((tab) => (
                  <li
                    key={tab.key}
                    className={activeTabKey === tab.key ? styles.active : styles.inactive}
                    onClick={() => handleTabClick(tab.key)}
                  >
                    <LuDot />
                    {tab.label}
                  </li>
                ))}
              </ul>
          }
          <div className={styles.content_box}>
            {children}
          </div>
        </div>

        {buttons.length > 0 && (
          <div className={styles.bottom_container}>
            {buttons.map((buttonProps, index) => (
              <Button
                key={`${buttonProps.text}-${index}`}
                {...buttonProps}
                height="100%"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}