// export async function getBoardList() {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/board`, {
//     next: {
//       tags: ['boardList'],
//     },
//   });
//
//   if (!res.ok) {
//     throw new Error('Failed to fetch data');
//   }
//
//   return res.json();
// }

import { PaginatedBoardResponse } from '@/types/board';

export async function getBoardList(page: number = 1, pageSize: number = 10): Promise<PaginatedBoardResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/board?page=${page}&pageSize=${pageSize}`;

  const res = await fetch(apiUrl, {
    // cache: 'no-store', // Uncomment if you want to ensure fresh data every time,
    // but React Query's staleTime/gcTime usually handles this.
    next: {
      // Be more specific with tags if you need to revalidate specific pages
      tags: ['boardList', `boardList-page-${page}-size-${pageSize}`],
    },
  });

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
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/board/${id}`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}
