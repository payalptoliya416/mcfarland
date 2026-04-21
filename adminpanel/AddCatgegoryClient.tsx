"use client";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RxCross2 } from "react-icons/rx";
import { MdCloudUpload } from "react-icons/md";
import { adminUploadService } from "@/api/admin/upload";
import {
  adminCategoryService,
  adminCategoryServiceadd,
} from "@/api/admin/category";
import toast from "react-hot-toast";
import Loader from "@/components/common/Loader";
import { ImageCropGallry } from "./ImageCropGallry";

const schema = Yup.object({
  categoryName: Yup.string().trim().required("Category name is required"),
  image_urls: Yup.array().min(1, "At least one image is required"),
});

const UrlPreview = ({
  urls,
  onRemove,
}: {
  urls: string[];
  onRemove?: (i: number) => void;
}) => {
  if (!Array.isArray(urls)) return null;

  return (
    <div className="flex gap-4 flex-wrap">
      {urls.map((url, i) => (
        <div key={i} className="relative w-[90px] h-[90px]">
          <Image
            src={url}
            alt="preview"
            fill
            className="rounded-[14px] object-cover"
          />

          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center"
            >
              <RxCross2 size={12} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

const DEFAULT_VALUES = {
  categoryName: "",
  totalMachinery: "",
  image_urls: [],
};

export default function AddCategoryClient() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEdit = Boolean(editId);
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [initialValues, setInitialValues] = useState(DEFAULT_VALUES);
  const [loading, setLoading] = useState(false);
  // ✅ Crop Queue System
const [cropQueue, setCropQueue] = useState<File[]>([]);
const [currentIndex, setCurrentIndex] = useState(0);
const [cropImage, setCropImage] = useState<string | null>(null);
  useEffect(() => {
    if (!isEdit) return;

    const fetchCategory = async () => {
      try {
        setLoading(true);

        const res = await adminCategoryService.show(Number(editId));
        const c = res.data;
        setInitialValues({
          categoryName: c?.category_name,
          totalMachinery: c.total_machinery,
          image_urls: Array.isArray(c.image_urls)
            ? c.image_urls
            : c.image_urls
            ? [c.image_urls]
            : [],
        });

        // 🔑 preview images
        setImages([]);
      } catch (e) {
        toast.error("Failed to load category");
       router.push("/admin/category");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [isEdit, editId]);
  if (isEdit && loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader />
      </div>
    );
  }
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const payload = {
            category_name: values.categoryName,
            total_machinery: Number(values.totalMachinery),
            image_urls: values.image_urls,
          };

          if (isEdit) {
            await adminCategoryService.update(Number(editId), payload);
            toast.success("Category updated successfully");
          } else {
            await adminCategoryServiceadd.store(payload);
            toast.success("Category added successfully");
          }

         router.push("/admin/category");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, touched, setFieldValue, values, isSubmitting }) => (
        <Form className="space-y-5 bg-white border border-border rounded-[14px] p-3 sm:p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-3 text-sm font-medium text-lightblack">
                Category Name <span className="text-redmark">*</span>
              </label>
              <Field
                name="categoryName"
                placeholder="Enter category name"
                className={`
                      w-full px-5 py-4 rounded-[10px] border focus:outline-none
                      ${
                        errors.categoryName && touched.categoryName
                          ? "border-red-500"
                          : "border-border"
                      }
                    `}
              />

              {errors.categoryName && touched.categoryName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.categoryName}
                </p>
              )}
            </div>
          </div>

          {/* IMAGE UPLOAD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* DROP ZONE */}
            <div
              className={`
                  border p-[10px] rounded-[10px]
                  ${
                    errors.image_urls && touched.image_urls
                      ? "border-red-500"
                      : "border-border"
                  }
                `}
            >
              <div
                className="relative border-2 border-dashed border-border rounded-[14px] p-8
                flex flex-col items-center justify-center  text-center cursor-pointer
                bg-[#F9F9F9] hover:border-[#FFCE67] transition   min-h-[150px] py-[24px] "
                onClick={() => !uploading && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg"
                  className="hidden"
                  // onChange={async (e) => {
                  //   if (!e.target.files) return;

                  //   const files = Array.from(e.target.files);

                  //   const formData = new FormData();
                  //   files.forEach((file) => {
                  //     formData.append("images[]", file);
                  //   });
                  //   formData.append("type", "category");

                  //   try {
                  //     setUploading(true); // 🔄 START LOADER

                  //     const res = await adminUploadService.uploadImage(
                  //       formData
                  //     );

                  //     const urls = res.data.images.map((img) => img.url);

                  //     // ✅ Store URLs in formik
                  //     setFieldValue("image_urls", (prev: string[]) => [
                  //       ...prev,
                  //       ...urls,
                  //     ]);

                  //     // ✅ Preview images
                  //     setImages((prev) => [...prev, ...files]);
                  //   } catch (err) {
                  //     // toast already handled
                  //   } finally {
                  //     setUploading(false); // ✅ STOP LOADER
                  //   }
                  // }}
                  onChange={(e) => {
  if (!e.target.files) return;

  const files = Array.from(e.target.files);

  if (!files.length) return;

  // ✅ Store all selected images
  setCropQueue(files);

  // ✅ Start from first image
  setCurrentIndex(0);

  // ✅ Open crop modal for first image
  setCropImage(URL.createObjectURL(files[0]));

  // Reset input
  e.target.value = "";
}}
                />

                {uploading && (
                  <div
                    className="absolute inset-0  bg-white/80
                        flex flex-col items-center justify-center rounded-[14px]z-10 "
                  >
                    {/* Spinner */}
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-green border-t-transparent" />
                    <p className="mt-3 text-xs text-[#595B5E]">
                      Uploading image...
                    </p>
                  </div>
                )}
                {!uploading && (
                  <>
                    {/* ICON */}
                    <MdCloudUpload
                      size={40}
                      className="text-[#D0D0D1] mb-[15px]"
                    />

                    <p className="text-xs text-[#595B5E] mb-[10px]">
                      Drop your image here, or
                      <span className="text-green font-medium underline">
                        Browse
                      </span>
                    </p>

                    <p className="text-[10px] text-[#A0A1A3]">
                      Only JPEG, and PNG file with max size of 5 MB
                    </p>
                  </>
                )}
              </div>
              {errors.image_urls && (
                <p className="text-xs text-red-500 mt-2">{errors.image_urls}</p>
              )}
            </div>
            {cropImage && cropQueue.length > 0 && (
            <ImageCropGallry
              open
              image={cropImage}
              aspect={1}
              outputWidth={340}
              outputHeight={220}
              isLast={currentIndex === cropQueue.length - 1}

              onClose={() => {
                setCropImage(null);
                setCropQueue([]);
                setCurrentIndex(0);
              }}

              onNext={async (croppedFile: File) => {
                try {
                  setUploading(true);

                  // ✅ Upload Cropped File
                  const formData = new FormData();
                  formData.append("images[]", croppedFile);
                  formData.append("type", "category");

                  const res = await adminUploadService.uploadImage(formData);

                  const url = res.data.images[0].url;

                  // ✅ Save URL in Formik
                  setFieldValue("image_urls", (prev: string[]) => [...prev, url]);

                  // ✅ Preview UI
                  setImages((prev) => [...prev, croppedFile]);

                  // ✅ Move to Next Image
                  const nextIndex = currentIndex + 1;

                  if (nextIndex < cropQueue.length) {
                    setCurrentIndex(nextIndex);
                    setCropImage(URL.createObjectURL(cropQueue[nextIndex]));
                  } else {
                    // ✅ All Crops Done
                    setCropImage(null);
                    setCropQueue([]);
                    setCurrentIndex(0);
                  }
                } finally {
                  setUploading(false);
                }
              }}
            />
                )}
            <div className="flex gap-4 flex-wrap">
              {/* EXISTING IMAGES (EDIT MODE) */}
              {values.image_urls?.length > 0 && (
                <UrlPreview
                  urls={values.image_urls}
                  onRemove={(i) => {
                    const updated = values.image_urls.filter(
                      (_, idx) => idx !== i
                    );
                    setFieldValue("image_urls", updated);
                  }}
                />
              )}
            </div>
          </div>
          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-5">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-[18px] py-3 border rounded-[10px] text-seclightgray text-sm border-border cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                px-[18px] py-3 rounded-[10px] text-white text-sm
                gradient-btn
                ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}
              `}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2 cursor-pointer">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {isEdit ? "Updating..." : "Adding..."}
                </span>
              ) : isEdit ? (
                "Update Category"
              ) : (
                "Add Category"
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
