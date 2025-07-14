import { PaginatedBoardResponse, BoardCreatePayload, BoardUpdatePayload } from '@/types/board';
import { apiFetch } from '@/utils/apiFetch';
import { SearchParams } from 'next/dist/server/request/search-params';

export async function getBoardList(
  page: number = 1,
  pageSize: number = 10,
  search: SearchParams = {}
): Promise<PaginatedBoardResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (search.searchKeyword) {
    // @ts-ignore
    params.append('searchType', search.searchType || ''); // @ts-ignore
    params.append('searchKeyword', search.searchKeyword);
  }

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/protected/board?${params.toString()}`;
  const response = await apiFetch(apiUrl);

  if (!response.ok) {
    let errorMessage = `서버 응답 오류: ${response.status}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorMessage;
    } catch (error) {
      // JSON 파싱 실패 시 기본 에러 메시지 사용
    }
    console.error("[boardService]", errorMessage);
    throw new Error(errorMessage);
  }
  return response.json() as Promise<PaginatedBoardResponse>;
}

export async function getBoard(id: string) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/protected/board/${id}`;

  const response = await apiFetch(apiUrl);

  if (!response.ok) {
    let errorMessage = `서버 응답 오류: ${response.status}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorMessage;
    } catch (error) {
      // JSON 파싱 실패 시 기본 에러 메시지 사용
    }
    console.error("[boardService]", errorMessage);
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function createBoard(data: BoardCreatePayload) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/protected/board`;

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
    console.error("[boardService/createBoard]", errorMessage);
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function updateBoard(id: number | string, data: BoardUpdatePayload) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/protected/board/${id}`;

  const options = {
    method: 'PATCH', // 또는 'PUT'
    headers: { 'Content-Type': 'application/json' },
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
    console.error("[boardService/updateBoard]", errorMessage);
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function deleteBoard(id: number | string) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/protected/board/${id}`;

  const options = {
    method: 'DELETE',
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
    console.error("[boardService/deleteBoard]", errorMessage);
    throw new Error(errorMessage);
  }

  return response.json();
}