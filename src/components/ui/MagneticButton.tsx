"use client";

import {
  useRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

import { useMediaQuery } from "@/lib/useMediaQuery";

/**
 * A button that leans toward the pointer as it approaches, then springs back.
 *
 * The movement is transform-only and capped by `strength`, so it reads as
 * magnetism rather than the button running away. It stays a real `<button>` with
 * a real focus ring, and it is inert on touch and under reduced motion.
 */
export default function MagneticButton({
  children,
  onClick,
  onEngage,
  className,
  type = "button",
  disabled,
  strength = 0.3,
  maxDistance = 16,
}: {
  children: ReactNode;
  onClick?: () => void;
  /** Fired on hover and on focus — used to cue the host. */
  onEngage?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  strength?: number;
  maxDistance?: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const pointerFine = useMediaQuery("(hover: hover) and (pointer: fine)");

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 280, damping: 22, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 280, damping: 22, mass: 0.5 });

  const enabled = pointerFine && !prefersReducedMotion && !disabled;

  const clamp = (value: number) =>
    Math.max(-maxDistance, Math.min(maxDistance, value));

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    rawX.set(clamp(dx * strength));
    rawY.set(clamp(dy * strength));
  };

  const release = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onPointerEnter={onEngage}
      onFocus={onEngage}
      onPointerMove={onPointerMove}
      onPointerLeave={release}
      onBlur={release}
      style={{ x, y }}
      whileTap={enabled ? { scale: 0.97 } : undefined}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}
