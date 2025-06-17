import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { supabase } from '@/lib/supabase';

const prisma = new PrismaClient();

type RegisterRequestBody = {
  email: string;
  password: string;
  name: string;
  role?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RegisterRequestBody;
    const { email, password, name, role = 'user' } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: '필수 입력값이 누락되었습니다.' },
        { status: 400 }
      );
    }

    // Supabase
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
      },
    });

    if (signUpError) {
      return NextResponse.json(
        { error: signUpError.message },
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: '회원가입 실패: 사용자 정보가 없습니다.' },
        { status: 500 }
      );
    }

    // Prisma
    await prisma.profile.create({
      data: {
        user_id: data.user.id, // Supabase가 생성한 유저 UUID 사용
        name,
        role,
      },
    });

    return NextResponse.json(
      { message: '회원가입 성공', userId: data.user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('회원가입 오류:', error);
    return NextResponse.json(
      { error: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
