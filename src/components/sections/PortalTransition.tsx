"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { event } from "@/content/event";

/**
 * The red portal between the hero and the brief.
 *
 * A scroll-linked clip-path that opens from a slit to full bleed — cheap, since
 * clip-path is composited, and it gives the page one unmistakable "you are
 * entering" moment without moving a single layout box.
 */
export default function PortalTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0.16, 0.52],
    ["inset(0% 50% 0% 50%)", "inset(0% 0% 0% 0%)"],
  );
  const contentOpacity = useTransform(scrollYProgress, [0.42, 0.58], [0, 1]);

  return (
    <div ref={ref} className="relative h-[62svh] bg-ink md:h-[72svh]">
      <motion.div
        className="absolute inset-0 overflow-hidden bg-red"
        style={
          prefersReducedMotion
            ? { clipPath: "inset(0% 0% 0% 0%)" }
            : { clipPath }
        }
      />

      <motion.div
        className="relative flex h-full flex-col items-center justify-center gap-4 px-6 text-center"
        style={prefersReducedMotion ? undefined : { opacity: contentOpacity }}
      >
        <p className="label-mono text-paper/70">{event.brand.edition}</p>
        <p className="display-title text-paper">Enter</p>
        <p className="label-mono text-paper/80">
          {event.hero.metadata[1]?.value ?? "Campus"}
        </p>
      </motion.div>
    </div>
  );
}
