import { DropzoneOptions } from 'react-dropzone';

/* Image */
export interface ImageListItem {
  file_idx?: number;
  file?: File;
  file_init_name: string;
  file_url?: string;
  isNew: boolean;
}

export interface UseImageManagerProps {
  initialImages?: ImageListItem[];
  limit?: number;
}

export interface ImageUploaderProps {
  onCompressedImages: (files: File[]) => void;
  maxFiles?: number; // 최대 파일 개수
  accept?: DropzoneOptions['accept']; // dropzone 라이브러리가 사용하는 accept 객체
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

export interface ImageListProps {
  images: ImageListItem[];
  editMode: boolean;
  onDelete: (image: ImageListItem) => void;
  onDownload: (image: ImageListItem) => void;
}

/* File*/
export interface FileListItem {
  file_idx?: number;
  file_url?: string;
  file_init_name: string;
  file?: File;
  isNew: boolean;
}

export interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number; // 최대 파일 개수
  accept?: DropzoneOptions['accept']; // dropzone 라이브러리가 사용하는 accept 객체
  maxImageSizeMB?: number;
  maxImageWidthOrHeight?: number;
}

export interface FileListProps {
  files: FileListItem[];
  editMode: boolean;
  onDelete: (file: FileListItem) => void;
  onDownload: (file: FileListItem) => void;
}