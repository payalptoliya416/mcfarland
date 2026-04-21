"use client";

import { userCheckout } from "@/api/categoryActions";
import { getSaleAgreementContract, getUserDetails } from "@/api/user/profile";
import Loader from "@/components/common/Loader";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import SignatureCanvas from "react-signature-canvas";

const makeContractResponsive = (html: string) => {
  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: Arial, sans-serif;
            overflow-x: hidden;
          }
               .contract-wrapper {
               padding: 24px; 
               }

          /* Main page wrapper (A4 → responsive) */
          .page, .contract, table {
            width: 100% !important;
            max-width: 100% !important;
          }

          table {
            border-collapse: collapse;
          }

          td, th {
            word-break: break-word;
            padding: 6px;
          }

          img {
            max-width: 100%;
            height: auto;
          }

          /* Mobile specific */
          @media (max-width: 480px) {
            body {
              padding: 8px;
              font-size: 13px;
            }

            h1, h2, h3 {
              font-size: 16px !important;
            }

            table td, table th {
              font-size: 12px;
            }
          }
        </style>
      </head>
      <body>
       <div class="contract-wrapper">
        ${html}
        </div>
      </body>
    </html>
  `;
};

function SaleAgreement() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const categorySlug = segments[1];
  const makeSlug = segments[2];
  const modelSlug = segments[3];
  const auction_id = segments[4];
  const sigRef = useRef<SignatureCanvas>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [canvasWidth, setCanvasWidth] = useState<number>(900);
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const router = useRouter();
  const [userLoading, setUserLoading] = useState(false);
  const [contractHtml, setContractHtml] = useState<string>("");
  const [isSignatureSaved, setIsSignatureSaved] = useState(false);
  const hasHandledMissingCheckout = useRef(false);

  const redirectToSignin = (router: any) => {
    toast.error("Please login to continue");

    router.push(
      `/user/signin?returnUrl=${encodeURIComponent(window.location.pathname)}`,
    );
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setUserLoading(true);

        const res = await getUserDetails();
        if (res.status) {
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
    if (wrapperRef.current) {
      setCanvasWidth(wrapperRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const data = localStorage.getItem("checkoutData");

      if (!data) {
        if (!hasHandledMissingCheckout.current) {
          hasHandledMissingCheckout.current = true;
          toast.error("Checkout data missing");
        }

        router.push("/inventory");
        return;
      }

      const parsed = JSON.parse(data);
      setCheckoutData(parsed);

      try {
        const contractPayload = {
          machinery_id: parsed.machinery_id,
          billing_details: parsed.billing_details,
          shipping_details: parsed.shipping_details,
        };

        const res = await getSaleAgreementContract(contractPayload);

        if (res.success) {
          setContractHtml(res.data);
        } else {
          if (
            res.message?.toLowerCase().includes("access denied") ||
            res.message?.toLowerCase().includes("unauthorized")
          ) {
            redirectToSignin(router);
          } else {
            toast.error(res.message || "Failed to load sale agreement");
          }
        }
      } catch (error: any) {
        console.error("Sale agreement error:", error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong while loading the sale agreement");
        }
      }
    };

    init();
  }, []);

  const handleClear = () => {
    sigRef.current?.clear();
  };

  const handleSave = () => {
    if (!sigRef.current || sigRef.current.isEmpty()) {
      toast.error("Please draw your signature first");
      return;
    }
    const dataUrl = sigRef.current.getTrimmedCanvas().toDataURL("image/png");

    setIsSignatureSaved(true);
    toast.success("Signature saved successfully");
  };

  const handleFinalSubmit = async () => {
    if (!isSignatureSaved) {
      toast.error("Please save your signature before submitting");
      return;
    }

    if (!checkoutData) {
      toast.error("Checkout data missing");
      return;
    }

    const signatureBase64 = sigRef
      .current!.getTrimmedCanvas()
      .toDataURL("image/png");

    const finalPayload = {
      machinery_id: checkoutData.machinery_id,
      billing_details: checkoutData.billing_details,
      shipping_details: checkoutData.shipping_details,
      sign_photo: signatureBase64,
    };

    const toastId = toast.loading("Submitting order...");

    try {
      const res = await userCheckout(finalPayload);
      toast.dismiss(toastId);

      if (res?.success) {
        toast.success(res.message);
        localStorage.removeItem("checkoutData");

       router.push(
          `/confirmation/${categorySlug}/${makeSlug}/${modelSlug}/${auction_id}`,
        );
      } else {
        toast.error(res?.message || "Checkout failed");
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    }
  };

  if (userLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <section className="pt-16">
        <div className="container-custom mx-auto">
          {contractHtml && (
            <div className="bg-white border border-border rounded-[10px]  my-6">
              <iframe
                srcDoc={makeContractResponsive(contractHtml)}
                className="w-full h-[700px] border border-border rounded"
              />
            </div>
          )}

          <div className="border border-border rounded-xl p-6 bg-white">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h2 className="text-secgray text-base font-semibold">
                  Draw Signature
                </h2>
                <p className="text-sm text-seclightgray">
                  Draw with mouse or touch
                </p>
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
              text-white hover:bg-[#00695C] transition cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
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

          <div className="flex justify-end mt-5">
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="h-[42px] px-5 rounded-lg text-sm font-medium text-white transition 
            bg-green hover:bg-[#00695C] cursor-pointer"
            >
              Agree & Submit
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default SaleAgreement;
