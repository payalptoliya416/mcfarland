"use client";

import { useEffect } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { useFormikContext } from "formik";

interface Props {
  name: string;
  label?: string;
  required?: boolean;
}

export default function BankDetailsEditor({
  name,
  label = "Bank Details",
  required = true,
}: Props) {
  const { values, setFieldValue, errors, touched } =
    useFormikContext<any>();

 const { quill, quillRef } = useQuill({
  theme: "snow",
  placeholder: "Enter description here...",
  modules: {
    toolbar: [
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],

      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      ["bold", "italic", "underline", "strike"],

      [{ color: [] }, { background: [] }],

      [{ script: "sub" }, { script: "super" }],

      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],

      [{ direction: "rtl" }],

      [{ align: [] }],

      ["link", "image", "video"],

      ["blockquote", "code-block"],

      ["clean"],
    ],
  },
});

  // Sync Quill with Formik
  useEffect(() => {
    if (!quill) return;

    quill.root.innerHTML = values[name] || "";

    quill.on("text-change", () => {
      setFieldValue(name, quill.root.innerHTML);
    });
  }, [quill]);

  const errorMsg =
    touched[name] && typeof errors[name] === "string"
      ? errors[name]
      : "";

  return (
    <div className="border border-border rounded-[14px] bg-white p-3 sm:p-5">
      <label className="block mb-3 text-base font-normal text-lightblack">
        {label}{" "}
        {required && <span className="text-redmark">*</span>}
      </label>

      <div
        className={`rounded-xl overflow-hidden border transition ${
          errorMsg ? "border-red-500" : "border-border"
        }`}
      >
        <div ref={quillRef} className="bg-white min-h-[150px]" />
      </div>

      {errorMsg && (
        <p className="text-xs text-red-500 mt-2">{errorMsg}</p>
      )}
    </div>
  );
}