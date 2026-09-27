"use client";

/**
 * Public helpers over the smooth-scroll instance.
 *
 * `SmoothScroll` installs the Lenis instance here once it exists; anything that
 * needs to jump to a section (the nav, the hero CTA, the guide) goes through
 * `scrollToId` so it stays smooth when Lenis is active and falls back to native
 * scrolling when it is not (reduced motion, or before hydration).
 */

import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setScrollInstance(next: Lenis | null) {
  instance = next;
}

export function getScrollInstance() {
  return instance;
}

/** Height of the fixed nav, so anchored headings are never covered. */
const NAV_OFFSET = -88;

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  if (instance) {
    instance.scrollTo(el, { offset: NAV_OFFSET, duration: 1.1 });
    return;
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = el.getBoundingClientRect().top + window.scrollY + NAV_OFFSET;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}
