"use client";

import { useCallback, useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";

type Props = {
  value?: string | null;
  onChange: (url: string | null) => void;
  endpoint: string; // e.g. "/api/products/upload"
  label?: string;
  className?: string;
  shape?: "square" | "rounded" | "circle";
  height?: number;
};

export function ImageDrop({
  value,
  onChange,
  endpoint,
  label,
  className = "",
  shape = "rounded",
  height = 180,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large (max 5 MB)");
        return;
      }
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const data = await api.post<{ url: string }>(endpoint, fd, true);
        onChange(data.url);
        toast.success("Image uploaded");
      } catch (e) {
        toast.error((e as Error).message);
      } finally {
        setUploading(false);
      }
    },
    [endpoint, onChange]
  );

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) upload(f);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) upload(f);
  };

  const radius =
    shape === "circle" ? "rounded-full" : shape === "rounded" ? "rounded-lg" : "rounded";

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative border-2 border-dashed transition-all cursor-pointer overflow-hidden ${radius} ${
          dragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-primary/60 hover:bg-gray-50"
        }`}
        style={{ height }}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 text-sm select-none px-4 text-center">
            {uploading ? (
              <>
                <Loader2 className="animate-spin text-primary mb-2" size={28} />
                Uploading…
              </>
            ) : (
              <>
                <ImagePlus className="text-gray-400 mb-2" size={28} />
                <span>Drag & drop an image, or click to browse</span>
                <span className="text-xs text-gray-400 mt-1">JPG / PNG / WEBP — max 5 MB</span>
              </>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onPick}
          className="hidden"
        />
      </div>
    </div>
  );
}
