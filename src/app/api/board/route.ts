import { board, PrismaClient } from '@prisma/client';
import { Board } from '@/types/board';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: any }): Promise<Response> {
  try {
    const boards: board[] = await prisma.board.findMany({
      select: {
        id: true,
        content: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    const boardsWithRowNumber: Board[]  = boards.map((board, index) => ({
      ...board,
      rn: index + 1,
    }));

    return new Response(JSON.stringify(boardsWithRowNumber), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const { content } = await request.json();

    const res: board = await prisma.board.create({
      data: {
        content: content,
      },
    });

    return new Response(JSON.stringify({ message: 'Post created successfully', data: res }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to create post' }), {
      status: 500,
    });
  }
}
