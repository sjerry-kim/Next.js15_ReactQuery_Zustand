'use client';

import React, { useState, Children, cloneElement, isValidElement } from 'react';
import { AccordionGroupProps } from '@/types/components';

export default function AccordionGroup({
  children,
  allowMultiple = false,
  defaultOpenId
}: AccordionGroupProps) {
  // 열려있는 아코디언의 ID(들)를 상태로 관리
  const [openItems, setOpenItems] = useState<string[]>(() => {
    if (!defaultOpenId) return [];
    return Array.isArray(defaultOpenId) ? defaultOpenId : [defaultOpenId];
  });

  const handleToggle = (id: string) => {
    setOpenItems(prevOpenItems => {
      // 여러 개 열기 모드
      if (allowMultiple) {
        // 이미 열려있으면 닫고, 닫혀있으면 열어줌
        return prevOpenItems.includes(id)
          ? prevOpenItems.filter(item => item !== id)
          : [...prevOpenItems, id];
      }
      // 하나만 열기 모드
      else {
        // 이미 열려있는 것을 다시 클릭하면 닫고, 다른 것을 클릭하면 그것만 열어줌
        return prevOpenItems.includes(id) ? [] : [id];
      }
    });
  };

  // 자식으로 전달된 Accordion 컴포넌트들을 순회하며 새로운 props를 주입
  const childrenWithProps = Children.map(children, child => {
    if (isValidElement(child) && typeof child.type !== 'string') {
      const childId = child.props.id;
      if (!childId) {
        console.error("Accordion child must have a unique 'id' prop.");
        return child;
      }
      return cloneElement(child, {
        isOpen: openItems.includes(childId), // 열림 상태 전달
        onToggle: () => handleToggle(childId), // 토글 함수 전달
      } as React.Attributes & { isOpen: boolean; onToggle: () => void });
    }
    return child;
  });

  return <div>{childrenWithProps}</div>;
}