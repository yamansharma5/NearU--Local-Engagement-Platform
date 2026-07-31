"use client";

import { useEffect, useMemo, useState } from "react";

export function useCountdown(targetDate) {
  const targetTime = useMemo(() => {
    if (!targetDate) return null;
    const time = new Date(targetDate).getTime();
    return Number.isNaN(time) ? null : time;
  }, [targetDate]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!targetTime) return undefined;

    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [targetTime]);

  if (!targetTime) {
    return { expired: false, underHour: false, label: "" };
  }

  const remaining = targetTime - now;
  if (remaining <= 0) {
    return { expired: true, underHour: true, label: "Expired" };
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const label =
    days > 0
      ? `Expires in ${days}d ${hours}h`
      : hours > 0
        ? `Expires in ${hours}h ${minutes}m`
        : minutes > 0
          ? `Expires in ${minutes}m ${seconds}s`
          : `Expires in ${seconds}s`;

  return { expired: false, underHour: remaining < 60 * 60 * 1000, label };
}
