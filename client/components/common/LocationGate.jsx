"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { LocateFixed, MapPin } from "lucide-react";
import { useLocation } from "@/hooks/useLocation";
import { useLocationStore } from "@/store/locationStore";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LocationGate({ children }) {
  const { initialized, lat, lng } = useLocation();
  const setLocation = useLocationStore((state) => state.setLocation);
  const [status, setStatus] = useState("");
  const [locating, setLocating] = useState(false);
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");

  const useCurrentLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setStatus("Location isn't supported in this browser. Enter coordinates manually.");
      return;
    }

    setLocating(true);
    setStatus("Finding your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocating(false);
      },
      () => {
        setStatus("Location permission denied. Enter coordinates manually.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [setLocation]);

  const submitManual = (event) => {
    event.preventDefault();
    const parsedLat = Number(manualLat);
    const parsedLng = Number(manualLng);
    if (Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) {
      setStatus("Enter valid numbers for latitude and longitude.");
      return;
    }
    setLocation({ lat: parsedLat, lng: parsedLng });
  };

  if (!initialized) {
    return <div className="min-h-screen bg-background" />;
  }

  if (lat == null || lng == null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          <Card className="p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h1 className="mt-4 text-lg font-semibold tracking-tight">Where are you?</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Share your location to see what&apos;s happening nearby.
            </p>

            <Button
              type="button"
              onClick={useCurrentLocation}
              disabled={locating}
              className="mt-5 h-11 w-full text-sm"
            >
              <LocateFixed className="h-4 w-4" />
              {locating ? "Locating..." : "Use my location"}
            </Button>

            {status && <p className="mt-3 text-xs text-muted-foreground">{status}</p>}

            <form onSubmit={submitManual} className="mt-5 grid grid-cols-2 gap-2 border-t border-border pt-5">
              <Input
                value={manualLat}
                onChange={(event) => setManualLat(event.target.value)}
                placeholder="Latitude"
                inputMode="decimal"
                className="h-10"
              />
              <Input
                value={manualLng}
                onChange={(event) => setManualLng(event.target.value)}
                placeholder="Longitude"
                inputMode="decimal"
                className="h-10"
              />
              <Button type="submit" variant="outline" className="col-span-2 h-10 text-sm">
                Use these coordinates
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    );
  }

  return children;
}
