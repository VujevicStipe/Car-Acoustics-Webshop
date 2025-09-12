import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { NextMiddleware, NextFetchEvent } from "next/server";
import createMiddleware from "next-intl/middleware";
import { jwtVerify } from "jose";

const locales = ["en", "hr"];
const PUBLIC_FILE = /\.(.*)$/;

function getLocaleFromPath(path: string): string {
  const match = path.match(/^\/(en|hr)(\/|$)/);
  return match ? match[1] : "en";
}

export default withExtraMiddleware(
  createMiddleware({
    locales,
    defaultLocale: "en",
    localeDetection: true,
  })
);

function withExtraMiddleware(next: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    if (
      request.nextUrl.pathname.startsWith("/_next") ||
      request.nextUrl.pathname.includes("/api/") ||
      PUBLIC_FILE.test(request.nextUrl.pathname)
    ) {
      return next(request, event);
    }

    const url = request.nextUrl.clone();
    const cookieName = process.env.COOKIE_NAME || "JWTToken";
    const token = request.cookies.get(cookieName)?.value;
    const locale = getLocaleFromPath(url.pathname);

    const homePath = locale === "en" ? "/" : `/${locale}`;
    const secret = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;
    if (!secret) throw new Error("Missing JWT secret");

    // Existing admin protection
    const adminRegex = new RegExp(`^\/(?:${locales.join("|")})?\/?admin(\/|$)`);
    if (adminRegex.test(url.pathname)) {
      if (!token) {
        url.pathname = homePath;
        return NextResponse.redirect(url);
      }
      try {
        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(secret)
        );
        if (payload.role !== "admin") {
          url.pathname = homePath;
          return NextResponse.redirect(url);
        }
      } catch {
        url.pathname = homePath;
        return NextResponse.redirect(url);
      }
    }

    const checkoutRegex = new RegExp(
      `^\/(?:${locales.join("|")})?\/?checkout(\/|$)`
    );
    if (checkoutRegex.test(url.pathname)) {
      if (!token) {
        url.pathname = homePath;
        return NextResponse.redirect(url);
      }
      try {
        await jwtVerify(token, new TextEncoder().encode(secret));
      } catch {
        url.pathname = homePath;
        return NextResponse.redirect(url);
      }
    }

    const changePasswordRegex = new RegExp(
      `^\/(?:${locales.join("|")})?\/?change-password(\/|$)`
    );
    if (changePasswordRegex.test(url.pathname)) {
      if (!token) {
        url.pathname = homePath;
        return NextResponse.redirect(url);
      }
      try {
        await jwtVerify(token, new TextEncoder().encode(secret));
      } catch {
        url.pathname = homePath;
        return NextResponse.redirect(url);
      }
    }

    return next(request, event);
  };
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|api).*)"],
};
