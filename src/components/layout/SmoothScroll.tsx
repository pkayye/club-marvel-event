"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { setScrollInstance } from "@/lib/scroll";

/**
 * Lenis smooth scrolling, synchronised with GSAP's ticker.
 *
 * Under `prefers-reduced-motion` this mounts nothing at all — the page falls
 * back to native scrolling, which is the honest choice for a motion-sensitive
 * visitor.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    registerGsap();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      // Touch devices already have momentum; adding to it feels wrong.
      syncTouch: false,
      touchMultiplier: 1.6,
      // Intercept in-page anchors so footer links stay smooth too.
      anchors: true,
    });

    setScrollInstance(lenis);
    document.documentElement.classList.add("lenis-active");

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    // Drive Lenis from GSAP's RAF loop so both share a single frame.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.lagSmoothing(0);
    gsap.ticker.add(raf);

    // Pin offsets are wrong until webfonts and images have settled.
    const refresh = () => ScrollTrigger.refresh();
    refresh();
    window.addEventListener("load", refresh);
    void document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      setScrollInstance(null);
      document.documentElement.classList.remove("lenis-active");
    };
  }, []);

  return <>{children}</>;
}
