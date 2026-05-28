"use client";

import { useState } from "react";

import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Tooltip,
  Popup,
} from "react-leaflet";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { MdLocationPin } from "react-icons/md";

import "leaflet/dist/leaflet.css";

type TrackingItem = {
  id?: number;
  city: string;
  date: string;
  lat?: number;
  lng?: number;
  is_update? : boolean;
};

type Props = {
  trackingData: TrackingItem[];
};

export default function DeliveryMap({ trackingData }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  const todayDate = new Date(today);
  // ================= ROUTE =================

  const positions: [number, number][] = trackingData
    .filter((item) => item.lat != null && item.lng != null)
    .map((item) => [Number(item.lat), Number(item.lng)]);
  return (
    <div
      className="
    relative w-full
    h-[420px] sm:h-[500px]
    rounded-2xl
    border border-gray-200
    bg-white
    overflow-hidden
  "
    >
      {/* ================= SIDEBAR TOGGLE ================= */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="
    absolute top-[76px] left-[10px] z-[1000]
    w-[30px] h-[30px]
    bg-white border border-gray-300
    shadow-md rounded-[4px]
    flex items-center justify-center
    hover:bg-gray-100
    transition
  "
      >
        {sidebarOpen ? (
          <FaChevronLeft size={11} />
        ) : (
          <FaChevronRight size={11} />
        )}
      </button>

      {/* ================= SIDEBAR ================= */}
      <div
        className={`
    absolute top-3 left-12 z-[999]
    bg-white/95 backdrop-blur-md
    rounded-2xl shadow-xl
    border border-gray-200
    transition-all duration-300

    ${
      sidebarOpen
        ? "w-[170px] sm:w-[190px] opacity-100"
        : "w-0 opacity-0 border-0"
    }
  `}
      >
        <div className="p-3">
          {/* HEADER */}

          <div className="flex items-center gap-1.5 mb-3">
            <MdLocationPin size={15} className="text-blue-600" />

            <h2 className="text-[13px] font-bold text-gray-800">
              Live Tracking
            </h2>
          </div>

          {/* TRACKING LIST */}

          <div
            className="
    space-y-4
    max-h-[280px]
    overflow-y-auto
    pr-1
    custom-scrollbar
  "
          >
            {trackingData.map((item, index) => {
              if (item.lat == null || item.lng == null) {
                return null;
              }
              const itemDate = new Date(item.date);

              const isPast = itemDate < todayDate;

              const isCurrent = item.date === today;

              const isFuture = itemDate > todayDate;

              return (
                <div key={index} className="flex gap-2.5 relative">
                  {/* LINE */}

                  {index !== trackingData.length - 1 && (
                    <div
                      className={`
                        absolute left-[8px] top-[20px]
                        w-[2px] h-[46px]
                        ${
                          isCurrent
                            ? "bg-blue-500"
                            : isPast
                              ? "bg-green-500"
                              : "bg-slate-400"
                        }
                      `}
                    />
                  )}

                  {/* DOT */}

                  <div className="relative z-10">
                    <div
                      className={`
                        w-4 h-4 rounded-full border-2 border-white
                         ${
                           isCurrent
                             ? "bg-blue-500"
                             : isPast
                               ? "bg-green-500"
                               : "bg-slate-400"
                         }
                      `}
                    />

                    {/* CURRENT PULSE */}

                    {isCurrent && (
                      <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-40" />
                    )}
                  </div>

                  {/* CONTENT */}

                  <div className="min-w-0">
                    <h3 className="text-[14px] font-semibold text-gray-800 truncate">
                      {item.city}
                    </h3>

                    <p className="text-[12px] text-gray-500 mt-1">
                      {item.date}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= MAP ================= */}

      <div className="h-full">
        <MapContainer
          center={positions.length > 0 ? positions[0] : [45, -95]}
          zoom={window.innerWidth < 640 ? 2 : 4}
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          {/* MAP TILE */}

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* COMPLETED ROUTE */}
          {positions.length > 1 &&
            trackingData.map((item, index) => {
              if (index === trackingData.length - 1) {
                return null;
              }

              const currentItem = trackingData[index];
              const nextItem = trackingData[index + 1];

              const currentItemDate = new Date(currentItem.date);

              const isPast = currentItemDate < todayDate;

              const isCurrent = currentItem.date === today;

              return (
                <Polyline
                  key={index}
                  positions={[
                    [Number(currentItem.lat), Number(currentItem.lng)],
                    [Number(nextItem.lat), Number(nextItem.lng)],
                  ]}
                  pathOptions={{
                    color: isCurrent
                      ? "#3b82f6"
                      : isPast
                        ? "#22c55e"
                        : "#94a3b8",

                    weight: 5,

                    dashArray: isPast || isCurrent ? undefined : "10 10",

                    lineCap: "round",
                  }}
                />
              );
            })}
          {/* MARKERS */}

          {trackingData.map((item, index) => {
            const itemDate = new Date(item.date);

            const isPast = itemDate < todayDate;

            const isCurrent = item.date === today;

            return (
              <CircleMarker
                key={index}
                center={[Number(item.lat), Number(item.lng)]}
                radius={isCurrent ? 10 : 7}
                pathOptions={{
                  color: "#ffffff",
                  weight: 3,

                  fillColor: isCurrent
                    ? "#3b82f6"
                    : isPast
                      ? "#22c55e"
                      : "#94a3b8",

                  fillOpacity: 1,
                }}
              >
                {/* HOVER */}
                    <Tooltip
                    permanent
                    direction="top"
                    offset={[0, -10]}
                    >
                    <span className="font-semibold text-[12px]">
                        {item.city}
                    </span>
                    </Tooltip>

                {/* POPUP */}

                <Popup>
                  <div className="min-w-[140px]">
                    <h3 className="font-bold text-[14px] mb-1">{item.city}</h3>

                    <p className="text-[12px] text-gray-600">{item.date}</p>

                    <div className="mt-2 text-[11px] text-gray-500">
                      Lat: {item.lat}
                      <br />
                      Lng: {item.lng}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
