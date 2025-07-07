import { board, Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const response: board | null = await prisma.board.findUnique({
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

    // return new Response(JSON.stringify(res), {
    //   status: 200,
    //   headers: { 'Content-Type': 'application/json' },
    // });
    return NextResponse.json(response);
  } catch (error) {
    console.error('[GET]', error);
    return NextResponse.json(
      { message: '[GET] 서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    const { id } = await params;
    const { content } = await request.json();

    const updatedBoard = await prisma.board.update({
      where: { id: parseInt(id) },
      data: { content },
    });

    return NextResponse.json({
      message: '[PATCH] 게시글이 성공적으로 수정되었습니다.',
      data: updatedBoard,
    });
  } catch (error) {
    console.error('[PATCH]', error);
    // Prisma에서 '찾을 수 없는 레코드' 에러를 감지하여 404를 반환
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json(
        { message: '[PATCH] 수정할 데이터를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    // 그 외 모든 에러는 500으로 처리
    return NextResponse.json(
      { message: '[PATCH] 서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    const { id } = await params;

    const deletedBoard = await prisma.board.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      message: '[DELETE] 게시글이 성공적으로 삭제되었습니다.',
      data: deletedBoard,
    });
  } catch (error) {
    console.error('[DELETE]', error);
    // Prisma에서 '찾을 수 없는 레코드' 에러를 감지하여 404를 반환
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json(
        { message: '[DELETE] 삭제할 데이터를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    // 그 외 모든 에러는 500으로 처리
    return NextResponse.json(
      { message: '[DELETE] 서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
