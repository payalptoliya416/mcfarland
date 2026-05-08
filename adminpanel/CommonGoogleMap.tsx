"use client";

import {
  GoogleMap,
  DirectionsRenderer,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import { useRef, useState } from "react";
import { IoClose } from "react-icons/io5";

type MarkerType = {
  city?: string;
  date?: string;
  lat: number;
  lng: number;
};

type Props = {
  isLoaded: boolean;
  directions?: google.maps.DirectionsResult | null;
  markers: MarkerType[];
  height?: string;
  showTrackingPanel?: boolean;
  children?: React.ReactNode;
};

export default function CommonGoogleMap({
  isLoaded,
  directions,
  markers,
  height = "100%",
  showTrackingPanel = false,
  children,
}: Props) {
  const mapRef =
  useRef<google.maps.Map | null>(null);
  const [showTracking, setShowTracking] =
  useState(true);
  const [
    selectedMarker,
    setSelectedMarker,
  ] = useState<MarkerType | null>(
    null
  );

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading Map...
      </div>
    );
  }

  return (
    <div
      className="relative w-full"
      style={{ height }}
    >
      {children}

     {showTrackingPanel && (
    <>
      <button
        onClick={() =>
          setShowTracking(!showTracking)
        }
        className="absolute top-3 left-3 md:top-0 md:left-1 z-20 w-10 h-10 rounded-full bg-white shadow-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
      >
        {showTracking ? (
          <IoClose
            size={18}
            className="text-gray-700"
          />
        ) : (
          <div className="space-y-[3px]">
            <div className="w-4 h-[2px] bg-gray-700 rounded-full" />
            <div className="w-4 h-[2px] bg-gray-700 rounded-full" />
            <div className="w-4 h-[2px] bg-gray-700 rounded-full" />
          </div>
        )}
      </button>

      <div className="absolute z-10 top-3 left-3 md:top-7 md:left-4">
        <div className={`rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-2xl p-3 transition-all duration-300 w-[220px] md:w-[240px] ${showTracking ? "opacity-100 visible translate-x-0" : "opacity-0 invisible -translate-x-5"}`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="text-[13px] text-gray-500 font-medium">
              Live Shipment Tracking
            </div>
          </div>
          <div className="mt-3 space-y-3 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
            {markers.map((item, index) => (
              <div
                key={index}
                className="flex gap-3 relative"
              >
                {index !== markers.length - 1 && (
                  <div className="absolute left-[7px] top-5 w-[2px] h-[38px] bg-gray-200" />
                )}
                  <div
                className="mt-1 w-[14px] h-[14px] rounded-full shrink-0 border-2 border-white shadow"
                />
                <div className="pb-5 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[13px] font-semibold text-gray-800">
                      {item.city}
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-[2px]">
                    {item.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </>
    )}

      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "100%",
          borderRadius: "16px",
        }}
        onLoad={(map) => {
          mapRef.current = map;

          if (markers.length > 0) {

            const bounds =
              new google.maps.LatLngBounds();

            markers.forEach((marker) => {
              bounds.extend({
                lat: marker.lat,
                lng: marker.lng,
              });
            });

            map.fitBounds(bounds, 120);

            setTimeout(() => {
              map.panBy(
                showTrackingPanel
                  ? 120
                  : 0,
                0
              );
            }, 300);

          }
        }}
        options={{
          fullscreenControl: true,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >

        {directions && (

         <DirectionsRenderer
          directions={directions}
          options={{
            suppressMarkers: true,
            polylineOptions: {
              strokeColor:"#2563EB",
              strokeWeight: 4,
            },
          }}
        />

        )}

        {markers.map((marker, index) => (
          <MarkerF
            key={index}
            position={{
              lat: marker.lat,
              lng: marker.lng,
            }}
            onClick={() =>
              setSelectedMarker(marker)
            }
            icon={{
              path:
                google.maps.SymbolPath
                  .CIRCLE,

              scale:
                index ===
                markers.length - 1
                  ? 9
                  : 7,

              fillColor:
               "#F59E0B",

              fillOpacity: 1,
              strokeColor: "#fff",
              strokeWeight: 2,
            }}
          />

        ))}

        {selectedMarker && (
          <InfoWindowF
            position={{
              lat: selectedMarker.lat,
              lng: selectedMarker.lng,
            }}
            onCloseClick={() =>
              setSelectedMarker(null)
            }
          >
            <div className="min-w-[160px]">
              <div className="font-semibold">
                {selectedMarker.city}
              </div>
              <div className="text-sm mt-1">
                {selectedMarker.date}
              </div>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </div>
  );
}