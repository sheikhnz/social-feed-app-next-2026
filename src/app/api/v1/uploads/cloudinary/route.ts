import type { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { withAuth } from "@/lib/api/auth-guard";
import { ok, serviceUnavailable } from "@/lib/api/response";
import { getCloudinaryEnv } from "@/lib/env";

/** Incoming transformation applied at upload time (resize cap + auto format/quality). */
const INCOMING_UPLOAD_TRANSFORMATION = "w_1600,c_limit,q_auto,f_auto";

/**
 * POST /api/v1/uploads/cloudinary
 *
 * Authenticated users only. Returns a short-lived signature bundle for direct browser upload
 * to Cloudinary (secret never leaves the server).
 */
export const POST = withAuth(async (_req: NextRequest, { userId }) => {
  const env = getCloudinaryEnv();
  if (!env) {
    return serviceUnavailable("Image uploads are not configured.");
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = `${env.uploadFolderPrefix}/${userId}`;
  const paramsToSign = {
    timestamp,
    folder,
    transformation: INCOMING_UPLOAD_TRANSFORMATION,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    env.apiSecret,
  );

  return ok({
    timestamp,
    signature,
    apiKey: env.apiKey,
    cloudName: env.cloudName,
    folder,
    transformation: INCOMING_UPLOAD_TRANSFORMATION,
  });
});
