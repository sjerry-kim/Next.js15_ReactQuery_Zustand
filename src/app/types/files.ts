/* Image */
import { DropzoneOptions } from 'react-dropzone';

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
  allowedTypes?: string[]; // 허용할 MIME 타입
  accept?: DropzoneOptions['accept']; // dropzone 라이브러리가 사용하는 accept 객체
}

export interface ImageListProps {
  images: ImageListItem[];
  editMode: boolean;
  onDelete: (image: ImageListItem) => void;
  onDownload: (image: ImageListItem) => void;
}