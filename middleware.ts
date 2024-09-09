import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const cookies = req.cookies.get("_auth-tk");
  
  if (!path.startsWith("/dashboard")) {
    return NextResponse.next();
  }
  else if (cookies === undefined) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}