export { auth as proxy } from "@/auth";

export const config = {
  matcher: [
    /*
     * Excluir:
     * - api
     * - _next/static
     * - _next/image
     * - favicon.ico
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
