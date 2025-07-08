import { apiFetch } from '@/utils/apiFetch';

export const uploadEditorImage = async (file: File) => {
  if (!file || !(file instanceof File)) throw new Error("유효하지 않은 파일이 전달되었습니다.");

  const apiUrl = '/api/protected/file/editor-image';
  const formData = new FormData();
  formData.append('upload_file', file);

  const options = {
    method: 'POST',
    body: formData,
  };

  const response = await apiFetch(apiUrl, options);

  if (!response.ok) {
    let errorMessage = `이미지 업로드 실패: ${response.status}`;
    try {
      const errorBody = await response.json();
      // CKEditor 에러 형식에 맞게 error.message를 찾도록 수정
      errorMessage = errorBody?.error?.message || errorMessage;
    } catch (e) {
      // JSON 파싱 실패 시 기본 에러 메시지 사용
    }
    console.error("[fileService]", errorMessage);
    throw new Error(errorMessage);
  }

  return response.json();
};
