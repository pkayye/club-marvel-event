"use client";

import { useEffect } from "react";

import { useGuide } from "@/components/guide/GuideProvider";

/**
 * Watches how fast the visitor is actually moving and lets the host comment on
 * it. Renders nothing.
 *
 * Two design choices worth keeping:
 *
 * - Fixed sampling windows driven by a timer, not by the scroll event. A fling
 *   that ends before the window elapses produces no further scroll events, and
 *   an event-driven check would never fire on exactly the gesture it is looking
 *   for.
 * - The window only counts if a `wheel` or `touchmove` happened during it. The
 *   nav's own smooth jumps cover thousands of pixels and would otherwise read as
 *   recklessness.
 */

const WINDOW_MS = 420;
const FAST_PX = 1800;
/** Ignore movement near the top, where every page starts. */
const MIN_DEPTH = 500;

export default function ScrollWatcher() {
  const { say } = useGuide();

  useEffect(() => {
    let anchorY = window.scrollY;
    let timer = 0;
    let sawInput = false;

    const markInput = () => {
      sawInput = true;
    };

    const evaluate = () => {
      timer = 0;

      const y = window.scrollY;
      const travelled = Math.abs(y - anchorY);

      if (sawInput && travelled > FAST_PX && y > MIN_DEPTH) say("scroll.fast");

      sawInput = false;
      anchorY = y;
    };

    const onScroll = () => {
      if (timer === 0) timer = window.setTimeout(evaluate, WINDOW_MS);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", markInput, { passive: true });
    window.addEventListener("touchmove", markInput, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", markInput);
      window.removeEventListener("touchmove", markInput);
      if (timer !== 0) window.clearTimeout(timer);
    };
  }, [say]);

  return null;
}
