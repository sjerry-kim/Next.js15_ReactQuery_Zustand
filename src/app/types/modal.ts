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

export interface CommonModalState {
  isOpen: boolean;
  type: string;
  modalTitle: string;
  buttons: ButtonProps[];
  width?: string | number;
  maxWidth?: string | number;
  minWidth?: string | number;
  height?: string | number;
  maxHeight?: string | number;
  minHeight?: string | number;
}

export interface ModalConfig {
  type: string;
  title: string;
  buttons?: ButtonProps[];
  width?: string | number;
  maxWidth?: string | number;
  minWidth?: string | number;
  height?: string | number;
  maxHeight?: string | number;
  minHeight?: string | number;
}