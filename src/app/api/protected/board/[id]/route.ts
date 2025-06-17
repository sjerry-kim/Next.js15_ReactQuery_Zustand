import { board } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const res: board | null = await prisma.board.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
        content: true,
        // rn: true,
        created_at: true,
        updated_at: true,
      },
    });

    return new Response(JSON.stringify(res), {
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

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    const { id } = await params;
    const { content } = await request.json();

    const res: board = await prisma.board.update({
      where: {
        id: parseInt(id),
      },
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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    const { id } = await params;

    const res: board = await prisma.board.delete({
      where: {
        id: parseInt(id),
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
