"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface Store {
  id: string; name: string; address: string; city: string;
  phone: string; openHours: string; lat: number; lng: number;
}

export function StoreMap({ stores }: { stores: Store[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted || stores.length === 0) return null;

  const center = stores.length > 0
    ? [stores[0].lat, stores[0].lng] as [number, number]
    : [3.139, 101.6869] as [number, number];

  return (
    <div className="rounded-3xl overflow-hidden border border-[rgba(212,180,131,0.12)] mb-8" style={{ height: 400 }}>
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }} zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {stores.map(s => (
          <Marker key={s.id} position={[s.lat, s.lng]}>
            <Popup>
              <div style={{ color: "#1A1A1A", minWidth: 180 }}>
                <p style={{ fontWeight: 700, marginBottom: 4 }}>{s.name}</p>
                <p style={{ fontSize: 12, opacity: 0.7 }}>{s.address}, {s.city}</p>
                <p style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>📞 {s.phone}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
