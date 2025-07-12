/**
 * Next.js 동적 경로 규칙과 실제 경로가 일치하는지 확인하는 함수.
 * 후행 슬래시(/)를 유연하게 처리하도록 개선되었습니다.
 * 예: isPathMatch('/board/123/', '/board/[id]') -> true
 * @param pathname 실제 브라우저의 경로 (e.g., /board/123/)
 * @param rulePath 비교할 규칙 경로 (e.g., /board/[id])
 * @returns {boolean} 일치하면 true
 */
export function isPathMatch(pathname: string, rulePath: string): boolean {
  // 규칙 경로를 정규식으로 변환합니다.
  const rulePathRegex = new RegExp(
    `^${rulePath
      .replace(/\[\.\.\.(.*?)\]/g, '(?<$1>.*)')
      .replace(/\[(.*?)\]/g, '([^/]+)')
    // ✅ 핵심 수정: 경로 끝에 슬래시(/)가 선택적으로(0개 또는 1개) 올 수 있도록 \/? 를 추가합니다.
    // 이렇게 하면 /board 와 /board/ 를 모두 동일하게 처리할 수 있습니다.
    }\\/?$`
  );

  // 실제 경로가 변환된 정규식 패턴과 일치하는지 테스트합니다.
  return rulePathRegex.test(pathname);
}
