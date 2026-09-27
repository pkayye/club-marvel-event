"use client";

import { AnimatePresence, motion } from "motion/react";

import { event } from "@/content/event";
import type { GuideBubbleState } from "@/components/guide/GuideProvider";

/**
 * The guide's speech bubble.
 *
 * `role="status"` means the line is announced politely when it changes, without
 * moving focus. The bubble is decorative furniture around real text — it never
 * contains anything the visitor needs in order to use the site.
 */
export default function GuideBubble({
  current,
  nonce,
}: {
  current: GuideBubbleState;
  nonce: number;
}) {
  return (
    <div className="pointer-events-none absolute bottom-full left-0 mb-3 w-[min(19rem,calc(100vw-2.5rem))]">
      <AnimatePresence mode="wait">
        {current ? (
          <motion.div
            key={`${current.id}-${nonce}`}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="relative border border-ink/15 bg-ink px-4 py-3 text-paper shadow-[0_1px_0_0_rgba(14,14,14,0.25)]"
          >
            <p className="label-mono mb-1.5 text-red">
              {event.brand.hostLabel}:
            </p>
            <p className="text-[0.9375rem] leading-snug">{current.text}</p>

            {/* Tail, pointing down at the host. */}
            <span
              aria-hidden="true"
              className="absolute -bottom-[7px] left-6 h-3 w-3 rotate-45 border-b border-r border-ink/15 bg-ink"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
