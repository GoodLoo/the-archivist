"use client";

import { useRef, useState, useCallback, useEffect } from "react";

export interface ImageItem {
  id?: string;
  url: string;
  isPrimary?: boolean;
  file?: File;
}

export interface ImageUploaderProps {
  images: ImageItem[];
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
  onSetPrimary?: (index: number) => void;
  multiple?: boolean;
  uploading?: boolean;
  compact?: boolean;
}

export default function ImageUploader({
  images,
  onAdd,
  onRemove,
  onSetPrimary,
  multiple = false,
  uploading = false,
  compact = false,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback((files: FileList) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (valid.length > 0) onAdd(valid);
  }, [onAdd]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const files: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
    }
    if (files.length > 0) onAdd(files);
  }, [onAdd]);

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <div className={`grid gap-2 ${compact ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3"}`}>
          {images.map((img, i) => (
            <div key={i} className={`relative group border ${img.isPrimary ? "border-crimson" : "border-dark-border dark:border-dark-border border-gray-200"}`}>
              <img src={img.url} alt="" className={`w-full object-cover ${compact ? "aspect-[3/2]" : "aspect-square"}`} />
              {img.isPrimary && (
                <span className="absolute top-1 left-1 bg-crimson text-white text-[10px] font-bold uppercase px-1.5 py-0.5">Primary</span>
              )}
              {img.file && (
                <span className="absolute top-1 right-1 bg-yellow-500 text-white text-[10px] font-bold uppercase px-1.5 py-0.5">Pending</span>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {onSetPrimary && !img.isPrimary && (
                  <button type="button" onClick={() => onSetPrimary(i)} className="text-[10px] bg-white text-black px-2 py-1 font-medium">Set Primary</button>
                )}
                <button type="button" onClick={() => onRemove(i)} className="text-[10px] bg-crimson text-white px-2 py-1 font-medium">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed p-4 sm:p-6 text-center cursor-pointer transition-colors ${dragOver ? "border-crimson bg-crimson/5" : "border-dark-border/50 dark:border-dark-border/50 border-gray-300 hover:border-crimson hover:bg-crimson/5"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = ""; }}
          className="hidden"
          disabled={uploading}
        />
        <div className="flex flex-col items-center gap-1.5">
          <svg className="h-6 w-6 text-dark-text-secondary dark:text-dark-text-secondary text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-xs text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">
            {dragOver ? "Drop images here" : "Drop images, click to browse, or paste"}
          </p>
          {uploading && <p className="text-[10px] text-crimson">Uploading...</p>}
        </div>
      </div>
    </div>
  );
}
