import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

// Fix Leaflet marker icons default path in Vite bundle
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom status color pins
const getMarkerIcon = (status) => {
  let color = '#059669'; // Emerald for Open
  if (status === 'In Progress') color = '#2563eb'; // Blue
  if (status === 'Resolved') color = '#16a34a'; // Green
  if (status === 'Overdue' || status === 'Escalated') color = '#dc2626'; // Red

  const svgMarker = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32" stroke="#ffffff" stroke-width="1.5">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `;

  return L.divIcon({
    html: svgMarker,
    className: 'custom-leaflet-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30],
  });
};

function Map({ wards = [], complaints = [], selectedWard, onSelectLocation, onUpvote, pinLocation }) {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const geojsonLayersRef = useRef([]);
  const complaintMarkersRef = useRef([]);
  const tempPinRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapRef.current) return;

    // Reset container if it was previously initialized (handles React StrictMode & HMR)
    if (mapRef.current._leaflet_id) {
      delete mapRef.current._leaflet_id;
    }

    if (leafletMapRef.current) {
      try {
        leafletMapRef.current.remove();
      } catch (e) {
        // ignore
      }
      leafletMapRef.current = null;
    }

    // Default to Coimbatore City Center
    const map = L.map(mapRef.current, {
      zoomControl: true,
      tap: true,
      preferCanvas: true
    }).setView([11.0168, 76.9558], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    map.on('click', (e) => {
      if (onSelectLocation) {
        onSelectLocation(e.latlng.lat, e.latlng.lng);
      }
    });

    leafletMapRef.current = map;
    setMapReady(true);

    // Invalidate size immediately so Leaflet expands to cover the full container
    const triggerInvalidate = () => {
      if (leafletMapRef.current) {
        try {
          leafletMapRef.current.invalidateSize();
        } catch (e) {}
      }
    };

    triggerInvalidate();
    const t1 = setTimeout(triggerInvalidate, 50);
    const t2 = setTimeout(triggerInvalidate, 200);
    const t3 = setTimeout(triggerInvalidate, 600);

    const handleResize = () => triggerInvalidate();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    const observer = new ResizeObserver(() => triggerInvalidate());
    observer.observe(mapRef.current);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      observer.disconnect();
      setMapReady(false);
      if (leafletMapRef.current) {
        try {
          leafletMapRef.current.remove();
        } catch (e) {}
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update Ward GeoJSON Layers & Pan to selected ward
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || !mapReady) return;

    try {
      map.invalidateSize();
    } catch (e) {}

    // Clear existing geojson layers
    geojsonLayersRef.current.forEach(layer => {
      try { map.removeLayer(layer); } catch (e) {}
    });
    geojsonLayersRef.current = [];

    if (Array.isArray(wards)) {
      wards.forEach(ward => {
        if (ward && ward.geojson_boundary) {
          try {
            const boundary = typeof ward.geojson_boundary === 'string'
              ? JSON.parse(ward.geojson_boundary)
              : ward.geojson_boundary;

            const isSelected = selectedWard && selectedWard.id === ward.id;
            const layer = L.geoJSON(boundary, {
              style: {
                color: isSelected ? '#047857' : '#0284c7',
                weight: isSelected ? 3 : 1.5,
                fillColor: isSelected ? '#059669' : '#38bdf8',
                fillOpacity: isSelected ? 0.25 : 0.1
              }
            }).addTo(map);

            layer.bindTooltip(`<b>${ward.ward_number} - ${ward.name}</b>`, { sticky: true });
            geojsonLayersRef.current.push(layer);
          } catch (e) {
            console.warn("Error rendering ward boundary:", e);
          }
        }
      });
    }

    if (selectedWard && selectedWard.centroid_lat && selectedWard.centroid_lng) {
      try {
        map.flyTo([Number(selectedWard.centroid_lat), Number(selectedWard.centroid_lng)], 14, { duration: 1.2 });
      } catch (e) {}
    }
  }, [wards, selectedWard, mapReady]);

  // Update Complaint Pins
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || !mapReady) return;

    complaintMarkersRef.current.forEach(marker => {
      try { map.removeLayer(marker); } catch (e) {}
    });
    complaintMarkersRef.current = [];

    if (Array.isArray(complaints)) {
      complaints.forEach(complaint => {
        if (complaint && complaint.location_lat && complaint.location_lng) {
          try {
            const marker = L.marker([Number(complaint.location_lat), Number(complaint.location_lng)], {
              icon: getMarkerIcon(complaint.status)
            }).addTo(map);

            const popupContent = document.createElement('div');
            popupContent.className = 'p-1 font-sans text-xs max-w-[80vw] sm:max-w-xs';
            popupContent.innerHTML = `
              <div class="font-bold text-sm text-gray-900 mb-1">${complaint.category || 'Complaint'}</div>
              <p class="text-gray-700 mb-2 line-clamp-3">${complaint.description || ''}</p>
              <div class="flex items-center justify-between text-gray-500 mb-2 border-t pt-1">
                <span class="truncate">📍 ${complaint.street || 'Coimbatore'}</span>
                <span class="px-1.5 py-0.5 rounded font-semibold text-[10px] ${
                  complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                  complaint.status === 'Overdue' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                }">${complaint.status || 'Open'}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="font-bold text-emerald-700">👍 ${complaint.vote_count || 1} Upvotes</span>
                <button id="upvote-btn-${complaint.id}" class="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1 rounded text-xs shadow-sm transition">
                  + Upvote Issue
                </button>
              </div>
            `;

            marker.bindPopup(popupContent, { maxWidth: 300 });
            
            marker.on('popupopen', () => {
              const btn = document.getElementById(`upvote-btn-${complaint.id}`);
              if (btn) {
                btn.onclick = () => {
                  if (onUpvote) onUpvote(complaint.id);
                };
              }
            });

            complaintMarkersRef.current.push(marker);
          } catch (e) {
            console.warn("Error rendering complaint pin:", e);
          }
        }
      });
    }
  }, [complaints, mapReady]);

  // Update Temporary Selected Pin
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || !mapReady) return;

    if (tempPinRef.current) {
      try { map.removeLayer(tempPinRef.current); } catch (e) {}
      tempPinRef.current = null;
    }

    if (pinLocation && pinLocation.lat && pinLocation.lng) {
      try {
        const pinIcon = L.divIcon({
          html: `
            <div class="animate-bounce text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="36" height="36">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          `,
          className: 'temp-pin',
          iconSize: [36, 36],
          iconAnchor: [18, 36]
        });

        tempPinRef.current = L.marker([Number(pinLocation.lat), Number(pinLocation.lng)], { icon: pinIcon }).addTo(map);
        map.flyTo([Number(pinLocation.lat), Number(pinLocation.lng)], 15);
      } catch (e) {
        console.warn("Error setting pin location:", e);
      }
    }
  }, [pinLocation, mapReady]);

  return (
    <div 
      ref={mapRef} 
      id="leaflet-map" 
      className="w-full h-full relative" 
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '100%',
        position: 'relative',
        zIndex: 1 
      }} 
    />
  );
}

export default Map;
