import { DropzoneOptions } from 'react-dropzone';

// editor, 파일 업로드 용량 제한 등에서 사용 중
export const MAX_FILE_SIZE_MB = 100;

// export const DEFAULT_ALLOWED_IMAGE_TYPES = [
//   'image/jpeg',
//   'image/png',
//   'image/gif',
//   'image/webp',
// ];

export const DEFAULT_ACCEPT_IMAGE_OBJECT: DropzoneOptions['accept'] = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
};

// export const DEFAULT_ALLOWED_FILE_TYPES = [
//   // 이미지 파일
//   'image/jpeg',
//   'image/png',
//   'image/gif',
//   'image/webp',
//
//   // 문서 파일
//   'application/pdf', // PDF
//   'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // 워드 (.docx)
//   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',   // 엑셀 (.xlsx)
//   'application/vnd.openxmlformats-officedocument.presentationml.presentation', // 파워포인트 (.pptx)
//   'application/x-hwp', // 한컴오피스 한글 (.hwp)
// ];

export const DEFAULT_ACCEPT_FILE_OBJECT: DropzoneOptions['accept'] = {
  // 이미지
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],

  // 문서
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'application/x-hwp': ['.hwp'],
};