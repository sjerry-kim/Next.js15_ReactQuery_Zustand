import { ReactNode } from 'react';
import { ButtonProps } from '@/types/components';

export interface CommonModalButton {
  text: string;
  onClick: () => void;
  color?: 'primary' | 'grey' | 'info' | 'danger' | 'warn' | 'success';
  variant?: 'contained' | 'outlined';
}

export interface CommonModalProps {
  modalTitle?: string;
  onClose: () => void;
  children: ReactNode;
  buttons?: ButtonProps[];
  width?: string | number;
  maxWidth?: string | number;
  minWidth?: string | number;
  height?: string | number;
  maxHeight?: string | number;
  minHeight?: string | number;
}

// export interface CommonModalState {
//   isOpen: boolean;
//   type: string;
//   modalTitle: string;
//   buttons: ButtonProps[];
//   width?: string | number;
//   maxWidth?: string | number;
//   minWidth?: string | number;
//   height?: string | number;
//   maxHeight?: string | number;
//   minHeight?: string | number;
// }
//
// export interface ModalConfig {
//   type: string;
//   title: string;
//   buttons?: ButtonProps[];
//   width?: string | number;
//   maxWidth?: string | number;
//   minWidth?: string | number;
//   height?: string | number;
//   maxHeight?: string | number;
//   minHeight?: string | number;
// }

export interface MenuModalTab {
  key: string;
  label: string;
}

export interface MemuModalProps {
  modalTitle?: string;
  onClose: () => void;
  children: ReactNode;
  tabs: MenuModalTab[];
  defaultTabKey?: string;
  onTabChange: (key: string) => void;
  buttons?: ButtonProps[];
  width?: string | number;
  maxWidth?: string | number;
  minWidth?: string | number;
  height?: string | number;
  maxHeight?: string | number;
  minHeight?: string | number;
}

export interface SearchModalProps<T> {
  modalTitle?: string;
  selectedItems?: T[];
  multiSelect?: boolean;
  onClose: () => void;
  onApply: (selectedItems: T[]) => void;
  // 검색 타입 옵션 (예: [{ value: 'name', label: '이름' }])
  searchOptions: { value: string; label: string }[];
  // 테이블 컬럼 정의
  tableColumns: {
    key: keyof T | string;
    header: string;
    render?: (item: T) => React.ReactNode; // 커스텀 렌더링 함수
  }[];
  // 실제 데이터 쿼리 함수
  queryFn: (filter: { type: string; keyword: string }) => Promise<T[]>;
  width?: string | number;
  maxWidth?: string | number;
  minWidth?: string | number;
  height?: string | number;
  maxHeight?: string | number;
  minHeight?: string | number;
}

export interface ComfirmModalProps {
  modalTitle?: string;
  onClose: () => void;
  children: ReactNode;
  buttons?: ButtonProps[];
  width?: string | number;
  maxWidth?: string | number;
  minWidth?: string | number;
  height?: string | number;
  maxHeight?: string | number;
  minHeight?: string | number;
}