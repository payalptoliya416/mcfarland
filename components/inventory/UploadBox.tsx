import { IoCloudUploadOutline } from "react-icons/io5";

interface UploadBoxProps {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
}

export const UploadBox = ({ label, file, onChange }: UploadBoxProps) => {
  const previewUrl = file ? URL.createObjectURL(file) : null;
  const inputId = `upload-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div>
      <p className="font-medium mb-2">{label}</p>
      <div className="relative w-full h-[180px] rounded-xl border-2 border-dashed border-border overflow-hidden bg-gray-50 group">
        <input
          id={inputId}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
        />

        {!file && (
          <label
            htmlFor={inputId}
            className="flex flex-col items-center justify-center h-full cursor-pointer text-gray-500"
          >
            <IoCloudUploadOutline size={26} className="mb-3"/>

            <p className="text-sm">
              Drop your files here or{" "}
              <span className="text-green underline">Browse</span>
            </p>
          </label>
        )}

        {file && (
          <>
            {/* IMAGE (CONTAIN, NOT COVER) */}
            <img
              src={previewUrl!}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-contain p-2"
            />

            {/* REMOVE BUTTON (ONLY THIS CLEARS FILE) */}
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute top-3 right-3 z-10 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center"
            >
              ✕
            </button>

            {/* HOVER OVERLAY → CHANGE FILE */}
            <label
              htmlFor={inputId}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer"
            >
              <span className="bg-white px-4 py-2 rounded-lg text-sm font-medium">
                Choose File
              </span>
            </label>
          </>
        )}
      </div>
    </div>
  );
};