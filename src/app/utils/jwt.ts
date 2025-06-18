import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

/**
 * .env 파일에서 시크릿 키를 불러옵니다.
 * '!' (Non-null assertion)을 사용해 환경 변수가 반드시 존재한다고 가정하고 있습니다.
 * 만약 환경 변수가 로드되지 않았을 경우 서버 시작 시점에서 에러를 발생시켜
 * 런타임 에러를 방지하는 것이 더 안정적일 수 있습니다.
 * * 예시 (앱 초기화 로직):
 * if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
 * throw new Error('FATAL: Missing JWT secret environment variables');
 * }
 */
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;

// 개선 제안: payload 타입을 명확하게 정의하면 타입 안정성을 높일 수 있습니다.
// 예를 들어, 토큰에 userId를 담는 경우 다음과 같이 인터페이스를 정의할 수 있습니다.
export interface TokenPayload extends JwtPayload {
  userId: string;
  // 필요에 따라 다른 데이터 추가 가능 (e.g., role: 'admin')
}

/**
 * Access Token을 생성합니다.
 * @param payload 토큰에 담을 정보 (e.g., { userId: '...' })
 * @returns 생성된 Access Token (유효기간: 5분)
 */
export function generateAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '5m' });
  // return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '30s' });
}

/**
 * Refresh Token을 생성합니다.
 * @param payload 토큰에 담을 정보 (e.g., { userId: '...' })
 * @returns 생성된 Refresh Token (유효기간: 90일)
 */
export function generateRefreshToken(payload: TokenPayload) {
  // 사용자의 요구사항: 3개월(90일) 유효기간
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '90d' });
  // return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '1m' });
}

/**
 * middleware에서사용하기 때문에 'jose' 사용
 * Access Token의 유효성을 검증합니다.
 * @param token 검증할 Access Token
 * @returns 검증 성공 시 디코딩된 payload, 실패 시 에러 발생
 * @throws {JsonWebTokenError | TokenExpiredError} 토큰이 유효하지 않거나 만료된 경우 에러 발생
 */

export async function verifyAccessTokenFromRequest(req: NextRequest): Promise<TokenPayload> {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization 헤더가 없습니다.');
  }
  
  const token = authHeader.split(' ')[1];
  const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!);

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });

    console.log("어세스토큰 인증 완료!");

    return payload as TokenPayload;
  } catch (err) {
    // console.error('[미들웨어] JWT 검증 실패:', err);
    throw new Error('유효하지 않은 access token입니다.');
  }
}

/**
 * Refresh Token의 유효성을 검증합니다.
 * @param token 검증할 Refresh Token
 * @returns 검증 성공 시 디코딩된 payload, 실패 시 에러 발생
 * @throws {JsonWebTokenError | TokenExpiredError} 토큰이 유효하지 않거나 만료된 경우 에러 발생
 */
export function verifyRefreshToken(token: string) {
  // Access Token 검증과 마찬가지로 try-catch 처리가 필요합니다.
  return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
}
