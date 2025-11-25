import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const isAuthRoute = req.nextUrl.pathname === "/";

  // Se não tiver token e tentar acessar qualquer página protegida → redireciona
  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Se tiver token e tentar ir pra /login → manda pro dashboard
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

// Define quais rotas o middleware protege
export const config = {
  matcher: [
    "/((?!_next|api|public|favicon.ico|robots.txt|login).*)",
  ],
};
