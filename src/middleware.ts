import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { jwtVerify } from "jose";

const locales = ["en", "hr"];
const PUBLIC_FILE = /\.(.*)$/;

function getLocaleFromPath(path: string): string {
  const match = path.match(/^\/(en|hr)(\/|$)/);
  return match ? match[1] : "en";
}

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: "en",
  localeDetection: true,
});

export default async function middleware(req: NextRequest) {
  // Skip static files and api routes
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.includes("/api/") ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return intlMiddleware(req);
  }

  const url = req.nextUrl.clone();
  const cookieName = process.env.COOKIE_NAME || "JWTToken";
  const token = req.cookies.get(cookieName)?.value;
  const locale = getLocaleFromPath(url.pathname);
  const homePath = locale === "en" ? "/" : `/${locale}`;
  const secret = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;
  if (!secret) throw new Error("Missing JWT secret");

  const protectRoute = async (regex: RegExp, requireAdmin = false) => {
    if (!regex.test(url.pathname)) return false;
    if (!token) {
      url.pathname = homePath;
      return NextResponse.redirect(url);
    }
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
      if (requireAdmin && payload.role !== "admin") {
        url.pathname = homePath;
        return NextResponse.redirect(url);
      }
    } catch {
      url.pathname = homePath;
      return NextResponse.redirect(url);
    }
    return false;
  };

  // Check protected routes
  const adminRedirect = await protectRoute(/^\/(en|hr)?\/?admin(\/|$)/, true);
  if (adminRedirect) return adminRedirect;

  const checkoutRedirect = await protectRoute(/^\/(en|hr)?\/?checkout(\/|$)/);
  if (checkoutRedirect) return checkoutRedirect;

  const changePasswordRedirect = await protectRoute(/^\/(en|hr)?\/?change-password(\/|$)/);
  if (changePasswordRedirect) return changePasswordRedirect;

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|api).*)"],
};
