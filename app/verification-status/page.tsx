"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Loader from "@/components/common/Loader";
import { MdCheckCircle, MdError, MdPending, MdRefresh, MdArrowBack } from "react-icons/md";
import toast from "react-hot-toast";

interface ApplicantStatus {
    reviewStatus?: string;
    reviewResult?: {
        reviewAnswer: string;
        rejectLabels?: string[];
    };
    review?: {
        reviewStatus: string;
        reviewResult: {
            reviewAnswer: string;
            rejectLabels?: string[];
        };
    };
    info?: {
        idDocs: Array<{
            idDocType: string;
        }>;
    };
    requiredIdDocs?: {
        docSets: Array<{
            idDocSetType: string;
            idDocs?: Array<{
                idDocType: string;
            }>;
        }>;
    };
}

export default function VerificationStatusPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
                <Loader />
                <p className="text-gray-500 animate-pulse">Loading verification details...</p>
            </div>
        }>
            <VerificationStatusContent />
        </Suspense>
    );
}

function VerificationStatusContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const applicantId = searchParams.get("applicantId");

    const [loading, setLoading] = useState(true);
    const [statusData, setStatusData] = useState<ApplicantStatus | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const fetchStatus = useCallback(async (isManual = false) => {
        if (!applicantId) return;

        if (isManual) setRefreshing(true);
        try {
            // Use environment variable for API URL, fallback to relative path
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const apiUrl = apiBaseUrl 
                ? `${apiBaseUrl}/sumsub/status?applicantId=${applicantId}`
                : `/api/sumsub/status?applicantId=${applicantId}`;
            
            const res = await fetch(apiUrl);
            if (!res.ok) throw new Error("Failed to fetch status");
            const data = await res.json();
            setStatusData(data);
        } catch (error) {
            console.error("Error fetching status:", error);
            if (isManual) toast.error("Failed to refresh status");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [applicantId]);

    useEffect(() => {
        if (!applicantId && mounted) {
            toast.error("No applicant ID found");
            router.push("/user/profile");
            return;
        }

        if (applicantId) {
            fetchStatus();
            const interval = setInterval(() => fetchStatus(), 15000);
            return () => clearInterval(interval);
        }
    }, [applicantId, fetchStatus, router, mounted]);

    if (!mounted || loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
                <Loader />
                <p className="text-gray-500 animate-pulse">Fetching verification status...</p>
            </div>
        );
    }

    // Support both root level and nested 'review' object
    const reviewStatus = statusData?.review?.reviewStatus || statusData?.reviewStatus;
    const reviewAnswer = statusData?.review?.reviewResult?.reviewAnswer || statusData?.reviewResult?.reviewAnswer;

    const getOverallStatus = () => {
        if (reviewStatus === "pending" || reviewStatus === "init") {
            return {
                label: "Verification Pending",
                color: "text-[#F6C343]",
                bg: "bg-[#FFF8E6]",
                icon: <MdPending className="text-4xl text-[#F6C343]" />,
                description: "We are currently reviewing your documents. This usually takes a few minutes."
            };
        }
        if (reviewStatus === "completed" && reviewAnswer === "GREEN") {
            return {
                label: "Verification Approved",
                color: "text-[#2DBE60]",
                bg: "bg-[#E8F8EE]",
                icon: <MdCheckCircle className="text-4xl text-[#2DBE60]" />,
                description: "Success! Your identity has been verified. You can now access all features."
            };
        }
        if (reviewStatus === "completed" && reviewAnswer === "RED") {
            return {
                label: "Verification Rejected",
                color: "text-[#E53935]",
                bg: "bg-[#FFECEC]",
                icon: <MdError className="text-4xl text-[#E53935]" />,
                description: "Unfortunately, your verification was rejected. Please check your documents and try again."
            };
        }
        return {
            label: "System Processing",
            color: "text-blue-500",
            bg: "bg-blue-50",
            icon: <MdPending className="text-4xl text-blue-500" />,
            description: "Sumsub is processing your data..."
        };
    };

    const status = getOverallStatus();

    const getDocStatus = (type: string) => {
        // Check info.idDocs first (standard for completed applicants)
        const inInfo = statusData?.info?.idDocs?.some(d => d.idDocType === type);
        if (inInfo) {
            return reviewStatus === "completed" ? (reviewAnswer === "GREEN" ? "Verified" : "Rejected") : "Uploaded";
        }

        // Check requiredIdDocs fallback
        if (statusData?.requiredIdDocs?.docSets) {
            for (const set of statusData.requiredIdDocs.docSets) {
                if (Array.isArray(set.idDocs)) {
                    for (const doc of set.idDocs) {
                        if (doc.idDocType === type) {
                            return reviewStatus === "completed" ? (reviewAnswer === "GREEN" ? "Verified" : "Rejected") : "Uploaded";
                        }
                    }
                }
            }
        }

        return reviewStatus === "completed" ? (reviewAnswer === "GREEN" ? "Verified" : "Rejected") : "Pending";
    };

    const licenseStatus = getDocStatus("DRIVERS");

    return (
        <section className="py-12 bg-[#F9FAFB] min-h-screen" suppressHydrationWarning>
            <div className="container-custom mx-auto max-w-2xl" suppressHydrationWarning>
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.push("/user/profile")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <MdArrowBack size={20} />
                        <span>Back to Profile</span>
                    </button>

                    <button
                        onClick={() => fetchStatus(true)}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg text-sm font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
                    >
                        <MdRefresh size={18} className={refreshing ? "animate-spin" : ""} />
                        {refreshing ? "Refreshing..." : "Manual Refresh"}
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden" suppressHydrationWarning>
                    <div className={`${status.bg} p-8 text-center border-b border-border`}>
                        <div className="flex justify-center mb-4">
                            {status.icon}
                        </div>
                        <h1 className={`text-2xl font-bold ${status.color} mb-2`}>{status.label}</h1>
                        <p className="text-gray-600 max-w-sm mx-auto">{status.description}</p>
                    </div>

                    <div className="p-8 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 border-b pb-4">Verification Details</h2>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl" suppressHydrationWarning>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-lg border flex items-center justify-center">
                                        <Image src="/assets/p3.svg" alt="License" width={24} height={24} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700">Driving License</p>
                                        <p className="text-xs text-gray-500">Front & Back verification</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${licenseStatus === "Verified" ? "bg-green-100 text-green-700" :
                                    licenseStatus === "Rejected" ? "bg-red-100 text-red-700" :
                                        "bg-blue-100 text-blue-700"
                                    }`}>
                                    {licenseStatus}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 p-4 rounded-xl border-2 border-dashed border-gray-200 text-center">
                            <p className="text-sm text-gray-500">
                                Applicant ID: <span className="font-mono text-gray-700">{applicantId}</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-1 italic">
                                Status automatically refreshes every 15 seconds
                            </p>
                        </div>

                        {reviewStatus === "completed" && reviewAnswer === "RED" && (
                            <div className="bg-red-50 p-4 rounded-xl border border-red-100 mt-4">
                                <p className="text-sm text-red-700 font-medium mb-1">Reason for rejection:</p>
                                <p className="text-sm text-red-600">
                                    {statusData?.review?.reviewResult?.rejectLabels?.join(", ") || statusData?.reviewResult?.rejectLabels?.join(", ") || "Information provided doesn't match our criteria. Please re-upload clear documents."}
                                </p>
                                <button
                                    onClick={() => router.push("/user/profile")}
                                    className="mt-3 text-sm font-bold text-red-700 underline"
                                >
                                    Go back and try again
                                </button>
                            </div>
                        )}

                        {reviewStatus === "completed" && reviewAnswer === "GREEN" && (
                            <button
                                onClick={() => router.push("/")}
                                className="w-full py-4 bg-[#2DBE60] text-white rounded-xl font-bold hover:bg-[#259e50] transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-green-100"
                            >
                                Continue to Dashboard
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
