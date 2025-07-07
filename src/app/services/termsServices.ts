import { TermsResponse } from '@/types/terms';
import { apiFetch } from '@/utils/apiFetch';
import { SearchParams } from 'next/dist/server/request/search-params';
import { PaginatedBoardResponse } from '@/types/board';

export async function getTermsList() {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/protected/setting/terms`;
  const response = await apiFetch(apiUrl);

  if (!response.ok) {
    let errorMessage = `서버 응답 오류: ${response.status}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorMessage;
    } catch (error) {
      // JSON 파싱 실패 시 기본 에러 메시지 사용
    }
    console.error("[termsService]", errorMessage);
    throw new Error(errorMessage);
  }
  return response.json();
}

export async function getTerm(id: string) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/protected/setting/terms/${id}`;
  const response = await apiFetch(apiUrl);

  if (!response.ok) {
    let errorMessage = `서버 응답 오류: ${response.status}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorMessage;
    } catch (error) {
      // JSON 파싱 실패 시 기본 에러 메시지 사용
    }
    console.error("[termsService]", errorMessage);
    throw new Error(errorMessage);
  }
  return response.json();
}

export const createTerms = async ({
  content,
  title,
} : TermsResponse) => {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/protected/setting/terms`;

  const payload = {
    content: content,
    title: title,
  };

  const options = {
    method: 'POST',
    cache: 'no-store' as RequestCache,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  };

  const response = await apiFetch(apiUrl, options);

  if (!response.ok) {
    let errorMessage = `서버 응답 오류: ${response.status}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorMessage;
    } catch (error) {
      // JSON 파싱 실패 시 기본 에러 메시지 사용
    }
    console.error("[termService]", errorMessage);
    throw new Error(errorMessage);
  }

  return await response.json();
}

export const updateTerm = async (id: number, data: { title: string; content: string }) => {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/protected/setting/terms/${id}`;

  const options = {
    method: 'PUT',
    cache: 'no-store' as RequestCache,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const response = await apiFetch(apiUrl, options);

  if (!response.ok) {
    let errorMessage = `서버 응답 오류: ${response.status}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorMessage;
    } catch (error) {
      // JSON 파싱 실패 시 기본 에러 메시지 사용
    }
    console.error("[termService]", errorMessage);
    throw new Error(errorMessage);
  }

  return await response.json();
}

export const deleteTerm = async (id: number) => {
  // URL 경로에 id를 포함시킵니다.
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/protected/setting/terms/${id}`;

  const options = {
    method: 'DELETE', // 리소스 삭제를 의미하는 DELETE 메서드 사용
    cache: 'no-store' as RequestCache,
    headers: {
      'Content-Type': 'application/json',
    },
    // DELETE 요청에는 일반적으로 body가 필요 없습니다.
  };

  const response = await apiFetch(apiUrl, options);

  if (!response.ok) {
    let errorMessage = `서버 응답 오류: ${response.status}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorMessage;
    } catch (error) {
      // JSON 파싱 실패 시 기본 에러 메시지 사용
    }
    console.error("[termService]", errorMessage);
    throw new Error(errorMessage);
  }

  return await response.json();
};