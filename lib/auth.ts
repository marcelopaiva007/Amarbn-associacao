import crypto from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const SECRET = process.env.APP_SESSION_SECRET || "amarbn-secret-key-production-change-this-min-32-chars";

export interface SessionPayload {
  userId: string;
  email: string;
  role: "ADMIN" | "SECRETARIA" | "FINANCEIRO" | "ASSOCIADO";
  name: string;
  memberId?: string;
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function signJwt(payload: SessionPayload): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 86400 * 7 })).toString("base64url");
  const signature = crypto.createHmac("sha256", SECRET).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

export function verifyJwt(token: string): SessionPayload | null {
  try {
    const [header, body, signature] = token.split(".");
    if (!header || !body || !signature) return null;
    const expectedSig = crypto.createHmac("sha256", SECRET).update(`${header}.${body}`).digest("base64url");
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8")) as SessionPayload & { exp: number };
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export const verifySessionToken = verifyJwt;

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("amarbn_session")?.value;
  if (!token) return null;
  return verifyJwt(token);
}

export async function setSessionCookie(payload: SessionPayload) {
  const token = signJwt(payload);
  const cookieStore = await cookies();
  cookieStore.set("amarbn_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 86400 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("amarbn_session");
}

export function createSessionToken(userId: string, email: string, role: string, memberId?: string): string {
  return signJwt({
    userId,
    email,
    role: role as any,
    name: '',
    memberId,
  });
}

export function createSessionCookie(token: string): string {
  const maxAge = 86400 * 7;
  const secure = process.env.NODE_ENV === 'production' ? 'Secure;' : '';
  return `amarbn_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}; ${secure}`;
}

export function createLogoutCookie(): string {
  const secure = process.env.NODE_ENV === 'production' ? 'Secure;' : '';
  return `amarbn_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; ${secure}`;
}
