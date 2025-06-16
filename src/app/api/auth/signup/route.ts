import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password, name, role = 'user' } = await req.json();

  // Supabase 회원가입
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      userMetadata: { name, role }, // user_metadata로도 들어가긴 함
    } as any
  });

  if (error || !data.user) {
    return NextResponse.json({ error: error?.message ?? '회원가입 실패' }, { status: 400 });
  }

  const userId = data.user.id;

  const { error: insertError } = await supabase.from('profiles').insert({
    user_id: userId,
    name,
    role,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ message: '회원가입 성공', userId }, { status: 200 });
}
