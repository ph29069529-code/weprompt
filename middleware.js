import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;

  if (!session) {
    if (path.startsWith("/dashboard") || path.startsWith("/admin") || path.startsWith("/checkout")) {
      const redirect = encodeURIComponent(path);
      return NextResponse.redirect(new URL(`/login?redirect=${redirect}`, req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/checkout/:path*"],
};
