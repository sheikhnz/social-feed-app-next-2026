import type { NextRequest, NextResponse } from "next/server";
import type { z } from "zod";
import { badRequest } from "./response";
import type { ApiError } from "./response";

/**
 * Read JSON from the request body and validate with Zod.
 * Centralizes `req.json` + `safeParse` for route handlers.
 */
export async function readValidatedJson<T extends z.ZodType>(
  req: NextRequest,
  schema: T,
): Promise<
  | { ok: true; data: z.infer<T> }
  | { ok: false; response: NextResponse<ApiError> }
> {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      response: badRequest(
        parsed.error.issues[0]?.message ?? "Invalid request body",
      ),
    };
  }
  return { ok: true, data: parsed.data };
}

/** Alias for callers that prefer the HOF-style name. */
export const withValidatedJson = readValidatedJson;
