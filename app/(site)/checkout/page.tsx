"use client";

import React, { useEffect, useState } from "react";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { Formik, Form, Field, FormikErrors, FormikTouched } from "formik";
import * as Yup from "yup";
import { usePathname, useRouter } from "next/navigation";
import { Category } from "@/api/data";
import { SingleMachinery } from "@/types/apiType";
import {
  getAllCategories,
  getMakes,
  getModels,
  getSingleInventory,
  userCheckout,
} from "@/api/categoryActions";
import toast from "react-hot-toast";
import Image from "next/image";
import Loader from "@/components/common/Loader";
import { calculateDistanceApi } from "@/api/calculateDistance";
import { formatPrice } from "@/hooks/formate";
import { getUserDetails, UserDetails } from "@/api/user/profile";

/* ============================= */
/* Types */
/* ============================= */
interface CheckoutFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  shippingDifferent: "yes" | "no";

  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
}

interface InputFieldProps {
  label: string;
  name: keyof CheckoutFormValues;
  errors?: FormikErrors<CheckoutFormValues>;
  touched?: FormikTouched<CheckoutFormValues>;
  optional?: boolean;
   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  errors,
  touched,
  optional,
  onChange,
}) => {
  const hasError = Boolean(errors?.[name] && touched?.[name]);

  return (
    <div>
      <label className="block text-[13px] font-medium text-gray-600 mb-1">
        {label}{" "}
        {optional && (
          <span className="text-gray-400 text-[11px]">(Optional)</span>
        )}
      </label>

     <Field name={name}>
        {({ field }: any) => (
          <input
            {...field}
            placeholder={`Enter ${label}`}
            onChange={(e) => {
              field.onChange(e); // ✅ Formik update

              if (onChange) {
                onChange(e); // ✅ extra custom logic
              }
            }}
            className={`w-full input transition ${
              hasError
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300"
            }`}
          />
        )}
      </Field>

      {hasError && (
        <p className="text-red-500 text-xs mt-1">{errors?.[name] as string}</p>
      )}
    </div>
  );
};

export default function CheckOutPage() {
  const CheckoutSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    phone: Yup.string().required("Phone is required"),
    company: Yup.string().notRequired(),
    street: Yup.string().required("Street is required"),
    city: Yup.string().required("City is required"),
    zip: Yup.string().required("ZIP is required"),
    country: Yup.string().required("Country is required"),

    shippingStreet: Yup.string().when("shippingDifferent", {
      is: "yes",
      then: (schema) => schema.required("Shipping street is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    shippingCity: Yup.string().when("shippingDifferent", {
      is: "yes",
      then: (schema) => schema.required("Shipping city is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    shippingZip: Yup.string().when("shippingDifferent", {
      is: "yes",
      then: (schema) => schema.required("Shipping ZIP is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    shippingCountry: Yup.string().when("shippingDifferent", {
      is: "yes",
      then: (schema) => schema.required("Shipping country is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const categorySlug = segments[1] ?? "";
  const makeSlug = segments[2] ?? "";
  const modelSlug = segments[3] ?? "";
  const auction_id = segments[4] ?? "";

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const [categories, setCategories] = useState<Category[]>([]);
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [product, setProduct] = useState<SingleMachinery | null>(null);
  const [distanceMiles, setDistanceMiles] = useState<number | null>(null);
  const [deliveryCost, setDeliveryCost] = useState<number | null>(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [zipToUse, setZipToUse] = useState("");
  const [countryToUse, setCountryToUse] = useState("");
  const [deliveryError, setDeliveryError] = useState<string | null>(null);
  const [deliveryTouched, setDeliveryTouched] = useState(false);
  const [userData, setUserData] = useState<UserDetails | null>(null);
const [userLoading, setUserLoading] = useState(true);
const [submitLoading, setSubmitLoading] = useState(false);

 const initialValues: CheckoutFormValues = {
  firstName: userData?.first_name || "",
  lastName: userData?.last_name || "",
  phone: userData?.phone_no || "",
  company: userData?.company_name || "",
  street: userData?.address || "",
  city: userData?.city || "",
  state: userData?.state || "",
  zip: userData?.zip_code || "",
  country: "USA",

  shippingDifferent: "no",

  shippingStreet: "",
  shippingCity: "",
  shippingState: "",
  shippingZip: "",
  shippingCountry: "",
};

useEffect(() => {
  const fetchUserDetails = async () => {
    try {
      setUserLoading(true);

      const res = await getUserDetails();

      if (res.status) {
        setUserData(res.data);
      } else {
        toast.error(res.message || "Failed to fetch user details");
      }
    } catch (error) {
      toast.error("Something went wrong while fetching user details");
    } finally {
      setUserLoading(false);
    }
  };

  fetchUserDetails();
}, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const catRes = await getAllCategories();
        if (catRes?.success) setCategories(catRes.data);

        const makeRes = await getMakes();
        if (makeRes?.success) setMakes(makeRes.data);

        const modelRes = await getModels();
        if (modelRes?.success) setModels(modelRes.data);
      } catch (err) {
        toast.error("Failed to load dropdown data");
      }
    };

    loadData();
  }, []);

useEffect(() => {
  if (!userData) return;

  const zip = userData.zip_code;
  const country = "USA"; 

  if (zip && country) {
    setZipToUse(zip);
    setCountryToUse(country);
    setDeliveryTouched(true);
  }
}, [userData]);

  const matchedCategory = categories.find(
    (c) => slugify(c.category_name) === categorySlug,
  );

  const matchedMake = makes.find((m) => slugify(m) === makeSlug);
  const matchedModel = models.find((m) => slugify(m) === modelSlug);

  useEffect(() => {
    if (!matchedCategory || !matchedMake || !matchedModel || !auction_id) return;

    const fetchProduct = async () => {
      setPageLoading(true);

      try {
        const res = await getSingleInventory({
          category: matchedCategory.category_name,
          make: matchedMake,
          model: matchedModel,
          auction_id: auction_id,
        });
        if (res?.success) {
          setProduct(res.data);
        }
      } catch (err: any) {
        toast.error(err?.message || "Product fetch failed");
      } finally {
        setPageLoading(false);
      }
    };

    fetchProduct();
  }, [matchedCategory, matchedMake, matchedModel, auction_id]);

const calculateDeliveryCost = async (zip: string, country: string) => {
  if (!zip || !country) return;

  try {
    setCalcLoading(true);
    setDeliveryError(null);

    const res = await calculateDistanceApi({
      zip_code: zip,
      country,
    });
    if (res.status === "success") {
      setDistanceMiles(res.distance_miles);
      setDeliveryCost(res.total_cost);
    } else {
      setDeliveryCost(null);
      setDeliveryError(res.message || "Delivery calculation failed");
    }
  } catch (err: any) {
    setDeliveryCost(null);
    setDeliveryError(err?.message || "Delivery calculation failed");
  } finally {
    setCalcLoading(false);
  }
};

useEffect(() => {
  if (!zipToUse || !countryToUse) return;

  setDeliveryTouched(true); 

  const timer = setTimeout(() => {
    calculateDeliveryCost(zipToUse, countryToUse);
  }, 700);

  return () => clearTimeout(timer);
}, [zipToUse, countryToUse]);

 const handleCheckoutSubmit = async (values: CheckoutFormValues) => {
  if (!product?.id) return toast.error("Product not found");

  try {
    setSubmitLoading(true);

    const payload = {
      machinery_id: product.id,
      first_name: values.firstName,
      last_name: values.lastName,
      phone_number: values.phone,
      billing_details: {
        legal_company_name: values.company,
        street_and_number: values.street,
        city: values.city,
        state_province: values.state,
        zip_postal_code: values.zip,
        country: values.country,
      },
      shipping_details:
        values.shippingDifferent === "yes"
          ? {
              is_different: true,
              shipping_street: values.shippingStreet,
              shipping_city: values.shippingCity,
              shipping_state: values.shippingState,
              shipping_zip: values.shippingZip,
              shipping_country: values.shippingCountry,
            }
          : { is_different: false },
    };

    localStorage.setItem("checkoutData", JSON.stringify(payload));

    toast.success("Proceeding to sale agreement…");

   router.push(
      `/sale-agreement/${categorySlug}/${makeSlug}/${modelSlug}/${auction_id}`
    );
  } finally {
    setSubmitLoading(false);
  }
};

  const DeliveryCostBox = () => (
  <div className="mt-5 p-4 rounded-xl border bg-gray-50 border-border">
    <p className="text-sm font-semibold text-gray-700">
      Delivery Cost Estimation
    </p>

    {calcLoading ? (
      <p className="text-sm text-gray-500 mt-2">
        Calculating delivery cost...
      </p>
    ) : deliveryCost !== null ? (
      <>
        <p className="text-green font-bold text-xl mt-2">
      {formatPrice(deliveryCost)}
        </p>

        {distanceMiles && (
          <p className="text-gray-500 text-sm">
            Distance: {distanceMiles} miles
          </p>
        )}
      </>
    ) : deliveryError ? (
      <p className="text-red-500 text-sm mt-2">
        {deliveryError}
      </p>
    ) : (
      <p className="text-gray-400 text-sm mt-2">
        Enter ZIP & Country to calculate delivery cost
      </p>
    )}
  </div>
);

const shouldDisableButton = Boolean(
  deliveryTouched &&
    (calcLoading || deliveryCost === null || deliveryError)
);
const getFirstValidImage = (images: any[]) => {
  if (!Array.isArray(images)) return null;

  for (let i = 0; i < images.length; i++) {
    if (images[i]?.full_url) {
      return images[i].full_url;
    }
  }

  return null;
};
const productImage =
  product?.images && product.images.length > 0
    ? getFirstValidImage(product.images)
    : null;

if (userLoading || pageLoading) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
      <Loader />
    </div>
  );
}
  return (
    <section className="pt-20">
      <div className="max-w-5xl mx-auto px-4 space-y-10">
        {product && (
          <div className="bg-white border border-border rounded-xl p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">
              Buy-Now Request
            </h2>

            <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-[320px] flex-shrink-0">
              <div className="relative w-full aspect-[4/3] md:aspect-[16/10] rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={productImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

              <div className="flex-1 space-y-2 w-full">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <p className="text-gray-500 text-sm">
                    {product.category?.category_name}
                  </p>

                  <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <TbRosetteDiscountCheckFilled size={18} />
                    Inspected
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 text-lg">
                  {product.name}
                </h3>

                <p className="text-gray-500 text-sm">
                  {product.year} • {product.weight} lbs •{" "}
                  {product.working_hours} hrs
                </p>

                <p className="text-sm text-gray-600">
                  <strong>Auction ID:</strong> {product.auction_id}
                </p>

                <p className="text-green-600 font-bold text-base sm:text-lg mt-2">
                  Buy Now: ${product.buy_now_price}
                </p>
              </div>
            </div>
          </div>
        )}

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={CheckoutSchema}
          onSubmit={handleCheckoutSubmit}
        >
          {({ errors, touched, values ,setFieldValue  }) => (
            <Form className="bg-white border border-border rounded-xl p-6 space-y-10">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="First name"
                  name="firstName"
                  errors={errors}
                  touched={touched}
                />
                <InputField
                  label="Last name"
                  name="lastName"
                  errors={errors}
                  touched={touched}
                />
                <InputField
                  label="Phone number"
                  name="phone"
                  errors={errors}
                  touched={touched}
                />
              </div>

              <hr className="border-gray-200" />

              <div className="space-y-6">
                <h3 className="text-md font-semibold text-gray-700">
                  Billing details
                </h3>

                <InputField
                  label="Legal Company Name"
                  name="company"
                  errors={errors}
                  touched={touched}
                  optional
                />

                <InputField
                  label="Street and number"
                  name="street"
                  errors={errors}
                  touched={touched}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="City"
                    name="city"
                    errors={errors}
                    touched={touched}
                  />
                  <InputField
                    label="State / Province / Region"
                    name="state"
                    optional
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <InputField
  label="ZIP/Postal Code"
  name="zip"
  errors={errors}
  touched={touched}
  onChange={(e) => {
    const zip = e.target.value;

    setFieldValue("zip", zip);

    if (values.shippingDifferent === "no") {
      setZipToUse(zip);
      setCountryToUse(values.country);
    }
  }}
/>

                  {/* Country */}
                  <div>
                    <label className="block text-[13px] font-medium text-gray-600 mb-1">
                      Country
                    </label>

                   <Field
  as="select"
  name="country"
  className="w-full input bg-white"
  onChange={(e: any) => {
    const country = e.target.value;

    setFieldValue("country", country);

    if (values.shippingDifferent === "no") {
      setZipToUse(values.zip);
      setCountryToUse(country);
    }
  }}
>
                      <option value="">Select Country</option>
                      <option value="CANADA">CANADA</option>
                      <option value="USA">USA</option>
                    </Field>

                    {errors.country && touched.country && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>
              </div>
{values.shippingDifferent === "no" && <DeliveryCostBox />}

              <hr className="border-gray-200" />

              {/* Shipping */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold text-gray-700">
                  Shipping details
                </h3>

                <p className="text-sm text-gray-500">
                  Is your shipping address different from your billing address?
                </p>

                {/* Exact Screenshot Radio Style */}
                <div className="flex gap-4">
                  {/* NO Option */}
                  <label
                    className="flex items-center justify-between w-[90px]
      border border-gray-300 rounded-md px-4 py-2 cursor-pointer
      text-sm font-medium text-gray-700"
                  >
                    No
                 <Field
    type="radio"
    name="shippingDifferent"
    value="no"
    onChange={() => {
      setFieldValue("shippingDifferent", "no");

     setDeliveryCost(null);
    setDeliveryError(null);
    setDeliveryTouched(false);

    setZipToUse(values.zip);
    setCountryToUse(values.country);
    }} 
      className="w-4 h-4 accent-black"
  />
                  </label>

                  {/* YES Option */}
                  <label
                    className="flex items-center justify-between w-[90px]
      border border-gray-300 rounded-md px-4 py-2 cursor-pointer
      text-sm font-medium text-gray-700"
                  >
                    Yes
                   <Field
    type="radio"
    name="shippingDifferent"
    value="yes"
    onChange={() => {
      setFieldValue("shippingDifferent", "yes");

      setDeliveryCost(null);
      setDeliveryError(null);
       setDeliveryTouched(false); 

    setZipToUse("");
    setCountryToUse("");
    }}
     className="w-4 h-4 accent-black"
  />
                  </label>
                </div>
              </div>

              {values.shippingDifferent === "yes" && (
                <div className="space-y-6 border-t border-border pt-6">
                  <h3 className="text-md font-semibold text-gray-700">
                    Shipping Address
                  </h3>

                  <InputField
                    label="Shipping Street"
                    name="shippingStreet"
                    errors={errors}
                    touched={touched}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Shipping City"
                      name="shippingCity"
                      errors={errors}
                      touched={touched}
                    />

                    <InputField
                      label="Shipping State"
                      name="shippingState"
                      optional
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <InputField
                label="Shipping ZIP"
                name="shippingZip"
                errors={errors}
                touched={touched}
                onChange={(e) => {
                  const zip = e.target.value;

                  setFieldValue("shippingZip", zip);

                  setZipToUse(zip);
                  setCountryToUse(values.shippingCountry);
                }}
              />
                    <div>
  <label className="block text-[13px] font-medium text-gray-600 mb-1">
    Shipping Country
  </label>

  <Field
    as="select"
    name="shippingCountry"
    className="w-full input bg-white"
    onChange={(e: any) => {
      const country = e.target.value;

      // ✅ Formik Update
      setFieldValue("shippingCountry", country);

      // ✅ Delivery Calculation Trigger
      setZipToUse(values.shippingZip);
      setCountryToUse(country);
    }}
  >
    <option value="">Select Country</option>
    <option value="CANADA">CANADA</option>
    <option value="USA">USA</option>
  </Field>

  {errors.shippingCountry && touched.shippingCountry && (
    <p className="text-red-500 text-xs mt-1">
      {errors.shippingCountry}
    </p>
  )}
</div>

                  </div>
                </div>
              )}
{values.shippingDifferent === "yes" && <DeliveryCostBox />}
              {/* Button */}
         <button
              type="submit"
              disabled={shouldDisableButton || submitLoading}
              className={`w-full py-3 rounded-lg font-medium transition
                flex items-center justify-center gap-2 cursor-pointer
                active:scale-95
                ${
                  shouldDisableButton || submitLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green text-white hover:bg-lightblack"
                }
              `}
            >
              {submitLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : calcLoading ? (
                "Calculating Delivery..."
              ) : (
                "Continue Checkout"
              )}
            </button>

            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
}
