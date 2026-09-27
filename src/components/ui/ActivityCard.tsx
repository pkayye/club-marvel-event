"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

import { useGuide } from "@/components/guide/GuideProvider";
import type { Activity } from "@/content/event";
import { useMediaQuery } from "@/lib/useMediaQuery";

/**
 * An activity panel.
 *
 * Reactions on hover, in order of how much they cost the browser: the image
 * shifts a few pixels, the number goes black to red, a red rule expands, the text
 * lifts — all CSS transforms — and then the whole card tilts a couple of degrees
 * toward the pointer with an offset red frame behind it, like a page that was
 * printed slightly out of register.
 *
 * The tilt is the only pointer-driven part, and it switches itself off on touch
 * and under reduced motion. The host only chips in on the *first* hover, because
 * a card that talks every time is a card people stop reading.
 */

const MAX_TILT = 6;

export default function ActivityCard({
  activity,
  index = 0,
}: {
  activity: Activity;
  index?: number;
}) {
  const { say } = useGuide();
  const prefersReducedMotion = useReducedMotion();
  const pointerFine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const card = useRef<HTMLElement>(null);

  const tiltEnabled = pointerFine && !prefersReducedMotion;

  const unitX = useMotionValue(0);
  const unitY = useMotionValue(0);
  const sx = useSpring(unitX, { stiffness: 200, damping: 24, mass: 0.5 });
  const sy = useSpring(unitY, { stiffness: 200, damping: 24, mass: 0.5 });

  const rotateY = useTransform(sx, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]);
  const frameX = useTransform(sx, [-0.5, 0.5], [10, -10]);
  const frameY = useTransform(sy, [-0.5, 0.5], [10, -10]);

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!tiltEnabled || !card.current) return;
    const rect = card.current.getBoundingClientRect();
    unitX.set((event.clientX - rect.left) / rect.width - 0.5);
    unitY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = () => {
    unitX.set(0);
    unitY.set(0);
  };

  return (
    <motion.article
      ref={card}
      className="group relative flex flex-col [perspective:1200px]"
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.6,
        delay: (index % 3) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8 }}
      onPointerEnter={() => say("activity.first")}
      onPointerMove={onPointerMove}
      onPointerLeave={resetTilt}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="flex h-full flex-col"
      >
        {/* Structural rules, always present. */}
        <span className="absolute inset-x-0 top-0 h-px bg-rule" />
        {/* The one that expands on hover. */}
        <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-red transition-transform duration-500 ease-out group-hover:scale-x-100" />

        <div className="relative mt-4 aspect-4/5">
          {/* Offset red frame — the misregistration. */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 border border-red opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ x: frameX, y: frameY }}
          />

          <div className="relative h-full overflow-hidden bg-paper-dim">
            <Image
              src={activity.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <span className="label-mono absolute left-3 top-3 bg-paper px-2 py-1 text-ink-soft transition-colors duration-300 group-hover:bg-red group-hover:text-paper">
              {activity.number}
            </span>
          </div>
        </div>

        <div className="mt-5 transition-transform duration-500 ease-out group-hover:-translate-y-1">
          <h3 className="text-xl font-bold uppercase tracking-tight transition-colors duration-300 md:text-2xl">
            {activity.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft md:text-base">
            {activity.blurb}
          </p>

          <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-1">
            <div className="flex gap-2">
              <dt className="label-mono text-ink-soft/70">When</dt>
              <dd className="label-mono">{activity.time}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="label-mono text-ink-soft/70">Where</dt>
              <dd className="label-mono">{activity.location}</dd>
            </div>
          </dl>

          <ul className="mt-4 flex flex-wrap gap-2">
            {activity.tags.map((tag) => (
              <li
                key={tag}
                className="label-mono border border-rule px-2 py-1 text-ink-soft"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.article>
  );
}
