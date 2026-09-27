"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * The default entrance: a short rise and fade, once, when the block is a
 * quarter of the way into view.
 *
 * Section entrances are the "frequently animated" tier — cheap, consistent, and
 * identical everywhere. Transform and opacity only, so nothing here triggers
 * layout.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 48,
  amount = 0.25,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
