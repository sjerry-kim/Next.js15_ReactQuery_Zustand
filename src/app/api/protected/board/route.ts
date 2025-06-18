import { board } from '@prisma/client';
import { Board, PaginatedBoardResponse } from '@/types/board';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest): Promise<NextResponse<PaginatedBoardResponse | { error: string }>> {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10); // Default page size

  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: 'Invalid page number. Must be a positive integer.' }, { status: 400 });
  }
  if (isNaN(pageSize) || pageSize < 1) {
    return NextResponse.json({ error: 'Invalid page size. Must be a positive integer.' }, { status: 400 });
  }

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  try {
    // Use a transaction to get both data and total count efficiently
    const [boardsData, totalItems] = await prisma.$transaction([
      prisma.board.findMany({
        select: {
          id: true,
          content: true,
          created_at: true,
          updated_at: true,
        },
        orderBy: {
          // Consider a more stable ordering, e.g., created_at then id
          created_at: 'desc', // Example: newest first
          // id: 'desc', // if created_at can be the same
        },
        skip: skip,
        take: take,
      }),
      prisma.board.count(), // Get the total number of board items
    ]);

    // Convert BigInt IDs to numbers and add row numbers
    const boardsWithRowNumber: Board[] = boardsData.map((board, index) => ({
      ...board,
      id: Number(board.id), // Convert BigInt to number
      rn: skip + index + 1, // Calculate row number based on overall dataset
    }));

    const totalPages = Math.ceil(totalItems / pageSize);

    return NextResponse.json({
      boards: boardsWithRowNumber,
      totalItems,
      currentPage: page,
      totalPages,
      pageSize,
    });
  } catch (error) {
    console.error("API Error fetching boards:", error);
    // In a real app, you might want to log this error to a monitoring service
    return NextResponse.json({ error: 'Failed to fetch board data from the database.' }, { status: 500 });
  } finally {
    // It's good practice to disconnect, though Next.js might handle some of this.
    // For serverless functions, connection management can be nuanced.
    // await prisma.$disconnect(); // Consider implications in a serverless environment
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
