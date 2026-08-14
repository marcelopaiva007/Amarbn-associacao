import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECRET = process.env.APP_SESSION_SECRET || "amarbn-secret-key-production-change-this-min-32-chars";
const ADMIN_ROLES = ["ADMIN", "SECRETARIA", "FINANCEIRO"];

function base64UrlToBytes(base64url: string): Uint8Array {
  const padded = base64url.padEnd(base64url.length + ((4 - (base64url.length % 4)) % 4), "=");
  const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// Edge Runtime doesn't support Node's `crypto` module, so JWT verification here
// uses the Web Crypto API (SubtleCrypto) instead of lib/auth.ts's Node implementation.
async function getSessionRole(token: string): Promise<string | null> {
  try {
    const [header, body, signature] = token.split(".");
    if (!header || !body || !signature) return null;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlToBytes(signature) as BufferSource,
      new TextEncoder().encode(`${header}.${body}`)
    );
    if (!valid) return null;

    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(body))) as {
      role?: string;
      exp: number;
    };
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload.role ?? null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("amarbn_session")?.value;
  const role = token ? await getSessionRole(token) : null;

  if (pathname.startsWith("/admin") || pathname.startsWith("/portal")) {
    if (!token || !role) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname.startsWith("/admin") && !ADMIN_ROLES.includes(role)) {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
  }

  if (pathname === "/login" && token && role) {
    const destination = ADMIN_ROLES.includes(role) ? "/admin" : "/portal";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*", "/login"],
};
