import { createServerClient, parse, serialize } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function proxy(req) {
  const res = NextResponse.next();
  const cookies = parse(req.headers.get("cookie") ?? "");

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) { return cookies[name]; },
        set(name, value, options) {
          res.headers.append("Set-Cookie", serialize(name, value, options));
        },
        remove(name, options) {
          res.headers.append("Set-Cookie", serialize(name, "", { ...options, maxAge: 0 }));
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/dashboard") && !session) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
