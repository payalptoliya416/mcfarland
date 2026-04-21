"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getSingleWonBid, signContract, WonBid } from "@/api/user/bids";
import Loader from "@/components/common/Loader";
import toast from "react-hot-toast";
import { Formik, Form, Field, FormikErrors, FormikTouched } from "formik";
import { getUserDetails, UserDetails } from "@/api/user/profile";
import * as Yup from "yup";
import { formatPrice } from "@/hooks/formate";
import { calculateDistanceApi } from "@/api/calculateDistance";
interface CheckoutFormValues {
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
interface CheckoutFormValues {
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
              hasError ? "border-red-500 focus:ring-red-400" : "border-gray-300"
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

function SignaturePadDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [data, setData] = useState<WonBid | null>(null);
  const [loading, setLoading] = useState(true);
  const [signature, setSignature] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const [userData, setUserData] = useState<UserDetails | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [zipToUse, setZipToUse] = useState("");
  const [countryToUse, setCountryToUse] = useState("");
  const [deliveryError, setDeliveryError] = useState<string | null>(null);
  const [deliveryTouched, setDeliveryTouched] = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);
  const [distanceMiles, setDistanceMiles] = useState<number | null>(null);
  const [deliveryCost, setDeliveryCost] = useState<number | null>(null);

  const initialValues: CheckoutFormValues = {
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
  const CheckoutSchema = Yup.object().shape({
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

  const fetchBid = async () => {
    try {
      const res = await getSingleWonBid(Number(id));
      if (res?.success) {
        setData(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchBid();
  }, [id]);

  const formatCurrency = (value: string | number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(Number(value));
  };

  const dataURLtoFile = (dataUrl: string, filename: string) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const handleSendContract = async () => {
    if (!signature) {
      toast.error("Please draw and save your signature first");
      return;
    }
    if (submitting) return;
    try {
      setSubmitting(true);

      const file = dataURLtoFile(signature, "signature.png");

      const formData = new FormData();
      formData.append("machinery_id", String(id));
      formData.append("sign_photo", file);

      const res = await signContract(formData);

      if (res.success) {
        toast.success(res.message || "Contract sent successfully");
        fetchBid();
        setIsSubmitted(true);
        setSignature("");
      } else {
        toast.error(res.message || "Failed to send contract");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

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
    // if (!product?.id) return toast.error("Product not found");

    const payload = {
      machinery_id: id,

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
          : {
              is_different: false,
            },
    };

    localStorage.setItem("wonBidUserOut", JSON.stringify(payload));
    router.push(`/user/won-bids/signaturepad/agreement/?id=${id}`);
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
        <p className="text-red-500 text-sm mt-2">{deliveryError}</p>
      ) : (
        <p className="text-gray-400 text-sm mt-2">
          Enter ZIP & Country to calculate delivery cost
        </p>
      )}
    </div>
  );

  const shouldDisableButton = Boolean(
    deliveryTouched && (calcLoading || deliveryCost === null || deliveryError),
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p>No data found</p>
      </div>
    );
  }
  return (
    <section className="py-[25px]">
      <div className="container-custom mx-auto">
        <h1 className="text-gray text-[26px] font-bold mb-[10px]">
          Signature Pad
        </h1>
        <p className="text-sm text-seclightgray mb-[15px]">
          <span
            onClick={() => router.push("/user/won-bids")}
            className="cursor-pointer"
          >
            My Won Bids
          </span>
          &nbsp;&gt;&nbsp; Signature Pad
        </p>
        <div className="bg-white border border-border rounded-[10px] p-[25px] mb-5">
          {/* CARD HEADER */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <h2 className="text-[#000000] text-2xl font-semibold">
              {data.name}
            </h2>

            <div className="flex items-center gap-2">
              <span className="px-[22px] py-2 text-xs rounded-[10px] bg-[#3C97FF] text-white">
                {data.status}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* END BID DATE */}
            <div>
              <p className="text-sm text-[#8A8A8A] mb-1">Category:</p>
              <p className="text-secgray font-medium">{data.category}</p>
            </div>

            {/* START BID PRICE */}
            <div>
              <p className="text-sm text-[#8A8A8A] mb-1">Start Bid Price:</p>
              <p className="text-secgray font-medium">
                {formatCurrency(data.start_bid_price)}
              </p>
            </div>

            {/* MY BID */}
            <div>
              <p className="text-sm text-[#8A8A8A] mb-1">My Bid:</p>
              <p className="text-secgray font-medium">
                {formatCurrency(data.won_bid_amount ?? 0)}
              </p>
            </div>
          </div>
        </div>

        {/* ----------------------- */}
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={CheckoutSchema}
          onSubmit={handleCheckoutSubmit}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form className="bg-white border border-border rounded-xl p-6 space-y-10">
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

                          setFieldValue("shippingCountry", country);

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
              <button
                type="submit"
                disabled={shouldDisableButton}
                className={`w-full py-3 rounded-lg font-medium transition
                    ${
                      shouldDisableButton
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green text-white hover:bg-lightblack cursor-pointer"
                    }
                  `}
              >
                {calcLoading ? "Calculating Delivery..." : "Continue"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
}

export default SignaturePadDetail;
