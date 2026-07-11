"use client";

import "leaflet/dist/leaflet.css";
import { divIcon } from "leaflet";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import api from "@/lib/api";
import { useLocationStore } from "@/store/locationStore";
import { getPostTypeColor } from "@/lib/postTypeColors";

const PULSING_TYPES = new Set(["OFFER", "EVENT"]);

const USER_ICON = divIcon({
  className: "nearby-div-icon",
  html: '<span class="nearby-user-pin"><span></span></span>',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -16],
});

function createPostIcon(meta, pulsing) {
  return divIcon({
    className: "nearby-div-icon",
    html: `
      <span class="nearby-map-pin" style="--pin-color:${meta.marker}">
        ${pulsing ? '<span class="nearby-pin-pulse"></span>' : ""}
        <span class="nearby-pin-body"></span>
        <span class="nearby-pin-dot"></span>
      </span>
    `,
    iconSize: [38, 46],
    iconAnchor: [19, 42],
    popupAnchor: [0, -38],
  });
}

export default function NearbyMap() {
  const lat = useLocationStore((state) => state.lat);
  const lng = useLocationStore((state) => state.lng);
  const radius = useLocationStore((state) => state.radius);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (lat == null || lng == null) return;
    let cancelled = false;

    api.get("/posts/nearby", { params: { lat, lng, radius } }).then((response) => {
      if (!cancelled) setPosts(response.data.data.posts);
    });

    return () => {
      cancelled = true;
    };
  }, [lat, lng, radius]);

  if (lat == null || lng == null) return null;

  return (
    <div className="h-[70vh] overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <MapContainer center={[lat, lng]} zoom={14} className="h-full w-full" scrollWheelZoom>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={USER_ICON}>
          <Popup>You are here</Popup>
        </Marker>
        {posts.map((post) => {
          const meta = getPostTypeColor(post.type);
          const pulsing = PULSING_TYPES.has(post.type);
          return (
            <Marker key={post.id} position={[post.lat, post.lng]} icon={createPostIcon(meta, pulsing)}>
              <Popup>
                <div className="font-sans text-sm">
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: meta.marker }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.marker }} />
                    {meta.label}
                  </span>
                  <p className="mt-1 font-semibold text-foreground">{post.businessName}</p>
                  <p className="text-muted-foreground">{post.title}</p>
                  <Link href={`/business/${post.businessId}`} className="mt-1 inline-block font-medium text-primary underline underline-offset-2">
                    View business
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
