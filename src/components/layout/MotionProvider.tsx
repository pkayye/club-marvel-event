"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * `reducedMotion="user"` makes Motion drop transform and layout animations (and
 * keep opacity) whenever the visitor has asked for reduced motion, without any
 * per-component branching. The default transition encodes the site's easing so
 * every entrance shares one curve.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionConfig>
  );
}
