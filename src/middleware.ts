import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_PATHS = ["/login", "/register", "/forgot-password", "/reset-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));
  const isAthlete = pathname.startsWith("/athlete");
  const isTrainer = pathname.startsWith("/trainer");
  const isAdmin = pathname.startsWith("/admin");
  const isProtected = isAthlete || isTrainer || isAdmin;

  if (isAuthPage && token) {
    const role = token.role as string;
    const dest =
      role === "TRAINER"
        ? "/trainer"
        : ["SUPER_ADMIN", "ADMIN", "BRANCH_MANAGER", "STAFF"].includes(role)
          ? "/admin"
          : "/athlete";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  if (isProtected && !token) {
    const login = new URL("/login", request.url);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  if (token) {
    const role = token.role as string;
    if (isAthlete && role !== "ATHLETE" && role !== "SUPER_ADMIN") {
      // allow admins to peek? no — redirect to their dashboard
      if (role === "TRAINER") return NextResponse.redirect(new URL("/trainer", request.url));
      if (["SUPER_ADMIN", "ADMIN", "BRANCH_MANAGER", "STAFF"].includes(role)) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    if (isTrainer && role !== "TRAINER" && role !== "SUPER_ADMIN") {
      if (role === "ATHLETE") return NextResponse.redirect(new URL("/athlete", request.url));
      if (["SUPER_ADMIN", "ADMIN", "BRANCH_MANAGER", "STAFF"].includes(role)) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    if (isAdmin && !["SUPER_ADMIN", "ADMIN", "BRANCH_MANAGER", "STAFF"].includes(role)) {
      if (role === "TRAINER") return NextResponse.redirect(new URL("/trainer", request.url));
      return NextResponse.redirect(new URL("/athlete", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/athlete/:path*", "/trainer/:path*", "/admin/:path*", "/login", "/register", "/forgot-password", "/reset-password"],
};
