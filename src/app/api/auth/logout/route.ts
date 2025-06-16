import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// 로그아웃
export async function POST(req: Request) {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("로그아웃 실패:", error.message);
  } else {
    console.log("로그아웃 성공");
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ message: '회원가입 성공', data }, { status: 200 });
}