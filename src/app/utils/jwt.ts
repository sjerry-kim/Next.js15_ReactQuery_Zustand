import * as jose from 'jose';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  [key: string]: unknown; // 추가!
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
    // .setExpirationTime('5m') // 토큰 만료 시간
    .setExpirationTime('1m') // 토큰 만료 시간
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
    // .setExpirationTime('90d')
    .setExpirationTime('90s')
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
    
    console.log("Accesstoken 검증 성공:", payload);
    
    return payload as TokenPayload;
  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) {
      throw new Error('Accesstoken이 만료되었습니다.');
    }
    throw new Error('유효하지 않은 Accesstoken이입니다.');
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
    if (error instanceof jose.errors.JWTExpired) {
      throw new Error('RefreshToken이 만료되었습니다.');
    }
    throw new Error('유효하지 않은 RefreshToken입니다.');
  }
}
