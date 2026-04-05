// import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

// const publicRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];

export function middleware(_request: NextRequest) {
  // TODO: Uncomment when auth is ready
  // const sessionCookie = getSessionCookie(request);
  // const { pathname } = request.nextUrl;
  // const isPublicRoute = publicRoutes.some((route) => pathname === route);
  // const isApiRoute = pathname.startsWith("/api/");
  //
  // if (isApiRoute) return NextResponse.next();
  //
  // if (!sessionCookie && !isPublicRoute) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/login";
  //   return NextResponse.redirect(url);
  // }
  //
  // if (sessionCookie && isPublicRoute) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/";
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
