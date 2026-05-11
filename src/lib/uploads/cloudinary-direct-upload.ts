import type { CloudinarySignedUploadParams } from "@/lib/uploads/cloudinary-upload-types";
import { parseCloudinaryUploadJson } from "@/lib/uploads/cloudinary-upload-types";

const CLOUDINARY_UPLOAD_BASE = "https://api.cloudinary.com/v1_1";

export type UploadProgressHandler = (loaded: number, total: number) => void;

/**
 * Uploads a single image to Cloudinary using server-signed fields and reports XMLHttpRequest progress.
 */
export const uploadImageWithSignedParams = ({
  file,
  params,
  onProgress,
}: {
  readonly file: File;
  readonly params: CloudinarySignedUploadParams;
  readonly onProgress?: UploadProgressHandler;
}): Promise<string> =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `${CLOUDINARY_UPLOAD_BASE}/${params.cloudName}/image/upload`,
    );

    xhr.upload.onprogress = (evt) => {
      if (evt.lengthComputable && onProgress) {
        onProgress(evt.loaded, evt.total);
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.onload = () => {
      const raw = xhr.responseText ?? "";
      if (xhr.status < 200 || xhr.status >= 300) {
        const parsed = parseCloudinaryUploadJson({ rawJson: raw });
        reject(new Error(parsed.ok ? "Upload rejected." : parsed.message));
        return;
      }

      const parsed = parseCloudinaryUploadJson({ rawJson: raw });
      if (parsed.ok) {
        resolve(parsed.secureUrl);
        return;
      }
      reject(new Error(parsed.message));
    };

    const body = new FormData();
    body.append("file", file);
    body.append("api_key", params.apiKey);
    body.append("timestamp", String(params.timestamp));
    body.append("signature", params.signature);
    body.append("folder", params.folder);
    body.append("transformation", params.transformation);

    xhr.send(body);
  });
