import { auth } from "@/auth";
import { internalError, unauthorized } from "./response";
import type { NextRequest, NextResponse } from "next/server";

type RouteContext<P> = { userId: string; params: P };
type AuthedHandler<P> = (
  req: NextRequest,
  ctx: RouteContext<P>,
) => Promise<NextResponse>;

/**
 * HOF that wraps a route handler with JWT session authentication.
 *
 * - Returns 401 immediately if there is no active session.
 * - Catches all unhandled errors and returns 500 (prevents stack-trace leaks).
 * - Passes the resolved `params` promise and `userId` into the handler.
 *
 * @example
 * // Non-dynamic route
 * export const POST = withAuth(async (req, { userId }) => { ... });
 *
 * // Dynamic route
 * export const DELETE = withAuth<{ postId: string }>(
 *   async (req, { userId, params }) => { ... }
 * );
 */
export function withAuth<
  P extends Record<string, string> = Record<string, never>,
>(handler: AuthedHandler<P>) {
  return async (
    req: NextRequest,
    routeContext?: { params: Promise<P> },
  ): Promise<NextResponse> => {
    const session = await auth();
    if (!session?.user?.id) return unauthorized();

    const resolvedParams = routeContext?.params
      ? await routeContext.params
      : ({} as P);

    try {
      return await handler(req, {
        userId: session.user.id,
        params: resolvedParams,
      });
    } catch (err) {
      console.error("[API Error]", err);
      return internalError();
    }
  };
}
