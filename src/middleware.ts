import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";
import createMiddleware from "next-intl/middleware";

export default async function middleware(request: NextRequest) {
   const [, locale, ...segments] = request.nextUrl.pathname.split("/");

   const token = request.cookies.get("token")?.value as undefined | string;

   const userData = await verifyToken(token);

   if (segments[0] === "select-role") {
      if (userData?.role) {
         request.nextUrl.pathname = `/${locale}/`;
      }
   }

   if (segments[0] === "user") {
      if (!userData) {
         request.nextUrl.pathname = `/${locale}/login`;
      }
   }

   if (segments[0] === "search") {
      if (userData?.role == "tenant") {
         request.nextUrl.pathname = `/${locale}/unauthorized`;
      }
   }

   if (!segments[0]) {
      if (userData?.role == "tenant") {
         request.nextUrl.pathname = `/${locale}/unauthorized`;
      }
   }

   if (segments.join("/") === "user/bookings/") {
      if (userData?.role !== "customer") {
         request.nextUrl.pathname = `/${locale}/unauthorized`;
      }
   }

   if (segments[0] === "tenant") {
      if (userData?.role !== "tenant") {
         request.nextUrl.pathname = `/${locale}/unauthorized`;
      }
   }

   const handleI18nRouting = createMiddleware({
      locales: ["en", "id"],
      defaultLocale: "en",
   });
   const response = handleI18nRouting(request);

   return response;
}

export const config = {
   // Match only internationalized pathnames
   matcher: [
      // Enable a redirect to a matching locale at the root
      "/",

      // Set a cookie to remember the previous locale for
      // all requests that have a locale prefix
      "/(id|en)/:path*",

      // Enable redirects that add missing locales
      // (e.g. `/pathnames` -> `/en/pathnames`)
      "/((?!_next|_vercel|.*\\..*).*)",
   ],
};
