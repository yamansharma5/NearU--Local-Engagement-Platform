"use client";

import { useRef, useState } from "react";
import { ImageUp, Loader2, X } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import FieldError from "@/components/common/FieldError";

export default function ImageUploadField({
  label,
  value,
  onChange,
  error,
  previewAlt = "Selected image",
  uploadPath = "/upload",
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.post(uploadPath, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(response.data.data.url);
    } catch (err) {
      setUploadError(err.response?.data?.message || "Unable to upload image.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div>
      <Label>{label}</Label>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleFileChange}
      />
      <div className="mt-2 flex flex-col gap-3 rounded-lg border border-input bg-background p-3">
        {value ? (
          <div className="overflow-hidden rounded-md border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt={previewAlt} className="h-44 w-full object-cover" />
          </div>
        ) : (
          <div className="flex h-28 items-center justify-center rounded-md border border-dashed border-input text-sm text-muted-foreground">
            No image selected
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="h-9 gap-2 px-3 text-sm"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageUp className="h-4 w-4" />}
            {uploading ? "Uploading..." : value ? "Change image" : "Browse desktop"}
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => onChange("")}
              disabled={uploading}
              className="h-9 gap-2 px-3 text-sm"
            >
              <X className="h-4 w-4" />
              Remove
            </Button>
          )}
        </div>
      </div>
      <FieldError>{error || uploadError}</FieldError>
    </div>
  );
}
