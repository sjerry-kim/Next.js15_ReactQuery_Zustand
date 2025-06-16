import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ 요청 바디 타입 정의
type RegisterRequestBody = {
  email: string;
  password: string;
  name: string;
  role?: string; // 기본값: 'user'
};

export async function POST(req: Request) {
  const body = (await req.json()) as RegisterRequestBody;
  const { email, password, name, role = 'user' } = body;

  // 1. 기존 유저 확인
  const existingUser = await prisma.users.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json({ error: '이미 가입된 이메일입니다.' }, { status: 400 });
  }

  // 2. 비밀번호 해싱 (생략된 상태)
  // const hashedPassword = await hash(password, 10);

  // 3. users 테이블에 유저 생성
  const newUser = await prisma.users.create({
    data: {
      email,
      password, // ⚠️ 실제 배포 시엔 반드시 해싱
      name,
      role,
    },
  });

  // 4. profiles 테이블에 유저 정보 삽입
  await prisma.profiles.create({
    data: {
      user_id: newUser.id, // ✅ UUID
      name,
      role,
    },
  });

  return NextResponse.json({ message: '회원가입 성공', userId: newUser.id }, { status: 201 });
}
