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
  // ! type: imageList인지 FileList인지 구분 위한 매개변수 -> 'image' | 'file'
  onImageOpen: (type: string, file: FileListItem, index: number) => void;
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
  onPdfOpen: (file: FileListItem) => void;
  // ! type: imageList인지 FileList인지 구분 위한 매개변수 -> 'image' | 'file'
  onImageOpen: (type: string, file: FileListItem, index: number) => void;
}

/* PDF Viewer */
export interface PdfViewerProps {
  file: string | File | Blob | undefined| null; // URL 문자열 외에 File, Blob 객체도 허용
  onClose: () => void; // 모달을 닫는 함수
}

/* Image Viewer */
export interface ImageViewerProps {
  images: ImageListItem[];
  initialIndex?: number;
  file?: ImageListItem | null; // URL 문자열 외에 File, Blob 객체도 허용
  onClose: () => void; // 모달을 닫는 함수
  mode: 'single' | 'carousel' // 단일 뷰어 vs 슬라이드 뷰어
}