import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "./modules/jwt";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/member")) {
    try {
      const cookie = request.cookies.get("user");
      jwtDecode(cookie?.value);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/api/auth/login", request.url));
    }
  }
}

export const config = {
  runtime: "nodejs",
};
