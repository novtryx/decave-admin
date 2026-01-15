// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_TOKEN_KEY = "accessToken";

// Protected routes (statically defined!)
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/analytics/:path*",
    "/events/:path*",
    "/partners-and-sponsors/:path*",
    "/sales-and-transactions/:path*",
    "/settings/:path*",
  ],
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get(ACCESS_TOKEN_KEY)?.value;
  const { pathname } = request.nextUrl;

  // Check if current path starts with any of the protected routes
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/events") ||
    pathname.startsWith("/partners-and-sponsors") ||
    pathname.startsWith("/sales-and-transactions") ||
    pathname.startsWith("/settings");

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
