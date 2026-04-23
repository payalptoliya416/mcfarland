"use client";

import { Formik, Form, Field, useFormikContext } from "formik";
import * as Yup from "yup";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MdCloudUpload } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useRouter, useSearchParams } from "next/navigation";
import { adminUploadService } from "@/api/admin/upload";
import AutoBidStartPrice from "@/adminpanel/AutoBidStartPrice";
import { adminCategoryService } from "@/api/admin/category";
import toast from "react-hot-toast";
import { adminMachineryService } from "@/api/admin/machinery";
import Loader from "@/components/common/Loader";
import QuillEditor from "./QuillEditor";

export const dynamic = "force-dynamic";
interface SectionProps {
  title: string;
  children: React.ReactNode;
}
interface GridProps {
  cols?: 1 | 2 | 3;
  children: React.ReactNode;
  template?: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  suffix?: string;
  disabled?: boolean;
  requiredMark?: boolean; 
}
interface UploadBoxProps {
  label: string;
  refInput: React.RefObject<HTMLInputElement | null>;
  accept: string;
  maxSizeMB?: number | any;
    fileType: "image" | "video";   // 👈 NEW
  onChange: (files: File[]) => void;
   loading?: boolean;   
     multiple?: boolean;
       error?: boolean;
}

interface PreviewProps {
  files: File[];
  isVideo?: boolean;
  onRemove?: (index: number) => void;
}

interface SelectProps {
  label: string;
  name: string;
  options: { label: string; value: string | number }[];
  placeholder?: string;
   requiredMark?: boolean;
}
/* ================= VALIDATION ================= */
const schema = Yup.object({
  make: Yup.string().required("Make is required"),
  model: Yup.string().required("Model is required"),
  category: Yup.string().required("Category is required"),

  offerText: Yup.number()
  .transform((val, orig) => (orig === "" ? undefined : val))
  .typeError("Offer must be a number")
  .required("Offer number is required")
  .integer("Offer must be a whole number"),

  year: Yup.string().required("Year is required"),

  weight: Yup.number()
    .transform((val, orig) => (orig === "" ? undefined : val))
    .typeError("Enter valid weight")
    .required("Weight required"),

 workingHours: Yup.number()
  .typeError("Enter valid working hours")
  .integer("Working hours must be a whole number")
  .min(0, "Working hours cannot be negative")
  .required("Working hours required"),

  fuelType: Yup.string().required("Fuel type required"),

  condition: Yup.string().required("Condition required"),

  serialNumber: Yup.string().required("Serial number required"),

buyNowPrice: Yup.number()
  .transform((val, orig) => (orig === "" ? undefined : val))
  .typeError("Enter valid buy now price")
  .required("Buy now price is required"),

  bidStartPrice: Yup.number()
  .typeError("Enter valid bid start price")
  .required("Bid start price is required"),

bid_end_days: Yup.string().required("Bid duration is required"),
description: Yup.string()
    .trim()
    .required("Description is required"),  
   image_urls: Yup.array()
    .min(1, "At least one image is required"),
    status: Yup.string().required("Status is required"),
});


export default function AddMachineClient() {
  const router = useRouter();
  const [videos, setVideos] = useState<File[]>([]);
  // const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLInputElement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: number }[]>([]);
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEdit = Boolean(editId);
   const getRandomOffer = () => {
  return Math.floor(Math.random() * 10) + 1; // 1 to 10
};
  const DEFAULT_VALUES = {
    make: "",
    model: "",
    category: "",
    offerText: getRandomOffer(),
    year: "",
    weight: "",
    workingHours: "",
    fuelType: "",
    condition: "",
    serialNumber: "",
    buyNowPrice: "",
    bidStartPrice: "",
    bid_end_days: "7",
    description: "",
    image_urls: [],
    video_urls: [],
    specKey: "",
    specValue: "",
    status: "1",
  };
  const [initialValues, setInitialValues] = useState(DEFAULT_VALUES);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH FOR EDIT ================= */
  useEffect(() => {
    if (!isEdit) return;

    const fetchMachinery = async () => {
      try {
        setLoading(true);

        const res = await adminMachineryService.show(Number(editId));
        const m = res.data;
        setInitialValues({
          make: m?.make,
          model: m.model,
          category: m.category_id?.toString(),
          year: m.year,
          weight: m.weight,
          workingHours: m.working_hours,
          fuelType: m.fuel,
          condition: m.condition,
          serialNumber: m.serial_number,
          buyNowPrice: m.buy_now_price,
          bidStartPrice: m.bid_start_price,
           bid_end_days: String(m.bid_end_days || "7"),
          offerText: Number(m.offer) || 1,
          description: m.description || "", 
          image_urls: m.image_urls || [],
          video_urls: Array.isArray(m.video_urls)
            ? m.video_urls
            : m.video_urls
            ? [m.video_urls]
            : [],
          specKey: "",
          specValue: "",
          status: String(m.status ?? 1),
        });
      } catch {
        toast.error("Failed to load machinery");
        router.push("/admin/machinery");
      } finally {
        setLoading(false);
      }
    };

    fetchMachinery();
  }, [isEdit, editId]);
  
    const fetchAllCategories = async () => {
      try {
        const res = await adminCategoryService.getAllCategories();  
        const options = res.data.map((item) => ({
          label: item.category_name,
          value: item.id,
        }));

        setCategoryOptions(options);
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      fetchAllCategories();
    }, []);


const handleImageUpload = async (
  files: File[],
  setFieldValue: any
) => {
  try {
    setImageLoading(true);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images[]", file);
    });
    formData.append("type", "machinery");

    const res = await adminUploadService.uploadImage(formData);
    const urls = res.data.images.map((img) => img.url);
    setFieldValue("image_urls", (prev: string[]) => [...prev, ...urls]);
    setImages((prev) => [...prev, ...files]);
  } finally {
    setImageLoading(false);
  }
};

const handleVideoUpload = async (
  files: File[],
  setFieldValue: any,
  values: any
) => {
  if (!files || files.length === 0) return;

  try {
    setVideoLoading(true);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("videos[]", file);
    });
    formData.append("type", "machinery");

    const res = await adminUploadService.uploadVideo(formData);

    const uploadedVideos = Array.isArray(res.data.videos)
      ? res.data.videos
      : [res.data.videos];

    const urls = uploadedVideos.map((v: any) => v.url);

    // ✅ Formik
    setFieldValue("video_urls", [
      ...(values.video_urls || []),
      ...urls,
    ]);

    // ✅ UI preview
    setVideos((prev) => [...prev, ...files]);
  } finally {
    setVideoLoading(false);
  }
};

 const mapMachineryPayload = (values: any) => {
  return {
    category_id: Number(values.category),

    make: values.make,
    model: values.model,
    year: values.year,

    weight: values.weight,
    working_hours: String(values.workingHours),

    condition: values.condition,
    fuel: values.fuelType,

    serial_number: values.serialNumber,

    buy_now_price: Number(values.buyNowPrice),
    bid_start_price: Number(values.bidStartPrice),
    bid_end_days: Number(values.bid_end_days),
    description: values.description,

    offer: values.offerText,

    image_urls: values.image_urls,

    video_urls: values.video_urls,

     status: Number(values.status),
  };
};

const handleSubmit = async (values: any) => {
  if (submitting) return;

  try {
    setSubmitting(true);

    const payload = mapMachineryPayload(values);
    let res;

    if (isEdit && editId) {
      res = await adminMachineryService.update(editId, payload);
    } else {
      res = await adminMachineryService.store(payload);
    }

    if (res?.status) {
      toast.success(res.message || "Machinery saved successfully");
      router.push("/admin/machinery");
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to save machinery");
  } finally {
    setSubmitting(false);
  }
};
if (isEdit && loading) {
    return <div className="flex justify-center items-center h-full"><Loader /></div>;
  }
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      enableReinitialize   
      onSubmit={handleSubmit}
    >
      {({ errors, touched, setFieldValue, values }) => (
        <Form className="space-y-10">

          {/* ================= BASIC INFO ================= */}
          <div className="bg-white border border-border rounded-[14px] p-3 sm:p-5 space-y-5">
          <Section title="Basic Information">
            <Grid cols={2}>
              <Input name="make" label="Make" placeholder="Enter make"  requiredMark/>
              <Input name="model" label="Model" placeholder="Enter model"  requiredMark />
              <Select name="category" label="Category" placeholder="Select category" options={categoryOptions} requiredMark/>
              <Input name="offerText" label="Offer Text" placeholder="Enter bid offer received text" requiredMark type="number" onKeyDown={(e) => {
                if (["e", "E", "+", "-", "."].includes(e.key)) {
                  e.preventDefault();
                }
              }}  />
              {!isEdit && (
              <Select
                name="status"
                label="Status"
                options={[
                  { label: "Draft", value: "0" },
                  { label: "Publish", value: "1" },
                ]}
                requiredMark
              />
            )}
            </Grid>
          </Section>

          {/* ================= UPLOAD ================= */}
         <Section title="Images & Videos">
            <Grid cols={2}>

              {/* IMAGE UPLOAD */}
              <div className="space-y-4">
              <UploadBox
            label="Drop your image here"
            refInput={imageRef}
            accept="image/png,image/jpeg,image/webp"
            fileType="image"
            error={!!(errors.image_urls && touched.image_urls)}
            loading={imageLoading}
            onChange={(files) =>
              handleImageUpload(files, setFieldValue)
            }
          // onChange={(files) => {
          //   if (!files.length) return;

          //   // ✅ Save all files in queue
          //   setCropQueue(files);

          //   // ✅ Start from first image
          //   setCurrentCropIndex(0);

          //   // ✅ Open crop modal for first image
          //   setCropImage(URL.createObjectURL(files[0]));
          // }}
          />
         {/* {cropImage && cropQueue.length > 0 && (
  <ImageCropGallry
    open
    image={cropImage}
    aspect={1}
    outputWidth={240}
    outputHeight={165}
    isLast={currentCropIndex === cropQueue.length - 1}

    onClose={() => {
      setCropImage(null);
      setCropQueue([]);
      setCurrentCropIndex(0);
    }}

    onNext={async (croppedFile: File) => {
      // ✅ Upload cropped file
      await handleImageUpload([croppedFile], setFieldValue);

      // ✅ Move to next image
      const nextIndex = currentCropIndex + 1;

      if (nextIndex < cropQueue.length) {
        setCurrentCropIndex(nextIndex);

        // Open next crop modal
        setCropImage(
          URL.createObjectURL(cropQueue[nextIndex])
        );
      } else {
        // ✅ Done all images
        setCropImage(null);
        setCropQueue([]);
        setCurrentCropIndex(0);
      }
    }}
  />
          )} */}

                {/* IMAGE PREVIEW — JUST BELOW IMAGE UPLOAD */}
              {isEdit ? (
            <UrlPreview
              urls={values.image_urls}
              onRemove={(i) => {
                const updated = values.image_urls.filter((_, idx) => idx !== i);
                setFieldValue("image_urls", updated);
              }}
            />
          ) : (
            <Preview
              files={images}
              onRemove={(i) => {
                const updated = images.filter((_, idx) => idx !== i);
                setImages(updated);
                setFieldValue("image_urls", updated);
              }}
            />
          )}

          {errors.image_urls && touched.image_urls && (
            <p className="text-xs text-red-500">
              {errors.image_urls as string}
            </p>
          )}
              </div>

              {/* VIDEO UPLOAD */}
              <div className="space-y-4">
            <UploadBox
            label="Drop your video here"
            refInput={videoRef}
            multiple
              accept="video/mp4,video/quicktime,video/x-matroska"
            fileType="video"
            loading={videoLoading}
            onChange={(files) =>
              handleVideoUpload(files, setFieldValue, values)
            }
          />
                {/* VIDEO PREVIEW — JUST BELOW VIDEO UPLOAD */}
              {isEdit ? (
            <UrlPreview
              urls={values.video_urls}
              isVideo
              onRemove={(i) => {
                const updated = values.video_urls.filter((_, idx) => idx !== i);
                setFieldValue("video_urls", updated);
              }}
            />
          ) : (
            <Preview
              files={videos}
              isVideo
              onRemove={(i) => {
                setVideos(videos.filter((_, idx) => idx !== i));
                setFieldValue(
                  "video_urls",
                  values.video_urls.filter((_: any, idx: number) => idx !== i)
                );
              }}
            />
          )}
              </div>

            </Grid>
          </Section>
          </div>

          {/* ================= DETAILS ================= */}
          <div className="bg-white border border-border rounded-[14px] p-3 sm:p-5">
         <Section title="Machine Details">
        <Grid cols={3}>

            {/* YEAR */}
            <Select
            name="year"
            label="Year"
            placeholder="Select year"
            options={years}
            requiredMark
            />

            {/* WEIGHT */}
            <Input
            name="weight"
            label="Weight"
            placeholder="Enter weight"
            suffix="LBS"
            requiredMark
            />

          <Input
          name="workingHours"
          label="Working Hours"
          placeholder="Enter working hours"
          type="number"
          requiredMark
        />

            {/* FUEL TYPE */}
            <Select
            name="fuelType"
            label="Fuel Type"
            placeholder="Select fuel type"
            options={fuelTypes}
            requiredMark
            />

            {/* CONDITION */}
            <Select
            name="condition"
            label="Condition"
            placeholder="Select condition"
            options={conditions}
            requiredMark
            />

            {/* SERIAL NUMBER */}
            <Input
            name="serialNumber"
            label="Serial Number"
            placeholder="Enter serial number"
            requiredMark
            />
         <AutoBidStartPrice />
            {/* BUY NOW PRICE */}
            <Input
            name="buyNowPrice"
            label="Buy Now Price"
            placeholder="Select buy now price"
            requiredMark
            />

            {/* BID START PRICE */}
            <Input
            name="bidStartPrice"
            label="Bid Start Price"
            placeholder="Enter bid start price"
            disabled
            requiredMark
            />

            {/* BID END TIME */}
        <Select
  name="bid_end_days"
  label="Auction Duration"
  placeholder="Select Days"
  options={[
    { label: "1 Days", value: "1" },
    { label: "2 Days", value: "2" },
    { label: "3 Days", value: "3" },
    { label: "4 Days", value: "4" },
    { label: "5 Days", value: "5" },
    { label: "7 Days", value: "7" },
  ]}
  requiredMark
/>

        </Grid>
        <Grid cols={3}>
        <div className="flex flex-col mt-6 lg:col-span-full">
          <label className="block mb-3 text-sm font-medium text-lightblack">
            Description  
          <sup className="text-redmark">*</sup>
          </label>

          {/* <Field
          as="textarea"
          name="description"
          rows={4}
          placeholder="Enter description here..."
          className={`input w-full ${
            errors.description && touched.description ? "border-red-500" : ""
          }`}
        /> */}
 <QuillEditor name="description" />
        {/* Error Message */}
        {/* {errors.description && touched.description && (
          <p className="text-xs text-red-500 mt-1">
            {errors.description}
          </p>
        )} */}

        </div>
      </Grid>

        </Section>
          </div>

                {/* ================= ACTIONS ================= */}
        {/* </div> */}
              <div className="flex justify-end gap-5">
                      <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-[18px] py-3 border rounded-[10px] text-seclightgray text-sm border-border cursor-pointer bg-white"
                      >
                        Cancel
                      </button>
                     <button
                type="submit"
                disabled={submitting}
                className={`
                  px-[18px] py-3 rounded-[10px] text-sm text-white
                  gradient-btn
                  ${submitting ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                {submitting && (
                  <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}

                {submitting
                  ? isEdit
                    ? "Updating..."
                    : "Adding..."
                  : isEdit
                  ? "Update Machinery"
                  : "Add Machinery"}
              </button>

              </div>
        </Form>
      )}
    </Formik>
  );
}

/* ================= REUSABLE UI ================= */

const Section = ({ title, children }: SectionProps) => (
  <div>
    {children}
  </div>
);

const Grid = ({ cols = 1, template, children }: GridProps) => (
  <div
    className={`grid gap-4 lg:gap-6 items-start ${
      template
        ? "grid-cols-1 lg:grid-cols-[var(--template)]"
        : cols === 2
        ? "grid-cols-1 lg:grid-cols-2"
        : "grid-cols-1 lg:grid-cols-3"
    }`}
    style={
      template
        ? ({
            "--template": template,
          } as React.CSSProperties)
        : undefined
    }
  >
    {children}
  </div>
);
const GridVI = ({ cols = 1, template, children }: GridProps) => (
  <div
    className={`grid gap-4 lg:gap-6 items-center ${
      template
        ? "grid-cols-1 lg:grid-cols-[var(--template)]"
        : cols === 2
        ? "grid-cols-1 lg:grid-cols-2"
        : "grid-cols-1 lg:grid-cols-3"
    }`}
    style={
      template
        ? ({
            "--template": template,
          } as React.CSSProperties)
        : undefined
    }
  >
    {children}
  </div>
);

const Input = ({ label, name, suffix,requiredMark , ...props }: InputProps) => {
  const { errors, touched } = useFormikContext<any>();

  return (
    <div>
      <label className="block mb-3 text-sm font-medium text-lightblack">
        {label}
           {requiredMark && (
          <sup className="text-redmark">*</sup>
        )}
      </label>

      <div className="relative">
        <Field
          name={name}
          {...props}
          className={`input w-full ${
            errors[name] && touched[name] ? "border-red-500" : ""
          }`}
        />

        {suffix && (
          <span className="absolute right-4 top-[21px] text-xs">{suffix}</span>
        )}
      </div>

      {errors[name] && touched[name] && (
        <p className="mt-1 text-xs text-red-500">
          {errors[name] as string}
        </p>
      )}
    </div>
  );
};


const years = Array.from({ length: 30 }, (_, i) => {
  const y = new Date().getFullYear() - i;
  return { label: y.toString(), value: y };
});

const fuelTypes = [
  { label: "Diesel", value: "diesel" },
  { label: "Petrol", value: "petrol" },
  { label: "Electric", value: "electric" },
];

const conditions = [
  { label: "Excellent", value: "excellent" },
  { label: "Very Good", value: "very-good" },
  { label: "Good", value: "good" },
  { label: "Fair", value: "fair" },
];

const Select = ({ label, name, options, placeholder,requiredMark }: SelectProps) => {
  const { errors, touched } = useFormikContext<any>();

  return (
    <div>
      <label className="block mb-3 text-sm font-medium text-lightblack">
        {label}
           {requiredMark && (
          <sup className="text-redmark">*</sup>
        )}
      </label>

      <div className="relative">
        <Field
          as="select"
          name={name}
          className={`input w-full bg-white pr-10 appearance-none ${
            errors[name] && touched[name] ? "border-red-500" : ""
          }`}
        >
          <option value="">{placeholder || "Select"}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Field>

        <svg
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {errors[name] && touched[name] && (
        <p className="mt-1 text-xs text-red-500">
          {errors[name] as string}
        </p>
      )}
    </div>
  );
};

const UploadBox = ({
  label,
  refInput,
  accept,
  maxSizeMB = 60,
  fileType,
  loading = false,
  onChange,
  error,
}: UploadBoxProps) => (
    <div
    className={`border p-[10px] rounded-[10px]
      ${error ? "border-red-500" : "border-border"}
    `}
  >
    <div
      className={`  relative  border-2 border-dashed border-border rounded-[14px]
        p-8 flex flex-col items-center justify-center text-center
        bg-[#F9F9F9]  min-h-[150px] transition
        ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:border-[#FFCE67]"}
      `}
      onClick={() => {
        if (!loading) refInput.current?.click();
      }}
    >
      <input
  ref={refInput}
  type="file"
  hidden
  multiple
  accept={accept}
  disabled={loading}
  // onChange={(e) => {
  //   if (!e.target.files || e.target.files.length === 0) return;

  //   const allowedTypes =
  //     fileType === "image"
  //       ? ["image/jpeg", "image/png"]
  //       : ["video/mp4", "video/quicktime", "video/x-matroska"];

  //   const maxSize = maxSizeMB * 1024 * 1024;

  //   const files = Array.from(e.target.files).filter(
  //     (file) =>
  //       allowedTypes.includes(file.type) &&
  //       file.size <= maxSize
  //   );

  //   if (files.length === 0) return;
  //   onChange(files);
  // }}
  onChange={(e) => {
  if (!e.target.files || e.target.files.length === 0) return;

  const allowedTypes =
    fileType === "image"
      ? ["image/jpeg", "image/png", "image/webp"]
      : ["video/mp4", "video/quicktime", "video/x-matroska"];

  const maxSize = maxSizeMB * 1024 * 1024;

  const validFiles: File[] = [];
  let hasOversize = false;
  let hasInvalidType = false;

  Array.from(e.target.files).forEach((file) => {
    if (!allowedTypes.includes(file.type)) {
      hasInvalidType = true;
      return;
    }

    if (file.size > maxSize) {
      hasOversize = true;
      return;
    }

    validFiles.push(file);
  });

  if (hasInvalidType) {
    toast.error(
      fileType === "video"
        ? "Only MP4, MOV or MKV videos are allowed"
        : "Only JPG, PNG or WEBP images are allowed"
    );
  }

  if (hasOversize) {
    toast.error(
      `${fileType === "video" ? "Video" : "Image"} size must be less than ${maxSizeMB}MB`
    );
  }

  if (validFiles.length === 0) {
    e.target.value = "";
    return;
  }

  onChange(validFiles);
  e.target.value = "";
}}
/>


      {/* 🔄 LOADER */}
      {loading ? (
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-green" />
          <p className="text-xs text-gray-500">
            Uploading {fileType}...
          </p>
        </div>
      ) : (
        <>
          <MdCloudUpload size={40} className="text-[#D0D0D1] mb-[15px]" />

          <p className="text-xs text-[#595B5E] mb-[10px]">
            {label},{" "}
            <span className="text-green font-medium underline">
              Browse
            </span>
          </p>

          {fileType === "image" ? (
            <p className="text-[10px] text-[#A0A1A3]">
              Only JPEG , PNG and WEBP files with max size of {maxSizeMB} MB
            </p>
          ) : (
            <p className="text-[10px] text-[#A0A1A3]">
              Only MP4, MOV and MKV files with max size of {maxSizeMB} MB
            </p>
          )}
        </>
      )}
    </div>
  </div>
);


const Preview = ({ files, isVideo = false, onRemove }: PreviewProps) => (
  <div className="flex gap-3 flex-wrap mt-4">
    {files.map((file, i) => {
      const previewUrl = URL.createObjectURL(file);

      return (
        <div
          key={i}
          className="relative w-[90px] h-[90px] rounded-[14px] overflow-hidden"
        >
          {/* IMAGE */}
          {!isVideo && (
            <Image
              src={previewUrl}
              alt="preview"
              fill
              className="object-cover"
            />
          )}

          {/* VIDEO THUMBNAIL */}
          {isVideo && (
            <>
              <video
                src={previewUrl}
                muted
                preload="metadata"
                className="w-full h-full object-cover"
              />

              {/* PLAY ICON OVERLAY */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                  ▶
                </div>
              </div>
            </>
          )}

          {/* REMOVE ICON */}
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow cursor-pointer"
            >
              <RxCross2 size={12} />
            </button>
          )}
        </div>
      );
    })}
  </div>
);

const UrlPreview = ({
  urls,
  isVideo = false,
  onRemove,
}: {
  urls: string[];
  isVideo?: boolean;
  onRemove?: (i: number) => void;
}) => (
  <div className="flex gap-3 flex-wrap mt-4 ">
    {urls.map((url, i) => (
      <div
        key={i}
        className="relative w-[90px] h-[90px] rounded-[14px] overflow-hidden"
      >
        {!isVideo ? (
          <Image src={url} alt="preview" fill className="object-cover" />
        ) : (
          <video src={url} className="w-full h-full object-cover" />
        )}

        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow"
          >
            <RxCross2 size={12} />
          </button>
        )}
      </div>
    ))}
  </div>
);

