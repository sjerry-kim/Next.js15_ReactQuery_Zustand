import { PaginatedBoardResponse } from '@/types/board';
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