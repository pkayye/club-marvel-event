"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

import { useMediaQuery } from "@/lib/useMediaQuery";

/**
 * A small red reticle that trails the pointer and opens up over anything
 * interactive.
 *
 * Pointer-fine devices only, and never under reduced motion. It is purely
 * decorative: `aria-hidden`, click-through, and it never replaces the real
 * cursor.
 */

const INTERACTIVE = "a, button, input, select, textarea, label, [data-cursor]";

export default function CursorReticle() {
  const prefersReducedMotion = useReducedMotion();
  const pointerFine = useMediaQuery("(hover: hover) and (pointer: fine)");

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 420, damping: 34, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 420, damping: 34, mass: 0.4 });

  const [overTarget, setOverTarget] = useState(false);
  const overTargetRef = useRef(false);

  const enabled = pointerFine && !prefersReducedMotion;

  useEffect(() => {
    if (!enabled) return;

    const onPointerMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);

      // Only re-render when the answer actually changes — this fires per frame.
      // The target is not always an Element: a pointermove dispatched at the
      // window, or over a text node's boundary, has no `closest`.
      const target = event.target;
      const next = target instanceof Element && target.closest(INTERACTIVE) !== null;
      if (next !== overTargetRef.current) {
        overTargetRef.current = next;
        setOverTarget(next);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden lg:block"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-red"
        animate={{
          width: overTarget ? 52 : 16,
          height: overTarget ? 52 : 16,
          opacity: overTarget ? 1 : 0.55,
          borderWidth: overTarget ? 1 : 2,
        }}
        transition={{ type: "spring", stiffness: 340, damping: 26 }}
      />
    </motion.div>
  );
}
