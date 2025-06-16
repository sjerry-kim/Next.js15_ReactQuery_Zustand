import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// 로그인
export async function POST(req: Request) {
  const { email, password } = await req.json();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { session } = data;

  if (!session) {
    return NextResponse.json({ error: '세션 정보가 없습니다.' }, { status: 500 });
  }

  const accessToken = session.access_token;
  const refreshToken = session.refresh_token;
  const expiresIn = session.expires_in; // 초 단위 (예: 3600)

  return NextResponse.json({
    message: '로그인 성공',
    user: session.user,
    accessToken,
    refreshToken,
    expiresIn,
  });
}