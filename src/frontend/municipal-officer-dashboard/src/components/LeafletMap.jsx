import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Create custom colored marker icons for clean UI presentation
const createCustomIcon = (status, priority) => {
  let color = "#ef4444"; // Red default
  if (priority === "P2") color = "#f97316"; // Orange
  if (priority === "P3") color = "#eab308"; // Yellow
  if (priority === "P4") color = "#22c55e"; // Green
  if (status === "Completed") color = "#10b981";

  const svgHtml = `
    <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.16344 0 0 7.16344 0 16C0 26.5 16 40 16 40C16 40 32 26.5 32 16C32 7.16344 24.8366 0 16 0Z" fill="${color}"/>
      <circle cx="16" cy="14" r="7" fill="white"/>
      <circle cx="16" cy="14" r="4" fill="${color}"/>
    </svg>
  `;

  return L.divIcon({
    html: svgHtml,
    className: "custom-leaflet-pin",
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -36]
  });
};

// Component to dynamically re-center map when props change
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 15);
    }
  }, [lat, lng, map]);
  return null;
};

export default function LeafletMap({ lat = 11.0168, lng = 76.9558, address = "", title = "", priority = "P1", status = "Pending" }) {
  const position = [lat, lng];
  const customIcon = createCustomIcon(status, priority);

  return (
    <div className="w-full h-48 md:h-56 rounded-lg overflow-hidden border border-slate-200 shadow-xs relative">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            <div className="p-1 max-w-xs text-xs">
              <strong className="block text-slate-900 text-sm mb-1">{title}</strong>
              <p className="text-slate-600 mb-1">{address}</p>
              <span className="inline-block px-1.5 py-0.5 rounded font-bold text-[10px] text-white bg-slate-800">
                {priority} • {status}
              </span>
            </div>
          </Popup>
        </Marker>
        <RecenterMap lat={lat} lng={lng} />
      </MapContainer>
    </div>
  );
}
