import { NextResponse } from "next/server";

export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = { success: false; error: string };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export const ok = <T>(data: T): NextResponse<ApiSuccess<T>> =>
  NextResponse.json({ success: true, data }, { status: 200 });

export const created = <T>(data: T): NextResponse<ApiSuccess<T>> =>
  NextResponse.json({ success: true, data }, { status: 201 });

export const badRequest = (error: string): NextResponse<ApiError> =>
  NextResponse.json({ success: false, error }, { status: 400 });

export const unauthorized = (): NextResponse<ApiError> =>
  NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

export const forbidden = (): NextResponse<ApiError> =>
  NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

export const notFound = (resource = "Resource"): NextResponse<ApiError> =>
  NextResponse.json(
    { success: false, error: `${resource} not found` },
    { status: 404 },
  );

export const internalError = (
  error = "Internal server error",
): NextResponse<ApiError> =>
  NextResponse.json({ success: false, error }, { status: 500 });
