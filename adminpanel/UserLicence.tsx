"use client";

import { adminUserService, UserApiItem } from "@/api/admin/usersManagement";
import Loader from "@/components/common/Loader";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type License = {
  id: number;
  user_id: number;
  status: number;

  front_side?: string;
  front_side_url?: string;

  back_side?: string;
  back_side_url?: string;
};

function UserLicence() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [user, setUser] = useState<UserApiItem | null>(null);
  const [license, setLicense] = useState<License | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);

      const res = await adminUserService.show(Number(id));
      const data = res.data;

      setUser(data);
      setLicense(data.license ?? null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // 🔥 loader off
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchUser();
  }, [id]);

  const isPdf = (url: string) => url?.toLowerCase().endsWith(".pdf");
  const [actionLoading, setActionLoading] = useState<
    "approve" | "decline" | null
  >(null);

  const handleLicenseAction = async (action: "approve" | "decline") => {
    if (!license) return;

    // if (license.status !== 0 && user?.license?.is_sumsub !== 1) return;

    try {
      setActionLoading(action);

      const res = await adminUserService.updateLicenseAction(
        Number(id),
        action,
      );

      toast.success(res.message);

      // setLicense((prev) =>
      //   prev
      //     ? {
      //         ...prev,
      //         status: action === "approve" ? 1 : 2,
      //       }
      //     : prev,
      // );
      await fetchUser();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusConfig = (status: number) => {
    switch (status) {
      case 1:
        return {
          label: "Approved",
          className: "bg-green-100 text-green-700",
        };
      case 2:
        return {
          label: "Declined",
          className: "bg-red-100 text-red-700",
        };
      default:
        return {
          label: "Pending",
          className: "bg-yellow-100 text-yellow-700",
        };
    }
  };
const isSubsumOne = user?.license?.is_sumsub === 1;
const status = license?.status;

// APPROVE BUTTON
const disableApprove =
  actionLoading !== null ||
  (isSubsumOne
    ? status === 1     
    : status !== 0);   
// DECLINE BUTTON
const disableDecline =
  actionLoading !== null ||
  (isSubsumOne
    ? status === 2        
    : status !== 0);  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }
  return (
    <>
      {user && (
        <div className="rounded-2xl border border-[#ECECEC] bg-white p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "First Name", value: user.first_name },
              { label: "Last Name", value: user.last_name },
              { label: "Email Address", value: user.email },
              { label: "Phone Number", value: user.phone_no },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-[#ECECEC] p-4">
                <p className="text-xs text-seclightgray mb-1">{item.label}</p>
                <p className="text-sm font-medium text-gray-900">
                  {item.value || "-"}
                </p>
              </div>
            ))}

            {/* Company */}
            <div className="rounded-xl border border-[#ECECEC] p-4 md:col-span-2">
              <p className="text-xs text-seclightgray mb-1">Company Name</p>
              <p className="text-sm font-medium text-gray-900 uppercase">
                {user.company_name || "-"}
              </p>
            </div>

            {/* Address */}
            <div className="rounded-xl border border-[#ECECEC] p-4 md:col-span-3">
              <p className="text-xs text-seclightgray mb-1">Address</p>
              <p className="text-sm font-medium text-gray-900">
                {user.address || "-"}
              </p>
            </div>

            {[
              { label: "City", value: user.city },
              { label: "State", value: user.state },
              { label: "Zip Code", value: user.zip_code },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-[#ECECEC] p-4">
                <p className="text-xs text-seclightgray mb-1">{item.label}</p>
                <p className="text-sm font-medium text-gray-900">
                  {item.value || "-"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {license && (
        <div className="mt-8 rounded-2xl border border-[#ECECEC] bg-white p-6">
          <div className="flex items-center gap-5 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              License Documents
            </h2>

            {license && (
              <span
                className={`px-3 py-1 text-xs font-medium rounded-md ${
                  getStatusConfig(license.status).className
                }`}
              >
                {getStatusConfig(license.status).label}
              </span>
            )}
          </div>

          {/* IMAGES */}
          <div className="grid grid-cols-12">
            <div className="col-span-12 xl:col-span-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* FRONT SIDE */}
                <div className="rounded-xl border border-[#ECECEC] p-4 bg-gray-50">
                  <p className="text-sm font-medium mb-3 text-gray-700">
                    Front Side
                  </p>

                  {license.front_side_url && isPdf(license.front_side_url) ? (
                    <a
                      href={license.front_side_url}
                      target="_blank"
                      className="block text-center text-sm underline text-blue-600"
                    >
                      View Front PDF
                    </a>
                  ) : (
                    <a
                      href={license.front_side_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={license.front_side_url}
                        alt="Front Side"
                        className="w-full h-[240px] object-contain rounded-lg bg-white cursor-pointer hover:opacity-80 transition"
                      />
                    </a>
                  )}
                </div>

                {/* BACK SIDE */}
                <div className="rounded-xl border border-[#ECECEC] p-4 bg-gray-50">
                  <p className="text-sm font-medium mb-3 text-gray-700">
                    Back Side
                  </p>

                  {license.back_side_url && isPdf(license.back_side_url) ? (
                    <a
                      href={license.back_side_url}
                      target="_blank"
                      className="block text-center text-sm underline text-blue-600"
                    >
                      View Back PDF
                    </a>
                  ) : (
                    <a
                      href={license.back_side_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={license.back_side_url}
                        alt="Back Side"
                        className="w-full h-[240px] object-contain rounded-lg bg-white cursor-pointer hover:opacity-80 transition"
                      />
                    </a>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  disabled={disableDecline}
                  onClick={() => handleLicenseAction("decline")}
                  className={`px-4 py-2 text-sm rounded-lg text-white flex items-center gap-2 cursor-pointer
          ${
            disableDecline
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#DC3623] hover:bg-[#C12E1E]"
          }`}
                >
                  {actionLoading === "decline" && (
                    <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  Decline
                </button>

                <button
                  disabled={disableApprove}
                  onClick={() => handleLicenseAction("approve")}
                  className={`px-4 py-2 text-sm rounded-lg text-white flex items-center gap-2 cursor-pointer
          ${
            disableApprove
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#35BB63] hover:bg-[#2EA556]"
          }`}
                >
                  {actionLoading === "approve" && (
                    <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  Approve
                </button>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS (SMALL & CLEAN) */}
        </div>
      )}
    </>
  );
}

export default UserLicence;
