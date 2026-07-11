import { ChangeEvent } from "react";

interface ImageUploaderProps {
  preview: string;
  onChange: (file: File | null) => void;
}

export default function ImageUploader({
  preview,
  onChange,
}: ImageUploaderProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full rounded-md border p-2"
      />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="h-40 rounded-lg border object-cover"
        />
      )}
    </div>
  );
}