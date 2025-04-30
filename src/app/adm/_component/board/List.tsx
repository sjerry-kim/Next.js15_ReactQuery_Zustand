'use client';

import { AppRouterInstance } from '../../../../../../node_modules/next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import { board } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { getBoardList } from '@/lib/boardQuery';
import React from 'react';
import { Board } from '@/types/board';

export default function Page() {
  const router: AppRouterInstance = useRouter();
  const { data, isLoading, error } = useQuery<Board[]>({
    queryKey: ['boardList'],
    queryFn: getBoardList,
    staleTime: 60 * 1000, // n분 뒤에 fresh -> stale 로
    gcTime: 300 * 1000, // 5분뒤 메모리 정리
  });

  if (error) {
    // todo 1. 커스텀 알랏창 만들기
    // todo 2. error 페이지, 404 페이지 만들기
    alert('에러가 발생하였습니다. 관리자에게 문의하세요.');
    // router.push('/error');

    return;
  }

  return (
    <>
      <div>
        <button onClick={() => router.push('/adm/board/add')}>Add New List :)</button>
      </div>
      <section>
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>ID</th>
              <th>제목</th>
              <th>작성일</th>
              <th>수정일</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
              data?.map((item: Board , index: number) => (
                <tr key={index} style={{ cursor: 'pointer' }} onClick={() => router.push(`/adm/board/${item.id}`)}>
                  <td>{item.rn}</td>
                  <td>{item.id}</td>
                  <td>{item.content}</td>
                  <td>{item.created_at?.toString()}</td>
                  <td>{item.updated_at ? item.updated_at?.toString() : '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>
                  <h1>로딩중...</h1>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
      <div>
        <button onClick={() => console.log('')}>Modify the List !</button>
      </div>
    </>
  );
}
