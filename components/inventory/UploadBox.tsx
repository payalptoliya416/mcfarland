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
  <p className="mb-3 text-base font-medium text-[#22201C]">{label}</p>

  <div className="relative w-full h-[220px] rounded-[16px] border border-dashed border-[#F97316] bg-[#FFFDFB] overflow-hidden group">
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
        className="flex h-full w-full cursor-pointer flex-col items-center justify-center"
      >
        <img src="/assets/images/upload-icon.svg" alt=""  className="mb-[15px]"/>

        <h3 className="text-lg font-semibold text-[#1D1B1A] mb-[25px]">
          Upload a File
        </h3>

        <span className="border border-[#62605F] rounded-lg px-5 py-[10px] text-[#7A7A7A] text-base !leading-[16px]">
          Choose File
        </span>
      </label>
    )}

    {file && (
      <>
        <img
          src={previewUrl!}
          alt="Preview"
          className="absolute inset-0 h-full w-full object-contain p-4"
        />

        {/* Remove */}
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white cursor-pointer"
        >
          ✕
        </button>

        {/* Hover Overlay */}
        <label
          htmlFor={inputId}
          className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <span className="rounded-[10px] bg-white px-6 py-3 text-base font-medium text-[#22201C]">
            Choose File
          </span>
        </label>
      </>
    )}
  </div>
</div>
  );
};