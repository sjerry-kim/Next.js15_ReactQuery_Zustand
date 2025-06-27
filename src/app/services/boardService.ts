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

  const res = await apiFetch(apiUrl);

  if (!res.ok) {
    let errorMessage = `Failed to fetch data. Status: ${res.status}`;
    try {
      const errorBody = await res.json();
      errorMessage = errorBody.error || errorMessage; // Use server's error message if available
    } catch (e) {
      // Failed to parse error JSON, use default message
    }
    console.error("getBoardList API Error:", errorMessage);
    throw new Error(errorMessage);
  }

  return res.json() as Promise<PaginatedBoardResponse>;
}

export async function getBoard(id: string) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/protected/board/${id}`;

  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/protected/board/${id}`, {
  //   method: 'GET',
  //   cache: 'no-store',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Cache-Control': 'no-store',
  //   },
  // });

  const res = await apiFetch(apiUrl);

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}
