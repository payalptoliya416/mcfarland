"use client";

import SignaturePadBox from "@/adminpanel/SignaturePadBox";
import { getSingleWonBid, signContract, WonBid } from "@/api/user/bids";
import { getSaleAgreementContract } from "@/api/user/profile";
import Loader from "@/components/common/Loader";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

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
              padding: 12px;
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

function SignaturePadAgreement() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const [signature, setSignature] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [data, setData] = useState<WonBid | null>(null);
  const [loading, setLoading] = useState(true);
  const isAlreadySigned =
    data?.status === "Signed" ||
    data?.status === "Send" ||
    data?.status === "Approved" ||
    data?.status === "Rejected";
  const [contractHtml, setContractHtml] = useState<string>("");
  const [wonBidData, setWonBidData] = useState<any>(null);
  const [contractLoading, setContractLoading] = useState(true);

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

  const handleSendContract = async () => {
    if (!signature) {
      toast.error("Please draw and save your signature first");
      return;
    }

    if (!wonBidData) {
      toast.error("Bid data missing");
      return;
    }

    if (!id) {
      toast.error("Invalid machinery id");
      return;
    }

    if (submitting) return;

    try {
      setSubmitting(true);

      const formData = new FormData();

      // ✅ REQUIRED ROOT FIELD
      formData.append("machinery_id", String(id));

      // ======================
      // ✅ BILLING DETAILS
      // ======================
      formData.append(
        "billing_details[legal_company_name]",
        wonBidData.billing_details.legal_company_name,
      );
      formData.append(
        "billing_details[street_and_number]",
        wonBidData.billing_details.street_and_number,
      );
      formData.append("billing_details[city]", wonBidData.billing_details.city);
      formData.append(
        "billing_details[state_province]",
        wonBidData.billing_details.state_province ?? "",
      );
      formData.append(
        "billing_details[zip_postal_code]",
        wonBidData.billing_details.zip_postal_code,
      );
      formData.append(
        "billing_details[country]",
        wonBidData.billing_details.country,
      );

      // ======================
      // ✅ SHIPPING DETAILS
      // ======================
      formData.append(
        "shipping_details[is_different]",
        wonBidData.shipping_details.is_different ? "1" : "0",
      );

      formData.append(
        "shipping_details[shipping_street]",
        wonBidData.shipping_details.shipping_street ?? "",
      );
      formData.append(
        "shipping_details[shipping_city]",
        wonBidData.shipping_details.shipping_city ?? "",
      );
      formData.append(
        "shipping_details[shipping_state]",
        wonBidData.shipping_details.shipping_state ?? "",
      );
      formData.append(
        "shipping_details[shipping_zip]",
        wonBidData.shipping_details.shipping_zip ?? "",
      );
      formData.append(
        "shipping_details[shipping_country]",
        wonBidData.shipping_details.shipping_country ?? "",
      );

      formData.append("sign_photo", signature);

      const res = await signContract(formData);

      if (res.success) {
        toast.success(res.message || "Contract sent successfully");

        localStorage.removeItem("wonBidUserOut");
        fetchBid();
        setIsSubmitted(true);
        setSignature("");
        router.back();
      } else {
        toast.error(res.message || "Failed to send contract");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("wonBidUserOut");

    if (!stored) {
      toast.error("Bid data not found");
      router.push("/inventory");
      return;
    }

    const parsed = JSON.parse(stored);
    setWonBidData(parsed);
  }, [router]);

  useEffect(() => {
    if (!wonBidData) return;

    const loadContract = async () => {
      try {
        setContractLoading(true);
        const contractPayload = {
          machinery_id: wonBidData.machinery_id,
          billing_details: wonBidData.billing_details,
          shipping_details: wonBidData.shipping_details,
        };

        const res = await getSaleAgreementContract(contractPayload);

        if (res.success) {
          setContractHtml(res.data);
        } else {
          toast.error(res.message || "Failed to load sale agreement");
        }
      } catch (error) {
        console.error("Sale agreement error:", error);
        toast.error("Something went wrong while loading the sale agreement");
      } finally {
        setContractLoading(false);
      }
    };

    loadContract();
  }, [wonBidData]);

  return (
    <>
      <section className="py-[25px]">
        <div className="container-custom mx-auto">
          <SignaturePadBox
            onSignatureReady={setSignature}
            clearTrigger={isSubmitted}
          />
          <div className="bg-white border border-border rounded-[10px] my-6 min-h-[700px] flex items-center justify-center">
            {contractLoading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader />
              </div>
            ) : (
              <iframe
                srcDoc={makeContractResponsive(contractHtml)}
                className="w-full h-[700px] border border-border rounded"
              />
            )}
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSendContract}
              type="button"
              disabled={submitting || isAlreadySigned || isSubmitted}
              className={`h-[42px] px-5 rounded-lg text-sm font-medium text-white transition 
                              ${
                                submitting || isAlreadySigned
                                  ? "bg-[#9E9E9E] cursor-not-allowed"
                                  : "bg-green hover:bg-[#FFBD34] cursor-pointer"
                              }`}
            >
              {isAlreadySigned || isSubmitted ? (
                "Contract Already Signed"
              ) : submitting ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </div>
              ) : (
                "Send Contract & Agreement"
              )}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default SignaturePadAgreement;
