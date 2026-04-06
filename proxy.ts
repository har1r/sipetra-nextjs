import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/auth";

export default async function proxy(request: NextRequest) {
  const session = await getSession();
  const { pathname } = request.nextUrl;

  const isSignInPage = pathname.startsWith("/sign-in");
  const isSignUpPage = pathname.startsWith("/sign-up");
  const isDashboardPage = pathname.startsWith("/dashboard");

  if ((isSignInPage || isSignUpPage) && session?.user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isDashboardPage && !session?.user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const response = NextResponse.next();

  // ❌ No cache supaya browser tidak menampilkan snapshot lama
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );

  return response;
}
