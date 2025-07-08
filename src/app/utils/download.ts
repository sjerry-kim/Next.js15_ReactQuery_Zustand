import { ImageListItem } from '@/types/files';

export const downloadImage = async (img: ImageListItem) => {
  if (!img.file_url) {
    console.error('다운로드할 이미지 URL이 없습니다.');
    return;
  }
  try {
    const response = await fetch(img.file_url, { mode: 'cors' });
    if (!response.ok) throw new Error('이미지 요청 실패');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = img.file_init_name || 'image.jpg';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('이미지 다운로드 오류:', err);
    // 필요하다면 여기서 사용자에게 알림을 표시
  }
};