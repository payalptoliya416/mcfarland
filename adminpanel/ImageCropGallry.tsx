import Cropper from "react-easy-crop";
import { useEffect, useState } from "react";

interface Props {
  image: string;
  open: boolean;
  aspect: number;
  outputWidth: number;
  outputHeight: number;

  isLast?: boolean;
  onNext?: (file: File) => void;

  onComplete?: (file: File) => void;

  onClose: () => void;
}

export function ImageCropGallry({
  image,
  open,
  aspect,
  outputWidth,
  outputHeight,
  isLast,
  onNext,
  onComplete,
  onClose,
}: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
      setCroppedAreaPixels(null);
     setSaving(false);
  }, [image]);

  if (!open) return null;

  const onCropComplete = (_: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  };

const createCroppedImage = async () => {
  if (!croppedAreaPixels) return;
 setSaving(true);
  const img = new Image();
  img.src = image;
  await new Promise((res) => (img.onload = res));

  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const ctx = canvas.getContext("2d")!;

  /* ✅ FILL WHITE BACKGROUND */
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  /* ✅ DRAW IMAGE */
  ctx.drawImage(
    img,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    outputWidth,
    outputHeight
  );

  /* ✅ EXPORT AS PNG (supports transparency properly) */
  const blob: Blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b!), "image/png")
  );

  const file = new File([blob], "cropped.png", {
    type: "image/png",
  });

  if (onNext) {
    await onNext(file);
  } else if (onComplete) {
    await onComplete(file);
  }

   setSaving(false);
};

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-xl p-2 sm:p-3 w-[90vw] max-w-[600px] shadow-xl">
      
      {/* Crop Area */}
      <div className="relative h-[350px] bg-gray-100 rounded-xl overflow-hidden">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      {/* Buttons */}
  <div className="mt-5 flex justify-end gap-3">

  {/* Cancel Disabled While Upload */}
  <button
    type="button"
    onClick={onClose}
    disabled={saving}
    className={`px-5 py-2 rounded-lg border cursor-pointer
      ${saving ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}
    `}
  >
    Cancel
  </button>

  {/* Crop Button */}
  <button
    type="button"
    onClick={createCroppedImage}
    disabled={saving}
    className={`px-5 py-2 rounded-lg text-white flex items-center gap-2 cursor-pointer
      ${saving ? "bg-gray-400 cursor-not-allowed" : "bg-green hover:bg-green/90"}
    `}
  >
    {saving ? (
      <>
        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        Uploading...
      </>
    ) : (
      "Crop & Save"
    )}
  </button>
</div>

    </div>
  </div>
  );
}
