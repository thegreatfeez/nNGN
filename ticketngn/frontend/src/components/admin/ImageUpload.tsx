import { type FC, useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { Spinner } from "../shared/Spinner";

const CLOUD_NAME  = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME  as string | undefined;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export const ImageUpload: FC<ImageUploadProps> = ({ value, onChange }) => {
  const inputRef  = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging,  setDragging]  = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  async function upload(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10 MB");
      return;
    }
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setError("Cloudinary is not configured — add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your .env");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message ?? "Cloudinary upload failed");
      }

      onChange(data.secure_url as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }

  if (value) {
    return (
      <div className="relative h-44 rounded-xl overflow-hidden border border-gray-200 group">
        <img src={value} alt="Event" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-500 hover:text-rose-500 hover:border-rose-200 transition-colors"
          title="Remove"
        >
          <X size={13} />
        </button>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-2 right-2 bg-white/90 border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-gray-600 hover:text-violet-600 shadow-sm transition-colors"
        >
          Replace
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`h-44 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all select-none ${
          uploading
            ? "border-violet-200 bg-violet-50/30 cursor-wait"
            : dragging
            ? "border-violet-400 bg-violet-50 cursor-copy"
            : "border-gray-200 bg-gray-50 hover:border-violet-300 hover:bg-violet-50/40 cursor-pointer"
        }`}
      >
        {uploading ? (
          <>
            <Spinner size="lg" />
            <p className="text-sm text-gray-400 font-medium">Uploading to Cloudinary…</p>
          </>
        ) : (
          <>
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center transition-colors ${
              dragging ? "bg-violet-200" : "bg-violet-100"
            }`}>
              {dragging
                ? <ImageIcon size={22} className="text-violet-600" />
                : <Upload   size={22} className="text-violet-500" />
              }
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700">
                {dragging ? "Drop to upload" : "Click or drag & drop"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">JPEG · PNG · WebP · max 10 MB</p>
            </div>
          </>
        )}
      </div>

      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
};
