'use client'

import { formatDateTime } from "@/api/admin/bidding";
import { DashboardCard, getUserDashboard, RecentBid, RecentBuyOrder } from "@/api/user/dashboard";
import Loader from "@/components/common/Loader";
import { formatPrice } from "@/hooks/formate";
import { useIsMobile } from "@/hooks/useIsMobile";
import Image from "next/image"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";

function RecentBidCard({ row }: any) {
  return (
    <div className="border border-border rounded-xl p-4 space-y-2 bg-white">
      <p className="font-semibold text-secgray">
        {row.machinery_name}
      </p>

      <div className="flex justify-between text-sm gap-1">
        <span className="text-gray-500">Last Bid</span>
        <span className="font-semibold">{row.bid_amount}</span>
      </div>

      <div className="flex justify-between text-sm gap-1">
        <span className="text-gray-500">Bid End</span>
        <span className="bg-border px-2 py-1 rounded text-xs">
          {row.bid_end_time}
        </span>
      </div>
    </div>
  );
}

function RecentOrderCard({ row }: any) {
  const statusClassMap: any = {
    "Processing": "bg-[#FFCA42] text-black",
    "Shipping Started": "bg-[#3C97FF] text-white",
    "In Transit": "bg-[#8B5CF6] text-white",
    Delivered: "bg-[#2DBE60] text-white",
    Cancelled: "bg-[#E53935] text-white",
  };

  return (
    <div className="border border-border rounded-xl p-4 space-y-2 bg-white">
      <p className="font-semibold text-secgray">
        {row.machinery_name}
      </p>

      <div className="flex justify-between text-sm gap-1">
        <span className="text-gray-500">Price</span>
        <span className="font-semibold">{row.price}</span>
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">Status</span>
        <span
          className={`px-3 py-1 rounded text-xs ${
            statusClassMap[row.status] || "bg-gray-400 text-white"
          }`}
        >
          {row.status}
        </span>
      </div>

       <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">Invoice</span>

        {row.invoice_url ? (
          <button
            onClick={() => window.open(row.invoice_url, "_blank")}
            className="text-green hover:scale-110 transition"
          >
            <FaFilePdf size={18} />
          </button>
        ) : (
          <FaFilePdf size={18} className="text-gray-400 opacity-50" />
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  const isMobile = useIsMobile();
const [cards, setCards] = useState<DashboardCard[]>([]);
const [recentBids, setRecentBids] = useState<RecentBid[]>([]);
const [recentOrders, setRecentOrders] = useState<RecentBuyOrder[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [redirectLoading, setRedirectLoading] = useState(false);
const router = useRouter();
const [showNotification, setShowNotification] = useState(true);
const [wonData, setWonData] = useState<any>(null);
const [showInvoiceNotification, setShowInvoiceNotification] = useState(true);

const fetchDashboard = async () => {
  try {
    setLoading(true);

    const res = await getUserDashboard();
    if (!res.success) return;

    const data = res.data;

    if (data.is_won === 1 && data.machinery_details) {
      setWonData(data.machinery_details);
    }

    /* DASHBOARD CARDS */
    setCards([
      {
        id: 1,
        icon: "/assets/dash1.svg",
        bg: "#F98686",
        count: data.total_bids_placed,
        label: "Total Bids Placed",
        link: "/user/bids",
      },
      {
        id: 2,
        icon: "/assets/dash2.svg",
        bg: "#78DBFF",
        count: data.active_bids,
        label: "Active Bids",
         link: "/user/bids",
      },
      {
        id: 3,
        icon: "/assets/dash3.svg",
        bg: "#A790F9",
        count: data.items_won,
        label: "Items Won",
         link: "/user/won-bids",
      },
      {
        id: 4,
        icon: "/assets/dash4.svg",
        bg: "#FC8AD6",
        count: data.items_purchased,
        label: "Items Purchased",
         link: "/user/orders",
      },
    ]);

    /* RECENT BIDS (MAP CORRECTLY) */
    setRecentBids(
      data.recent_bids.map((b) => ({
        machinery_name: b.machinery_name,
        bid_amount: formatPrice(b.bid_amount),
        bid_end_time: formatDateTime(b.bid_end_time),
      }))
    );

    /* RECENT BUY ORDERS */
    setRecentOrders(
      data.recent_buy_orders.map((o) => ({
        machinery_name: o.machinery_name,
        price: formatPrice(o.amount),
        purchase_date: formatDateTime(o.purchase_date),
        status: o.status,
        invoice_url: o.invoice_url,
      }))
    );
  } catch (error) {
    console.error("Dashboard API error:", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchDashboard();
}, []);

if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <>
    {redirectLoading && (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <Loader />
    </div>
    )}
    {wonData && showNotification && (
      <div className="mb-5 container-custom">
        <div
          className="flex items-center justify-between gap-4 bg-[#EAFBF3] border border-[#2DBE60] rounded-xl px-4 py-4 cursor-pointer hover:shadow-md transition max-w-max w-full mx-auto mt-5 relative"
        >
          <div className="flex items-center gap-3">
          <div>
            <FaCheckCircle size={26} className="text-[#2DBE60]"/>
          </div>
            <p className="text-sm sm:text-base text-[#14532D]">
              Congratulations! You’ve won the auction. <Link   href={`/user/won-bids/signaturepad?id=${wonData.id}`}
              onClick={() => setRedirectLoading(true)}
              className="font-extrabold cursor-pointer">click here</Link> to review and sign your sale agreement.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowNotification(false);
              }}
              className="text-[#2DBE60] hover:bg-[#DCFCE7] rounded-full w-7 h-7 flex items-center justify-center transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    )}
    {wonData?.pdf_url && showInvoiceNotification && (
      <div className="mb-5 container-custom">
        <div
          className="flex items-center justify-between gap-4 bg-[#EAFBF3] border border-[#2DBE60] rounded-xl px-4 py-4 cursor-pointer hover:shadow-md transition max-w-max w-full mx-auto mt-3 relative"
        >
          <div className="flex items-center gap-3">
            <div>
              <FaFilePdf size={26} className="text-[#2DBE60]" />
            </div>

            <p className="text-sm sm:text-base text-[#14532D]">
              Your sale agreement has been successfully signed and approved.{" "}
              <span
                onClick={() => window.open(wonData.pdf_url, "_blank")}
                className="font-extrabold cursor-pointer underline"
              >
                click here
              </span>{" "}
              to view your invoice.
            </p>
          </div>

          {/* ✅ Close button (same as congratulations) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowInvoiceNotification(false);
            }}
            className="text-[#2DBE60] hover:bg-[#DCFCE7] rounded-full w-7 h-7 flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>
    )}

    <section className="py-[25px]">
      <div className="container-custom mx-auto">
        <h1 className="text-secgray text-[22px] sm:text-[26px] font-bold mb-[15px]">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
          {cards.map((item) => (
            <div
          key={item.id}
          onClick={() => {
            setRedirectLoading(true);
            router.push(item.link);
          }}
              className="border rounded-[10px] border-border p-[20px] sm:p-[25px] flex flex-col gap-[15px] justify-center items-center lg:items-start lg:justify-start cursor-pointer"
            >
              <div
                className="w-[60px] h-[60px] rounded-[18px] p-[15px] flex justify-center items-center"
                style={{ backgroundColor: item.bg }}
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={30}
                  height={30}
                />
              </div>

              <h3 className="text-gray text-[30px] sm:text-[38px] font-bold">
                {item.count}
              </h3>

              <p className="text-lightgray text-[18px] sm:text-[22px] leading-[22px]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      <div className="grid  grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold">Recent Bidding</h2>
                <Link href="/user/bids/" className="relative overflow-hidden gradient-btn px-[14px] py-2 text-sm text-white rounded-md transition-all duration-200 ease-in-out hover:brightness-110 hover:shadow-md
                  active:brightness-90 active:scale-95">
                  View All
                </Link>
              </div>
                 <div className="grid grid-cols-12"> 
                     <div className="col-span-12">
                                          {/* RECENT BIDDING */}
                    {isMobile ? (
                      <div className="space-y-3">
                        {recentBids.length === 0 ? (
                          <p className="text-center text-sm text-gray-400">
                            No recent bids found
                          </p>
                        ) : (
                          recentBids.map((row, i) => (
                            <RecentBidCard key={i} row={row} />
                          ))
                        )}
                      </div>
                    ) : (
                         <div className="w-full overflow-x-auto border border-border rounded-[10px]">
                            <table className="border-collapse min-w-full">
                            <thead>
                                <tr className="bg-[#FFEFCC] text-left">
                                <th className="px-[15px] py-[18px] text-sm font-medium text-secgray border-r border-border whitespace-nowrap">
                                    Machinery
                                </th>
                                <th className="px-[15px] py-[18px] text-sm font-medium text-secgray border-r border-border whitespace-nowrap">
                                    Last Bid
                                </th>
                                <th className="px-[15px] py-[18px] text-sm font-medium text-secgray whitespace-nowrap">
                                    Bid End Date
                                </th>
                                </tr>
                            </thead>
                                  <tbody>
                                {recentBids.length === 0 ? (
                                  <tr className="border-t border-border even:bg-[#F9F9F9]">
                                    <td colSpan={3} className="px-[15px] py-4 text-sm text-secgray border-r border-border whitespace-nowrap text-center">
                                      No recent bids found
                                    </td>
                                  </tr>
                                ) : (
                                  recentBids.map((row: any, index: number) => (
                                    <tr
                                      key={index}
                                     className="px-[15px] py-[18px] text-sm text-secgray whitespace-nowrap"
                                    >
                                      <td className="px-[15px] py-[18px] text-sm text-secgray border-r border-border whitespace-nowrap">
                                        {row.machinery_name}
                                      </td>
                                      <td className="px-[15px] py-[18px] text-sm text-secgray border-r border-border whitespace-nowrap">
                                          {row.bid_amount}
                                      </td>
                                      <td className="px-[15px] py-[18px] text-sm text-secgray whitespace-nowrap">
                                        <span className="bg-border px-3 py-1 rounded-[4px] text-[13px]">
                                          {row.bid_end_time}
                                        </span>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                         </div>)}
                     </div>
                 </div>
            </div>
    
            <div className="">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold">Recent Buy Orders</h2>
                <Link href="/user/orders" className="relative overflow-hidden gradient-btn px-[14px] py-2 text-sm text-white rounded-md transition-all duration-200 ease-in-out hover:brightness-110 hover:shadow-md
                  active:brightness-90 active:scale-95">
                  View All
                </Link>
              </div>
            <div className="grid grid-cols-12"> 
                  <div className="col-span-12">
                    {isMobile ? (
                    <div className="space-y-3">
                      {recentOrders.length === 0 ? (
                        <p className="text-center text-sm text-secgray">
                          No recent orders found
                        </p>
                      ) : (
                        recentOrders.map((row, i) => (
                          <RecentOrderCard key={i} row={row} />
                        ))
                      )}
                    </div>
                  ) : (
                     <div className="w-full overflow-x-auto border border-border rounded-[10px]">
                            <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#FFEFCC] text-left">
                                <th className="px-[15px] py-[18px] text-sm font-medium text-secgray border-r border-border whitespace-nowrap">
                                    Machinery
                                </th>
                                <th className="px-[15px] py-[18px] text-sm font-medium text-secgray border-r border-border whitespace-nowrap">
                                  Price
                                </th>
                                <th className="px-[15px] py-[18px] text-sm font-medium text-secgray border-r border-border whitespace-nowrap">
                                   Status
                                </th>
                                <th className="px-[15px] py-[18px] text-sm font-medium text-secgray whitespace-nowrap">
                                  Invoice
                                </th>
                                </tr>
                            </thead>
                                  <tbody>
                                {recentOrders.length === 0 ? (
                                  <tr  className="border-t border-border even:bg-[#F9F9F9]">
                                    <td colSpan={4} className="text-center py-4 text-sm text-secgray">
                                      No recent orders found
                                    </td>
                                  </tr>
                                ) : (
                                  recentOrders.map((row: any, index: number) => (
                                    <tr
                                      key={index}
                                       className="border-t border-border even:bg-[#F9F9F9]"
                                    >
                                      <td className="px-[15px] py-[18px] text-sm text-secgray border-r border-border whitespace-nowrap">
                                        {row.machinery_name}
                                      </td>
                                     <td className="px-[15px] py-[18px] text-sm text-secgray whitespace-nowrap  border-r border-border">
                                     {/* {formatPrice(row.price)}  */}
                                       {row.price}
                                      </td>
                                      <td className="px-[15px] py-[18px] text-sm text-secgray whitespace-nowrap  border-r border-border">
                                      {(() => {
                                        let statusClass = "bg-gray-400 text-white";

                                        if (row.status === "Processing") {
                                          statusClass = "bg-[#FFCA42] text-black";
                                        } else if (row.status === "Shipping Started") {
                                          statusClass = "bg-[#3C97FF] text-white";
                                        } else if (row.status === "In Transit") {
                                          statusClass = "bg-[#8B5CF6] text-white";
                                        } else if (row.status === "Delivered") {
                                          statusClass = "bg-[#2DBE60] text-white";
                                        } else if (row.status === "Cancelled") {
                                          statusClass = "bg-[#E53935] text-white";
                                        }

                                        return (
                                          <span
                                            className={`px-3 py-1 rounded text-[13px] inline-block ${statusClass}`}
                                          >
                                            {row.status}
                                          </span>
                                        );
                                      })()}
                                    </td>
                                    <td className="px-[15px] py-[18px] text-sm whitespace-nowrap ">
                                  {row.invoice_url ? (
                                    <button
                                      onClick={() => window.open(row.invoice_url, "_blank")}
                                      className="text-green hover:scale-110 transition cursor-pointer ml-4"
                                    >
                                      <FaFilePdf size={18} />
                                    </button>
                                  ) : (
                                    <button
                                      disabled
                                      className="text-gray-600 opacity-50 cursor-not-allowed ml-4"
                                    >
                                      <FaFilePdf size={18} />
                                    </button>
                                  )}
                                </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                     </div> )}
                  </div>
            </div>
            </div>
          </div>
      </div>
    </section>
    </>
  )
}

export default Dashboard
