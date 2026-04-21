"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import SignatureCanvas from "react-signature-canvas";

type Props = {
  onSignatureReady: (dataUrl: string) => void;
  clearTrigger?: boolean;
};

export default function SignaturePadBox({
  onSignatureReady,
  clearTrigger,
}: Props) {
  const sigRef = useRef<SignatureCanvas>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [canvasWidth, setCanvasWidth] = useState<number>(900);

  /* ✅ SET WIDTH ONLY ONCE */
  useEffect(() => {
    if (wrapperRef.current) {
      setCanvasWidth(wrapperRef.current.offsetWidth);
    }
  }, []);

  /* ✅ CLEAR CANVAS WHEN PARENT TRIGGERS */
  useEffect(() => {
    if (clearTrigger) {
      sigRef.current?.clear();
      onSignatureReady("");
    }
  }, [clearTrigger, onSignatureReady]);

  const handleClear = () => {
    sigRef.current?.clear();
    onSignatureReady("");
  };

  const handleSave = () => {
    if (!sigRef.current || sigRef.current.isEmpty()) {
      toast.error("Please draw your signature first");
      return;
    }

    const dataUrl = sigRef.current.getTrimmedCanvas().toDataURL("image/png");

    onSignatureReady(dataUrl);
    toast.success("Signature saved");
  };

  return (
    <div className="border border-border rounded-xl p-6 bg-white">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="text-secgray text-base font-semibold">
            Draw Signature
          </h2>
          <p className="text-sm text-seclightgray">Draw with mouse or touch</p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClear}
            className="h-9 px-5 rounded-lg border border-border text-sm font-medium
              bg-white hover:bg-[#F6F6F6] transition  cursor-pointer"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="h-9 px-5 rounded-lg bg-green text-sm font-medium
              text-white hover:bg-[#FFBD34] transition cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>

      {/* SIGNATURE PAD */}
      <div
        ref={wrapperRef}
        className="border border-border rounded-lg bg-[#F9F9F9] overflow-hidden"
      >
        <SignatureCanvas
          ref={sigRef}
          {...({ penColor: "#000" } as any)}
          canvasProps={{
            width: canvasWidth,
            height: 220,
            className: "bg-[#F9F9F9] cursor-crosshair block",
          }}
        />
      </div>
    </div>
  );
}
