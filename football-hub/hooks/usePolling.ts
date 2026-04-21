"use client";

import { useEffect } from "react";

export function usePolling(callback: () => void, intervalMs = 30000) {
  useEffect(() => {
    callback();
    const timer = setInterval(callback, intervalMs);
    return () => clearInterval(timer);
  }, [callback, intervalMs]);
}

