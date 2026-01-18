import { NextRequest, NextResponse } from "next/server";
import { getUserInfoFromCookie } from "./modules/cookies";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/private")) {
    try {
      const { isMember, _id } = await getUserInfoFromCookie();
      if (!isMember) {
        throw Error("needs to be a club member");
      }
      // invalidate users without _id in cookie to force login and get new cookie with _id
      if (!_id) {
        throw Error("needs _id in cookie");
      }
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/api/auth/login", request.url));
    }
  } else if (pathname.startsWith("/admin")) {
    try {
      const { isAdmin } = await getUserInfoFromCookie();
      if (!isAdmin) {
        throw Error("needs to be a site admin");
      }
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/forbidden", request.url));
    }
  }
}
