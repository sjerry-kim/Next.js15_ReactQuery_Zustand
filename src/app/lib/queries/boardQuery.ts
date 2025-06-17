import { PaginatedBoardResponse } from '@/types/board';
import { apiFetch } from '@/utils/apiFetch';

export async function getBoardList(page: number = 1, pageSize: number = 10): Promise<PaginatedBoardResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/protected/board?page=${page}&pageSize=${pageSize}`;

  // const res = await fetch(apiUrl, {
  //   // cache: 'no-store', // Uncomment if you want to ensure fresh data every time,
  //   // but React Query's staleTime/gcTime usually handles this.
  //   next: {
  //     // Be more specific with tags if you need to revalidate specific pages
  //     tags: ['boardList', `boardList-page-${page}-size-${pageSize}`],
  //   },
  // });

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
