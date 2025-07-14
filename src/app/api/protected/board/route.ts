import { board, Prisma } from '@prisma/client';
import { Board, PaginatedBoardResponse } from '@/types/board';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest): Promise<NextResponse<PaginatedBoardResponse | { message: string }>> {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10); // Default page size
  const searchType = searchParams.get('searchType') || '';
  const searchKeyword = searchParams.get('searchKeyword') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  if (isNaN(page) || page < 1) {
    return NextResponse.json({ message: 'Invalid page number. Must be a positive integer.' }, { status: 400 });
  }
  if (isNaN(pageSize) || pageSize < 1) {
    return NextResponse.json({ message: 'Invalid page size. Must be a positive integer.' }, { status: 400 });
  }

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const where: Prisma.boardWhereInput = {};

  if (searchKeyword) {
    if (searchType === 'id') {
      const numericKeyword = Number(searchKeyword);
      if (!isNaN(numericKeyword)) {
        where.id = numericKeyword;
      }
    } else if (searchType === 'content') {
      where.content = {
        contains: searchKeyword,
        mode: 'insensitive',
      };
    } else {
      const conditions: Prisma.boardWhereInput[] = [];
      conditions.push({
        content: {
          contains: searchKeyword,
          mode: 'insensitive',
        },
      });
      const numericKeyword = Number(searchKeyword);
      if (!isNaN(numericKeyword)) {
        conditions.push({ id: numericKeyword });
      }
      where.OR = conditions;
    }
  }

  // 시작일과 종료일이 모두 존재할 때만 created_at 조건을 추가
  if (startDate && endDate) {
    where.created_at = {
      gte: new Date(startDate), // gte: >= (시작일 00:00:00부터)
      lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)), // lte: <= (종료일 23:59:59까지)
    };
  }

  // 정렬 로직을 동적으로 설정
  const orderBy: Prisma.boardOrderByWithRelationInput = {
    created_at: sortOrder === 'asc' ? 'asc' : 'desc',
  };

  try {
    // Use a transaction to get both data and total count efficiently
    const [boardsData, totalItems] = await prisma.$transaction([
      prisma.board.findMany({
        where,
        select: {
          id: true,
          content: true,
          created_at: true,
          updated_at: true,
        },
        orderBy,
        skip: skip,
        take: take,
      }),
      prisma.board.count({ where }),
    ]);

    //  정렬 순서에 따라 row number(rn)를 올바르게 계산
    const boardsWithRowNumber: Board[] = boardsData.map((board, index) => {
      const baseRn = sortOrder === 'asc'
        ? skip + index + 1
        : totalItems - (skip + index);

      return {
        ...board,
        id: Number(board.id),
        rn: baseRn,
      };
    });

    const totalPages = Math.ceil(totalItems / pageSize);

    return NextResponse.json({
      boards: boardsWithRowNumber,
      totalItems,
      currentPage: page,
      totalPages,
      pageSize,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: '[GET] 서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    // It's good practice to disconnect, though Next.js might handle some of this.
    // For serverless functions, connection management can be nuanced.
    // await prisma.$disconnect(); // Consider implications in a serverless environment
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const { content } = await request.json();

    const response: board = await prisma.board.create({
      data: {
        content: content,
      },
    });

    return NextResponse.json(
      { message: '[POST] 게시물 등록에 성공하였습니다.', userId: response },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: '[POST] 서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
