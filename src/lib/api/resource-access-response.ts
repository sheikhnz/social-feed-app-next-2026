import type { NextResponse } from "next/server";
import { forbidden, notFound } from "./response";
import type { ApiError } from "./response";

export type ResourceAccess = "ok" | "not_found" | "forbidden";

/**
 * Map data-layer access outcome to an API response.
 * Returns `null` when access is allowed; otherwise a 404 or 403 response.
 */
export const resourceAccessToResponse = (
  access: ResourceAccess,
  notFoundLabel: string,
): NextResponse<ApiError> | null => {
  if (access === "ok") return null;
  if (access === "not_found") return notFound(notFoundLabel);
  return forbidden();
};
