"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

import { event } from "@/content/event";

/**
 * The band that runs across the page and changes its mind.
 *
 * It drifts continuously on its own, but scroll velocity feeds into its speed
 * and flips its direction — scroll up and it travels left, scroll down and it
 * travels right. That coupling is what makes the page feel like one continuous
 * surface rather than stacked sections.
 *
 * The whole band is `aria-hidden`: it repeats facts that are already in the
 * document, so reading it twice would just be noise.
 */

const COPIES = 4;

function wrap(min: number, max: number, value: number) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

export default function Ticker({
  tone = "paper",
  baseVelocity = 2.4,
}: {
  tone?: "paper" | "ink";
  baseVelocity?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const direction = useRef(1);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(
    smoothVelocity,
    [-1200, 0, 1200],
    [-4, 0, 4],
    { clamp: false },
  );

  // x is a percentage of the element's own width, so wrapping by one copy's
  // worth (100 / COPIES) loops the band seamlessly.
  const x = useTransform(baseX, (value) => `${wrap(-100 / COPIES, 0, value)}%`);

  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion) return;

    let moveBy = direction.current * baseVelocity * (delta / 1000);

    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    moveBy += moveBy * Math.abs(factor);

    baseX.set(baseX.get() + moveBy);
  });

  const inverted = tone === "ink";

  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden border-y py-4 select-none ${
        inverted
          ? "border-white/15 bg-ink text-paper"
          : "border-rule bg-paper text-ink"
      }`}
    >
      {/*
        `shrink-0` all the way down is load-bearing. As flex items, the track,
        the copies and the labels would otherwise shrink to fit the band — and a
        label with `flex` display collapses to its own horizontal padding, so
        every phrase would pile up on top of the next one.
      */}
      <motion.div
        className="moving flex w-max shrink-0 whitespace-nowrap"
        style={{ x }}
      >
        {Array.from({ length: COPIES }).map((_, copy) => (
          <span key={copy} className="flex shrink-0">
            {event.ticker.map((item) => (
              <span
                key={`${copy}-${item}`}
                className="label-mono flex shrink-0 items-center gap-6 px-6 md:gap-10 md:px-10"
              >
                {item}
                <span className="inline-block h-2 w-2 shrink-0 bg-red" />
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
