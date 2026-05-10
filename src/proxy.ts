import { auth } from "@/auth";

/**
 * Next.js 16+ network boundary (formerly `middleware`). Auth.js attaches session to the request.
 * Route rules live in `callbacks.authorized` inside `auth.ts` until you add redirects here.
 */
export default auth(() => {
  /* Intentionally empty — extend when you add protected segments. */
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
