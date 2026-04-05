import { NextResponse, type NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  // TODO: Will be replaced with better-auth cookie checks in a later atomic change
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
