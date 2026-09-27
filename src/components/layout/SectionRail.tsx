"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";

import { navItems } from "@/content/event";
import { scrollToId } from "@/lib/scroll";
import { useActiveSection } from "@/lib/useActiveSection";

/**
 * The persistent progress indicator: a numbered rail on desktop, a hairline
 * progress bar on mobile.
 *
 * One of the few elements that moves continuously, kept deliberately quiet so it
 * reads as instrumentation rather than decoration.
 */
export default function SectionRail() {
  const active = useActiveSection(navItems.map((item) => item.id));

  const { scrollYProgress } = useScroll();
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  const percent = useTransform(smoothed, (v) => `${Math.round(v * 100)}%`);

  return (
    <>
      {/* Desktop rail */}
      <nav
        aria-label="Page progress"
        className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
      >
        <div className="relative flex flex-col items-end gap-5 pl-4">
          <div className="absolute right-[2px] top-0 h-full w-px bg-rule" />
          <motion.div
            className="absolute right-[2px] top-0 h-full w-px origin-top bg-red"
            style={{ scaleY: smoothed }}
          />

          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToId(item.id)}
                aria-current={isActive ? "true" : undefined}
                className="pointer-events-auto group flex items-center gap-3"
              >
                <span
                  className={`label-mono transition-colors ${
                    isActive ? "text-ink" : "text-ink-soft/50 group-hover:text-ink"
                  }`}
                >
                  {item.label}
                </span>
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                    isActive ? "bg-red" : "bg-ink/25 group-hover:bg-ink/60"
                  }`}
                />
              </button>
            );
          })}

          <motion.span className="label-mono mt-1 tabular-nums text-ink-soft">
            {percent}
          </motion.span>
        </div>
      </nav>

      {/* Mobile progress hairline */}
      <div className="fixed inset-x-0 bottom-0 z-40 h-0.5 bg-rule lg:hidden">
        <motion.div
          className="h-0.5 origin-left bg-red"
          style={{ scaleX: smoothed }}
        />
      </div>
    </>
  );
}
