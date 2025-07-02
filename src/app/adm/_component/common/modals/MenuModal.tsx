'use client';

import styles from './MenuModal.module.css';
import CloseIcon from '@mui/icons-material/Close';
import { CSSProperties, ReactNode, useEffect, useState } from 'react';
import { MemuModalProps } from '@/types/modal';
import Button from '@/adm/_component/common/buttons/Button'
import { Tab, Tabs } from '@mui/material';
import useWindowSize from '@/hooks/useWindowSize.';
import CustomTabs from '@/adm/_component/common/custom/CustomTabs';

export default function MenuModal({
                                    children,
                                    modalTitle = "",
                                    buttons = [],
                                    width = "1100px",
                                    maxWidth,
                                    minWidth,
                                    height = "700px",
                                    maxHeight,
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
              // <Tabs
              //   value={activeTabKey}
              //   variant="scrollable"
              //   scrollButtons="auto"
              //   aria-label="scrollable auto tabs example"
              // >
              //   {tabs.map((tab) => (
              //     <Tab
              //       label={tab.label}
              //       key={tab.key}
              //       value={tab.key}
              //       className={activeTabKey === tab.key ? styles.active : styles.inactive}
              //       onClick={() => handleTabClick(tab.key)}
              //     />
              //   ))}
              // </Tabs>
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
