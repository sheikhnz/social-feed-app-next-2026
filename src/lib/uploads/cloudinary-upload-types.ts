/**
 * Shared shape for signed direct-upload parameters returned by the API and consumed in the browser.
 */
export type CloudinarySignedUploadParams = {
  readonly timestamp: number;
  readonly signature: string;
  readonly apiKey: string;
  readonly cloudName: string;
  readonly folder: string;
  readonly transformation: string;
};

type CloudinaryUploadSuccessPayload = {
  readonly secure_url?: string;
};

const extractSecureUrl = (
  payload: unknown,
): string | null => {
  if (!payload || typeof payload !== "object") return null;
  const url = (payload as CloudinaryUploadSuccessPayload).secure_url;
  return typeof url === "string" && url.length > 0 ? url : null;
};

/**
 * Parses Cloudinary upload JSON; returns secure URL or an error message.
 */
export const parseCloudinaryUploadJson = ({
  rawJson,
}: {
  readonly rawJson: string;
}): { readonly ok: true; readonly secureUrl: string } | { readonly ok: false; readonly message: string } => {
  try {
    const parsed: unknown = JSON.parse(rawJson);
    const secureUrl = extractSecureUrl(parsed);
    if (secureUrl) {
      return { ok: true, secureUrl };
    }

    const errMsg =
      parsed &&
      typeof parsed === "object" &&
      "error" in parsed &&
      typeof (parsed as { error?: { message?: string } }).error?.message === "string"
        ? (parsed as { error: { message: string } }).error.message
        : "Upload failed.";
    return { ok: false, message: errMsg };
  } catch {
    return { ok: false, message: "Invalid response from image host." };
  }
};
