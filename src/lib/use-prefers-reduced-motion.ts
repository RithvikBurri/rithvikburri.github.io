"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * Tracks the user's prefers-reduced-motion setting, live. Built on
 * useSyncExternalStore (not useState+useEffect) so subscribing to this
 * browser media query never triggers a synchronous setState-in-effect,
 * and the server/first-paint value (false) is handled the same way
 * React handles any other server/client snapshot difference.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
