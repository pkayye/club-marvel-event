"use client";

/**
 * GSAP setup, deliberately isolated in one module.
 *
 * Importing this from a client component guarantees the plugin is registered
 * once, in the browser only. Server components never touch it, so GSAP stays
 * out of the server bundle.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // Lenis owns the scroll position, so let it drive ScrollTrigger's updates
  // rather than fighting it with its own listeners.
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

export { gsap, ScrollTrigger, useGSAP };
