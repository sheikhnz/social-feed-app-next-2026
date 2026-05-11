"use client";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type DragEvent,
} from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Progress } from "@/components/ui/antd";
import { fetchCloudinarySignedUploadParams } from "@/lib/api/feed-api";
import { uploadImageWithSignedParams } from "@/lib/uploads/cloudinary-direct-upload";
import {
  ALLOWED_POST_IMAGE_MIME_TYPES,
  validatePostImageFile,
} from "@/lib/uploads/image-file-validation";

const ACCEPT_ATTR = ALLOWED_POST_IMAGE_MIME_TYPES.join(",");

const PREVIEW_MAX_HEIGHT_PX = 72;
const PREVIEW_MAX_WIDTH_PX = 104;

const VISUALLY_HIDDEN_INPUT: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

export type CloudinaryImageUploaderHandle = {
  readonly openFilePicker: () => void;
};

export type CloudinaryImageUploaderProps = {
  readonly value: string | null;
  readonly onChange: (next: string | null) => void;
  readonly disabled?: boolean;
  readonly onBusyChange?: (busy: boolean) => void;
};

/**
 * Drag-and-drop + file-picker image upload backed by Cloudinary signed direct uploads.
 * Progress is surfaced via Ant Design `Progress`; authentication is enforced server-side when fetching signatures.
 */
export const CloudinaryImageUploader = forwardRef<
  CloudinaryImageUploaderHandle,
  CloudinaryImageUploaderProps
>(({ value, onChange, disabled = false, onBusyChange }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadPercent, setUploadPercent] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    openFilePicker: () => {
      if (!disabled) inputRef.current?.click();
    },
  }));

  const runUpload = useCallback(
    async (file: File) => {
      setErrorMessage(null);
      setUploadPercent(0);
      onBusyChange?.(true);

      const validation = await validatePostImageFile({ file });
      if (!validation.ok) {
        setUploadPercent(null);
        setErrorMessage(validation.message);
        onBusyChange?.(false);
        return;
      }

      try {
        const params = await fetchCloudinarySignedUploadParams();
        const secureUrl = await uploadImageWithSignedParams({
          file,
          params,
          onProgress: (loaded, total) => {
            if (total > 0) {
              setUploadPercent(Math.round((loaded / total) * 100));
            }
          },
        });
        onChange(secureUrl);
        setUploadPercent(null);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Could not upload image.";
        setErrorMessage(msg);
        setUploadPercent(null);
      } finally {
        onBusyChange?.(false);
      }
    },
    [onChange, onBusyChange],
  );

  const onInputChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file || disabled) return;
      await runUpload(file);
    },
    [disabled, runUpload],
  );

  const handleDragEnter = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      dragDepthRef.current += 1;
      setIsDragging(true);
    },
    [disabled],
  );

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepthRef.current -= 1;
    if (dragDepthRef.current <= 0) {
      dragDepthRef.current = 0;
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    async (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dragDepthRef.current = 0;
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      await runUpload(file);
    },
    [disabled, runUpload],
  );

  const clearAttachment = useCallback(() => {
    setErrorMessage(null);
    onChange(null);
  }, [onChange]);

  return (
    <div style={{ position: "relative" }}>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTR}
        style={VISUALLY_HIDDEN_INPUT}
        aria-hidden="true"
        tabIndex={-1}
        onChange={onInputChange}
      />

      <div
        role="region"
        aria-label="Post image drop zone"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          borderRadius: 8,
          border:
            isDragging && !disabled
              ? "2px dashed #377dff"
              : "2px dashed transparent",
          /* Flush with textarea left edge; keep inset on other sides. */
          padding: value ? "12px 12px 12px 0" : "8px 8px 8px 0",
          background:
            isDragging && !disabled ? "rgba(55,125,255,0.06)" : "transparent",
          transition: "border-color 0.15s ease, background 0.15s ease",
        }}
      >
        {value ? (
          <div
            style={{
              position: "relative",
              display: "inline-block",
              verticalAlign: "top",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Attached post preview"
              style={{
                display: "block",
                maxHeight: PREVIEW_MAX_HEIGHT_PX,
                maxWidth: PREVIEW_MAX_WIDTH_PX,
                width: "auto",
                height: "auto",
                borderRadius: 6,
                objectFit: "cover",
              }}
            />
            <button
              type="button"
              aria-label="Remove image"
              onClick={clearAttachment}
              disabled={disabled}
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 22,
                height: 22,
                padding: 0,
                margin: 0,
                border: "none",
                borderRadius: "50%",
                cursor: disabled ? "not-allowed" : "pointer",
                background: "rgba(0, 0, 0, 0.52)",
                color: "#fff",
                fontSize: 11,
                lineHeight: 1,
                boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
              }}
            >
              <CloseOutlined />
            </button>
          </div>
        ) : (
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "rgba(0,0,0,0.55)",
            }}
          >
            Drag an image here or use Photo to browse (JPEG, PNG, WebP, GIF · max 5&nbsp;MB).
          </p>
        )}
      </div>

      {uploadPercent !== null ? (
        <div style={{ marginTop: 10 }}>
          <Progress percent={uploadPercent} size="small" status="active" />
        </div>
      ) : null}

      {errorMessage ? (
        <p
          role="alert"
          style={{
            marginTop: 8,
            marginBottom: 0,
            color: "#cf1322",
            fontSize: 13,
          }}
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
});

CloudinaryImageUploader.displayName = "CloudinaryImageUploader";
