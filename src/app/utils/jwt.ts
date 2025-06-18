import * as jose from 'jose';
import { NextRequest } from 'next/server';

// --- 타입 정의 ---
export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

// --- 시크릿 키 준비 ---
// jose 라이브러리는 시크릿 키를 'Uint8Array'라는 특별한 형식으로 사용합니다.
const ACCESS_SECRET = new TextEncoder().encode(
  process.env.ACCESS_TOKEN_SECRET!
);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.REFRESH_TOKEN_SECRET!
);


/**
 * Access Token을 생성합니다. (jose 버전)
 * @param payload 토큰에 담을 정보
 * @returns 생성된 Access Token (유효기간: 5분)
 */
export async function generateAccessToken(payload: TokenPayload) {
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' }) // 사용할 알고리즘
    .setIssuedAt() // 토큰 발급 시간
    .setExpirationTime('5m') // 토큰 만료 시간
    .sign(ACCESS_SECRET); // 시크릿 키로 서명
}

/**
 * Refresh Token을 생성합니다. (jose 버전)
 * @param payload 토큰에 담을 정보
 * @returns 생성된 Refresh Token (유효기간: 90일)
 */
export async function generateRefreshToken(payload: TokenPayload) {
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('90d')
    .sign(REFRESH_SECRET);
}

/**
 * Access Token의 유효성을 검증합니다. (jose 버전)
 * @param token 검증할 Access Token
 * @returns 검증 성공 시 디코딩된 payload
 */
export async function verifyAccessToken(token: string): Promise<TokenPayload> {
  try {
    const { payload } = await jose.jwtVerify(token, ACCESS_SECRET);
    
    console.log("access token 인증 성공");
    
    return payload as TokenPayload;
  } catch (error) {
    // jose의 에러는 더 구체적이므로, 여기서 로그를 남기면 디버깅에 좋습니다.
    console.error('Access Token 검증 실패:', error);
    throw new Error('유효하지 않은 Access Token입니다.');
  }
}

/**
 * Refresh Token의 유효성을 검증합니다. (jose 버전)
 * @param token 검증할 Refresh Token
 * @returns 검증 성공 시 디코딩된 payload
 */
export async function verifyRefreshToken(token: string): Promise<TokenPayload> {
  try {
    const { payload } = await jose.jwtVerify(token, REFRESH_SECRET);

    console.log("refresh token 인증 성공");

    return payload as TokenPayload;
  } catch (error) {
    console.error('Refresh Token 검증 실패:', error);
    throw new Error('유효하지 않은 Refresh Token입니다.');
  }
}
