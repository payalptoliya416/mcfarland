import Image from "next/image";
interface UploadBoxProps {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  defaultUrl?: string | null;
  disabled?: boolean;
}

export const UploadBox = ({
  label,
  file,
  onChange,
  defaultUrl,
  disabled = false,
}: UploadBoxProps) => {
  const previewUrl = file ? URL.createObjectURL(file) : defaultUrl || null;
  const inputId = `upload-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const isPdf = (url?: string | null) =>
    url ? url.toLowerCase().split("?")[0].endsWith(".pdf") : false;

  const isCurrentPdf = file
    ? file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf"
    : isPdf(previewUrl);

  return (
    <div>
      <p className="mb-3 text-base font-medium text-[#22201C]">{label}</p>

      <div className="relative w-full h-[220px] rounded-[16px] border border-dashed border-[#F97316] bg-[#FFFDFB] overflow-hidden group">
        {!disabled && (
          <input
            id={inputId}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => onChange(e.target.files?.[0] || null)}
          />
        )}

        {!previewUrl && (
          <label
            htmlFor={disabled ? undefined : inputId}
            className={`flex h-full w-full flex-col items-center justify-center ${
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <Image
              src="/assets/images/upload-icon.svg"
              alt="Upload"
              width={0}
              height={0}
              sizes="100vw"
              className="mb-[15px] w-auto h-auto"
            />

            <h3 className="text-lg font-semibold text-gray mb-[25px]">
              Upload a File
            </h3>

            {!disabled && (
              <span className="border border-[#62605F] rounded-lg px-5 py-[10px] text-[#7A7A7A] text-base !leading-[16px]">
                Choose File
              </span>
            )}
          </label>
        )}

        {previewUrl && (
          <>
            {isCurrentPdf ? (
              <div className="flex flex-col items-center justify-center h-full w-full p-4 text-center">
                <span className="text-4xl mb-2">📄</span>
                <p className="text-sm font-semibold text-gray-700 max-w-[90%] truncate">
                  {file?.name || "Document.pdf"}
                </p>
                {defaultUrl && !file && (
                  <a
                    href={defaultUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-xs text-blue-600 underline font-medium hover:text-blue-800 z-10"
                  >
                    View PDF in new tab
                  </a>
                )}
              </div>
            ) : (
              <>
                <Image
                  src={previewUrl}
                  alt={label}
                  fill
                  unoptimized
                  className="absolute inset-0 object-contain p-4"
                />
                {defaultUrl && !file && (
                  <a
                    href={defaultUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open in new tab"
                    className="absolute bottom-3 left-3 z-10 px-2.5 py-1 bg-black/60 hover:bg-black/80 text-white text-xs rounded-md transition"
                  >
                    View Full
                  </a>
                )}
              </>
            )}

            {/* Remove newly selected file */}
            {file && !disabled && (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white cursor-pointer hover:bg-black/80"
              >
                ✕
              </button>
            )}

            {/* Hover Overlay if not disabled */}
            {!disabled && (
              <label
                htmlFor={inputId}
                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                <span className="rounded-[10px] bg-white px-6 py-3 text-base font-medium text-[#22201C] shadow">
                  {file || defaultUrl ? "Change File" : "Choose File"}
                </span>
              </label>
            )}
          </>
        )}
      </div>
    </div>
  );
};
