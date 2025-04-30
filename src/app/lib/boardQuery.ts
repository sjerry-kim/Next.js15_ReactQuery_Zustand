export async function getBoardList() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/board`, {
    next: {
      tags: ['boardList'],
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
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
