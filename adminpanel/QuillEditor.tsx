"use client";

import { useEffect } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { useFormikContext } from "formik";

interface Props {
  name: string;
}

export default function QuillEditor({ name }: Props) {
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

  useEffect(() => {
    if (!quill) return;

    if (values[name]) {
      quill.root.innerHTML = values[name];
    }

    quill.on("text-change", () => {
      setFieldValue(name, quill.root.innerHTML);
    });
  }, [quill]);

  const errorMsg =
    touched[name] && typeof errors[name] === "string"
      ? errors[name]
      : "";

  return (
    <div className="w-full">
      <div
        className={`rounded-xl overflow-hidden border transition ${
          errorMsg
            ? "border-red-500"
            : "border-border"
        }`}
      >
        <div ref={quillRef} className="bg-white"  />
      </div>

      {errorMsg && (
        <p className="text-red-500 text-xs mt-2">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
