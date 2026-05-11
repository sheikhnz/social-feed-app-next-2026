/**
 * Client-side guards before requesting a signed upload (size cap + binary sniffing via file-type).
 */

import { fileTypeFromBuffer } from "file-type";

export const MAX_POST_IMAGE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_POST_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

const MIME_SET = new Set<string>(ALLOWED_POST_IMAGE_MIME_TYPES);

/** Enough leading bytes for reliable magic-number detection (see file-type readme). */
const SNIFF_CHUNK_BYTES = 16_384;

export type ImageFileValidation =
  | { readonly ok: true }
  | { readonly ok: false; readonly message: string };

/**
 * Validates browser `File` objects before upload: size cap, strict allowlist on detected MIME,
 * and optional mismatch vs the browser-reported `file.type` (spoofed extensions).
 */
export const validatePostImageFile = async ({
  file,
}: {
  readonly file: File;
}): Promise<ImageFileValidation> => {
  if (file.size === 0) {
    return { ok: false, message: "That file is empty." };
  }

  if (file.size > MAX_POST_IMAGE_BYTES) {
    return {
      ok: false,
      message: `Images must be ${MAX_POST_IMAGE_BYTES / (1024 * 1024)} MB or smaller.`,
    };
  }

  const chunkLength = Math.min(file.size, SNIFF_CHUNK_BYTES);
  const chunk = new Uint8Array(await file.slice(0, chunkLength).arrayBuffer());

  const detected = await fileTypeFromBuffer(chunk);

  if (!detected || !MIME_SET.has(detected.mime)) {
    return {
      ok: false,
      message: "Please choose a JPEG, PNG, WebP, or GIF image.",
    };
  }

  if (file.type && file.type !== detected.mime) {
    return {
      ok: false,
      message: "File type does not match its contents.",
    };
  }

  return { ok: true };
};
