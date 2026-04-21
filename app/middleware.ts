import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authtoken")?.value;
  const adminToken = req.cookies.get("admin_token")?.value;

  const { pathname } = req.nextUrl;

  // User protected
  if (pathname.startsWith("/user") && !token) {
    return NextResponse.redirect(new URL("/user/signin", req.url));
  }

  // Admin protected
  if (pathname.startsWith("/admin") && pathname !== "/admin" && !adminToken) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/admin/:path*"],
};
