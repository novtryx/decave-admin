// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ACCESS_TOKEN_KEY,
  FULL_NAME_KEY,
  MANAGEMENT_HOME,
  getFullNameFromToken,
  isManagementName,
  isManagementPath,
} from "@/lib/session";

// Everything except the login page ("/"), Next internals and static files.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get(ACCESS_TOKEN_KEY)?.value;
  const { pathname } = request.nextUrl;

  // Login page: if already logged in, send them to the right place.
  if (pathname === "/") {
    if (token) {
      const name =
        getFullNameFromToken(token) ?? request.cookies.get(FULL_NAME_KEY)?.value;
      const dest = isManagementName(name) ? MANAGEMENT_HOME : "/dashboard";
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return NextResponse.next();
  }

  // Everything else needs a token.
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Management accounts may only see check-in.
  const fullName =
    getFullNameFromToken(token) ?? request.cookies.get(FULL_NAME_KEY)?.value;
  if (isManagementName(fullName) && !isManagementPath(pathname)) {
    return NextResponse.redirect(new URL(MANAGEMENT_HOME, request.url));
  }

  return NextResponse.next();
}