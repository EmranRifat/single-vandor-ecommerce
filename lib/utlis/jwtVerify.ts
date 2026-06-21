import * as jose from "jose";

export type JwtPayload = jose.JWTPayload & {
  sub?: string;
  email?: string;
  iss?: string;
};

const getSecretKey = () => {
  const secret =
    process.env.JWT_SECRET ||
    process.env.BACKEND_JWT_SECRET ||
    process.env.NEXT_PUBLIC_JWT_SECRET;

  return secret ? new TextEncoder().encode(secret) : null;
};

export const verify_jwt = async (token: string): Promise<JwtPayload | null> => {
  try {
    const secretKey = getSecretKey();

    if (!secretKey) {
      console.warn("JWT verification skipped: no JWT secret configured.");
      return null;
    }

    const { payload } = await jose.jwtVerify<JwtPayload>(token, secretKey);
    return payload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
};
