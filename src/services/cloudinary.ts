import { v2 as cloudinary } from "cloudinary";
import { getServerEnv } from "@/lib/env";

const CLOUDINARY_NOT_CONFIGURED =
  "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.";

/**
 * Configure the Cloudinary SDK from server-only environment variables.
 */
export const configureCloudinaryFromEnv = (): void => {
  const { cloudName, cloudinaryApiKey, cloudinaryApiSecret } = getServerEnv();
  if (!cloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
    return;
  }
  cloudinary.config({
    cloud_name: cloudName,
    api_key: cloudinaryApiKey,
    api_secret: cloudinaryApiSecret,
    secure: true,
  });
};

/**
 * Returns true when all Cloudinary keys are present.
 */
export const isCloudinaryConfigured = (): boolean => {
  const { cloudName, cloudinaryApiKey, cloudinaryApiSecret } = getServerEnv();
  return Boolean(cloudName && cloudinaryApiKey && cloudinaryApiSecret);
};

type UploadBufferInput = {
  buffer: Buffer;
  folder: string;
  publicId?: string;
};

/**
 * Upload a binary buffer to Cloudinary (server-only). Throws if env is incomplete.
 */
export const uploadBufferToCloudinary = async ({
  buffer,
  folder,
  publicId,
}: UploadBufferInput): Promise<{ secureUrl: string; publicId: string }> => {
  if (!isCloudinaryConfigured()) {
    throw new Error(CLOUDINARY_NOT_CONFIGURED);
  }
  configureCloudinaryFromEnv();

  const result = await new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, public_id: publicId, resource_type: "auto" },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error("Cloudinary upload failed"));
            return;
          }
          resolve(uploadResult);
        },
      );
      stream.end(buffer);
    },
  );

  return { secureUrl: result.secure_url, publicId: result.public_id };
};
