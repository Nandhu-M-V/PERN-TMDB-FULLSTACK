import jwt from "jsonwebtoken";

export interface JwtUser {
  id: number;
  email: string;
  role: string;
}

export interface RefreshPayload {
  id: number;
}

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT secrets are missing in environment variables");
}

export const signAccess = (user: JwtUser) =>
  jwt.sign(user, ACCESS_SECRET, { expiresIn: "15m" });

export const signRefresh = (id: number) =>
  jwt.sign({ id }, REFRESH_SECRET, { expiresIn: "7d" });

export const verifyAccess = (token: string): JwtUser =>
  jwt.verify(token, ACCESS_SECRET) as JwtUser;

export const verifyRefresh = (token: string): RefreshPayload =>
  jwt.verify(token, REFRESH_SECRET) as RefreshPayload;
