'use client'

import { RecentBiddingCard } from "@/adminpanel/RecentBiddingCard";
import { RecentOrderCard } from "@/adminpanel/RecentOrderCard";
import { RecentUserCard } from "@/adminpanel/RecentUserCard";
import { RecentWonUserCard } from "@/adminpanel/RecentWonUserCard";
import { adminDashboardService, formatDateTime } from "@/api/admin/bidding";
import Loader from "@/components/common/Loader";
import { formatPrice } from "@/hooks/formate";
import { useIsMobile } from "@/hooks/useIsMobile";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HiArrowPath } from "react-icons/hi2";

function Dashboard() {
 const [loading, setLoading] = useState(true);
const isMobile = useIsMobile();
const router = useRouter();
  const [stats, setStats] = useState<any[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [rowsData, setRowsData] = useState<any[]>([]);
  const [recentManagement, setRecentManagement] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loadingLink, setLoadingLink] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const res = await adminDashboardService();

        if (!res.success) return;

        const data = res.data;

        /* ================= STATS ================= */
        setStats([
          {
            label: "Total Users",
            value: data.total_users,
            icon: "/assets/m1.svg",
            bg: "#F85959",
          },
          {
            label: "Total Machinery",
            value: data.total_machinery,
            icon: "/assets/m2.svg",
            bg: "#F29E2A",
          },
          {
            label: "Pending Licenses",
            value: data.pending_license_users,
            icon: "/assets/m3.svg",
            bg: "#32CD37",
          }
        ]);

        /* ================= RECENT BIDDING ================= */
        setRows(
          data.recent_bids.map((item) => ({
            name: item.machinery_name,
            totalBid: item.total_bids,
            date: formatDateTime(item.bid_end_time),
          }))
        );

        /* ================= RECENT WON USERS ================= */
        setRowsData(
          data.recent_won_users.map((item) => ({
            machinery: item.machinery_name,
            user: item.won_user_name,
            price: `${formatPrice(item.won_bid_price)}`,
          }))
        );

        /* ================= RECENT USERS ================= */
        setRecentManagement(
          data.recent_users.map((u) => ({
            name: u.full_name,
            email: u.email,
            phone: u.phone_no,
            date: formatDateTime(u.registration_date),
            licenseStatus: u.license_status,
            userStatus: u.user_status,
          }))
        );

        setRecentOrders(
          data.recent_orders.map((o: any) => ({
            orderId: o.order_id,
            userName: o.user_name,
            phone: o.phone_no,
            date: formatDateTime(o.order_date),
            amount: formatPrice(o.amount),
            status: o.status,
            type: o.type_text,
          }))
        );

      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);
const orderBadge = (status: string) => {
  switch (status) {
    case "Order Submitted":
      return "bg-gray-400 text-white";

    case "Sales Agreement":
      return "bg-purple-500 text-white";

    case "Awaiting Invoice":
      return "bg-orange-400 text-white";

    case "Settle Payment":
      return "bg-yellow-400 text-black";

    case "Payment Confirmed":
      return "bg-teal-500 text-white";

    case "Processing":
      return "bg-blue-400 text-white";

    case "Shipping Started":
      return "bg-indigo-500 text-white";

    case "In Transit":
      return "bg-indigo-600 text-white";

    case "Delivered":
      return "bg-green-500 text-white";

    case "Cancelled":
      return "bg-red-500 text-white";

    default:
      return "bg-gray-200 text-black";
  }
};
   const licenseBadge = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-[#EDB423] text-gray";
    case "Declined":
      return "bg-[#DD3623] text-white";
    case "Approved":
      return "bg-[#2196F3] text-white";
    default:
      return "";
  }
};

const userBadge = (status: string) =>
  status === "Active"
    ? "bg-[#35BB63] text-white"
    : "bg-[#DD3623] text-white";
  
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader />
        </div>
      );
    }

  return (
      <div className="space-y-5 bg-white border border-border rounded-[14px] p-3 sm:p-5">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {stats.map((item, index) => (
              <div
                key={index}
                className="p-[15px] border border-border rounded-[10px]"
              >
                <div
                  className="w-10 h-10 rounded-[14px] mb-[15px] flex justify-center items-center"
                  style={{ backgroundColor: item.bg }}
                >
                  <Image src={item.icon} alt={item.label} width={20} height={20} />
                </div>
    
                <h3 className="text-gray text-[26px] font-bold mb-[10px]">
                  {item.value}
                </h3>
    
                <p className="text-lightgray text-sm font-normal">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <div className="grid  grid-cols-1 2xl:grid-cols-2 gap-5">
            <div className="p-[15px] border border-border rounded-[10px]">
              <div className="flex sm:items-center justify-between mb-5 flex-col sm:flex-row gap-2">
                <h2 className="text-base font-semibold">Recent Bidding</h2>
                {/* <Link href="/admin/bidding/" className="relative overflow-hidden gradient-btn px-[14px] py-2 text-sm text-white rounded-md transition-all duration-200 ease-in-out hover:brightness-110 hover:shadow-md
                  active:brightness-90 active:scale-95">
                  View All
                </Link> */}
                <button
                onClick={() => {
                  setLoadingLink("bidding");
                  router.push("/admin/bidding/");
                }}
                disabled={loadingLink === "bidding"}
                className="relative overflow-hidden gradient-btn px-[14px] py-2 text-sm text-white rounded-md transition-all duration-200 ease-in-out hover:brightness-110 hover:shadow-md active:brightness-90 active:scale-95 flex items-center justify-center cursor-pointer h-9 min-w-[80px]"
              >
                {loadingLink === "bidding" ? (
                  <HiArrowPath size={16} className="animate-spin" />
                ) : (
                  "View All"
                )}
              </button>
              </div>
                 <div className="grid grid-cols-12"> 
                     <div className="col-span-12">
                      {!isMobile && (
                         <div className="w-full overflow-x-auto border border-border rounded-[10px]">
                            <table className="border-collapse min-w-full">
                            <thead>
                                <tr className="bg-[#FFEFCC] text-left">
                                <th className="px-[15px] py-[18px] text-sm font-medium text-secgray border-r border-border whitespace-nowrap">
                                    Machinery Name
                                </th>
                                <th className="px-[15px] py-[18px] text-sm font-medium text-secgray border-r border-border whitespace-nowrap">
                                    Total Bid
                                </th>
                                <th className="px-[15px] py-[18px] text-sm font-medium text-secgray whitespace-nowrap">
                                    Bid End Date
                                </th>
                                </tr>
                            </thead>
    
                            <tbody>
                                {rows.map((row, index) => (
                                <tr
                                    key={index}
                                    className="border-t border-border even:bg-[#F9F9F9]"
                                >
                                    <td className="px-[15px] py-[18px] text-sm text-secgray border-r border-border whitespace-nowrap">
                                    {row.name}
                                    </td>
                                    <td className="px-[15px] py-[18px] text-sm text-secgray border-r border-border whitespace-nowrap">
                                    {row.totalBid}
                                    </td>
                                    <td className="px-[15px] py-[18px] text-sm text-secgray whitespace-nowrap">
                                    <span className="bg-border px-3 py-1 rounded-[4px] text-[13px]">
                                        {row.date}
                                    </span>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                         </div>
                      )}
                      {/* MOBILE */}
                    {isMobile && (
                      <div className="space-y-3">
                        {rows.map((row, i) => (
                          <RecentBiddingCard key={i} row={row} />
                        ))}
                      </div>
                    )}
                     </div>
                 </div>
            </div>
    
            <div className="p-[15px] border border-border rounded-[10px]">
              <div className="flex sm:items-center justify-between mb-5 flex-col sm:flex-row gap-2">
                <h2 className="text-base font-semibold">Recent Won User</h2>
                {/* <Link href="/admin/won-user/" className="relative overflow-hidden gradient-btn px-[14px] py-2 text-sm text-white rounded-md transition-all duration-200 ease-in-out hover:brightness-110 hover:shadow-md
                  active:brightness-90 active:scale-95">
                  View All
                </Link> */}
                <button
                    onClick={() => {
                      setLoadingLink("won-user");
                      router.push("/admin/won-user/");
                    }}
                    disabled={loadingLink === "won-user"}
                    className="gradient-btn px-[14px] py-2 text-sm text-white rounded-md flex items-center justify-center cursor-pointer h-9 min-w-[80px]"
                  >
                    {loadingLink === "won-user" ? (
                      <HiArrowPath size={16} className="animate-spin" />
                    ) : (
                      "View All"
                    )}
                  </button>
              </div>
            <div className="grid grid-cols-12"> 
                  <div className="col-span-12">
                    {!isMobile && (
                     <div className="w-full overflow-x-auto border border-border rounded-[10px]">
                            <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#FFEFCC] text-left">
                                <th className="px-[15px] py-[18px] text-sm font-medium text-secgray border-r border-border whitespace-nowrap">
                                    Machinery Name
                                </th>
                                <th className="px-[15px] py-[18px] text-sm font-medium text-secgray border-r border-border whitespace-nowrap">
                                    Won User Name
                                </th>
                                <th className="px-[15px] py-[18px] text-sm font-medium text-secgray whitespace-nowrap">
                                    Won Bid Price
                                </th>
                                </tr>
                            </thead>
    
                            <tbody>
                                {rowsData.map((row, index) => (
                                <tr
                                    key={index}
                                    className="border-t border-border even:bg-[#F9F9F9]"
                                >
                                    <td className="px-[15px] py-[18px] text-sm text-secgray border-r border-border whitespace-nowrap">
                                    {row.machinery}
                                    </td>
                                    <td className="px-[15px] py-[18px] text-sm text-secgray border-r border-border whitespace-nowrap">
                                    {row.user === "N/A" ? "" : row.user}
                                    </td>
                                    <td className="px-[15px] py-[18px] text-sm text-secgray whitespace-nowrap">
                                    {row.price}
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                     </div>
                    )}
                    {isMobile && (
                <div className="space-y-3">
                  {rowsData.map((row, i) => (
                    <RecentWonUserCard key={i} row={row} />
                  ))}
                </div>
              )}
                  </div>
            </div>
            </div>
          </div>
     {/* ================= RECENT ORDERS ================= */}
<div className="p-[15px] border border-border rounded-[10px] bg-white">
  <div className="flex sm:items-center justify-between mb-5 flex-col sm:flex-row gap-2">
    <h2 className="text-base font-semibold text-[#1A1A1A]">
      Recent Orders
    </h2>
{/* 
    <Link
      href="/admin/orders"
      className="relative overflow-hidden gradient-btn px-[14px] py-2 text-sm text-white rounded-md transition-all duration-200 ease-in-out hover:brightness-110 hover:shadow-md
                  active:brightness-90 active:scale-95"
    >
      View All
    </Link> */}
                <button
              onClick={() => {
                setLoadingLink("orders");
                router.push("/admin/orders");
              }}
              disabled={loadingLink === "orders"}
              className="gradient-btn px-[14px] py-2 text-sm text-white rounded-md flex items-center justify-center cursor-pointer h-9 min-w-[80px]"
            >
              {loadingLink === "orders" ? (
                <HiArrowPath size={16} className="animate-spin" />
              ) : (
                "View All"
              )}
            </button>
  </div>

  {/* DESKTOP TABLE */}
  {!isMobile && (
    <div className="w-full overflow-x-auto border border-border rounded-[10px]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#FFEFCC] text-left">
            {[
              "Order ID",
              "Type",   
              "User Name",
              "Phone Number",
              "Order Date",
              "Order Amount",
              "Status",
            ].map((head) => (
              <th
                key={head}
                className="px-[15px] py-[18px] text-sm font-medium text-secgray border-r last:border-r-0 border-border whitespace-nowrap"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {recentOrders.map((row, index) => (
            <tr
              key={index}
              className="border-t border-border even:bg-[#F9F9F9]"
            >
              <td className="px-[15px] py-[18px] text-sm border-r border-border whitespace-nowrap">
                {row.orderId}
              </td>
                <td className="px-[15px] py-[18px] text-sm border-r border-border whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded text-xs font-medium`}
                  >
                    {row.type}
                  </span>
                </td>
              <td className="px-[15px] py-[18px] text-sm border-r border-border whitespace-nowrap">
                {row.userName}
              </td>

              <td className="px-[15px] py-[18px] text-sm border-r border-border whitespace-nowrap">
                {row.phone}
              </td>

              <td className="px-[15px] py-[18px] text-sm border-r border-border whitespace-nowrap">
                <span className="bg-border px-3 py-1 rounded-[4px] text-[13px]">
                  {row.date}
                </span>
              </td>

              <td className="px-[15px] py-[18px] text-sm border-r border-border whitespace-nowrap">
                {row.amount}
              </td>

              <td className="px-[15px] py-[18px] text-sm whitespace-nowrap">
                <span
                  className={`px-4 py-2 rounded-[6px] text-sm font-medium inline-block w-[160px] text-center ${orderBadge( row.status )}`}
                >
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}

  {/* MOBILE CARDS */}
  {isMobile && (
    <div className="space-y-3">
      {recentOrders.map((row, i) => (
        <RecentOrderCard
          key={i}
          row={{
            ...row,
            badge: orderBadge(row.status),
          }}
        />
      ))}
    </div>
  )}
</div>

          <div className="p-[15px] border border-border rounded-[10px] bg-white">
            <div className="flex sm:items-center justify-between mb-5 flex-col sm:flex-row gap-2">
                <h2 className="text-base font-semibold text-[#1A1A1A]">
                Recent User Management
                </h2>
                {/* <Link href="/admin/user-management" className="relative overflow-hidden gradient-btn px-[14px] py-2 text-sm text-white rounded-md transition-all duration-200 ease-in-out hover:brightness-110 hover:shadow-md
                  active:brightness-90 active:scale-95">
                View All
                </Link> */}
                <button
            onClick={() => {
              setLoadingLink("user-management");
              router.push("/admin/user-management");
            }}
            disabled={loadingLink === "user-management"}
            className="gradient-btn  h-9 min-w-[80px] px-[14px] py-2 text-sm text-white rounded-md flex items-center justify-center cursor-pointer"
          >
            {loadingLink === "user-management" ? (
              <HiArrowPath size={16} className="animate-spin" />
            ) : (
              "View All"
            )}
          </button>
            </div>
             <div className="grid grid-cols-12"> 
                <div className="col-span-12">
                  {!isMobile && (
                      <div className="w-full overflow-x-auto border border-border rounded-[10px]">
                        <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#FFEFCC] text-left">
                            {[
                                "User Name",
                                "Email",
                                "Phone Number",
                                "Registration Date",
                                "License Status",
                                "User Status",
                            ].map((head) => (
                                <th
                                key={head}
                                className="px-[15px] py-[18px] text-sm font-medium text-secgray border-r last:border-r-0 border-border whitespace-nowrap"
                                >
                                {head}
                                </th>
                            ))}
                            </tr>
                        </thead>
    
                        <tbody>
                            {recentManagement.map((row, index) => (
                            <tr
                                key={index}
                                className="border-t border-border even:bg-[#F9F9F9]"
                            >
                                <td className="px-[15px] py-[18px] text-sm text-secgray border-r border-border whitespace-nowrap">
                                {row.name}
                                </td>
                                <td className="px-[15px] py-[18px] text-sm text-secgray border-r border-border whitespace-nowrap">
                                {row.email}
                                </td>
                                <td className="px-[15px] py-[18px] text-sm text-secgray border-r border-border whitespace-nowrap">
                                {row.phone}
                                </td>
                                <td className="px-[15px] py-[18px] text-sm text-secgray border-r border-border whitespace-nowrap">
                                <span className="bg-border px-3 py-1 rounded-[4px] text-[13px]">
                                    {row.date}
                                </span>
                                </td>
                                <td className="px-[15px] py-[18px] text-sm border-r border-border whitespace-nowrap">
                                <span
                                    className={`px-4 py-2 rounded-[6px] text-sm font-medium inline-block w-[100px] text-center ${licenseBadge(
                                    row.licenseStatus
                                    )}`}
                                >
                                    {row.licenseStatus}
                                </span>
                                </td>
                                <td className="px-[15px] py-[18px] text-sm whitespace-nowrap">
                                <span
                                    className={`px-4 py-2 rounded-[6px] text-sm font-medium inline-block w-[100px] text-center ${userBadge(
                                    row.userStatus
                                    )}`}
                                >
                                    {row.userStatus}
                                </span>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                      </div>
                  )}
                  {isMobile && (
              <div className="space-y-3">
                {recentManagement.map((row, i) => (
                  <RecentUserCard
                    key={i}
                    row={row}
                    licenseBadge={licenseBadge}
                    userBadge={userBadge}
                  />
                ))}
              </div>
            )}
                </div>
             </div>
           </div>
        </div>
  )
}

export default Dashboard
