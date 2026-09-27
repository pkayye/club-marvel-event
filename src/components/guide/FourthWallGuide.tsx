"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

import GuideBubble from "@/components/guide/GuideBubble";
import { useGuide } from "@/components/guide/GuideProvider";
import { event } from "@/content/event";

/**
 * The site's unreliable host.
 *
 * He has one job: comment at a handful of moments, never at all of them. He sits
 * outside the document flow, is `pointer-events-none` except for his own hit
 * area, and steps aside once the footer takes over. Nothing he does can shift
 * layout, cover a form field, or intercept a click meant for the page.
 *
 * Three poses, all the same canvas and aspect ratio, so swapping between them
 * cannot move a single pixel of layout:
 *   idle   — arms folded, minding his own business
 *   talk   — mid-sentence, while a bubble is up
 *   point  — aimed at the register button once that section is close
 */

/** Cursor parallax is deliberately tiny — this should read as a lean, not a chase. */
const PARALLAX = 0.035;

const POSES = {
  idle: { src: "/guide/host-idle.svg", rotate: -3, scale: 1 },
  talk: { src: "/guide/host-talk.svg", rotate: 2, scale: 1.03 },
  point: { src: "/guide/host-point.svg", rotate: 0, scale: 1.03 },
} as const;

type Pose = keyof typeof POSES;

export default function FourthWallGuide() {
  const { current, nonce, say } = useGuide();
  const prefersReducedMotion = useReducedMotion();
  const [inFooter, setInFooter] = useState(false);
  const [registerNear, setRegisterNear] = useState(false);
  const [hovered, setHovered] = useState(false);
  const pokeCount = useRef(0);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 120, damping: 20, mass: 0.6 });
  const y = useSpring(pointerY, { stiffness: 120, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (prefersReducedMotion) return;

    const onPointerMove = (e: PointerEvent) => {
      pointerX.set((e.clientX - window.innerWidth / 2) * PARALLAX);
      pointerY.set((e.clientY - window.innerHeight / 2) * PARALLAX);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [pointerX, pointerY, prefersReducedMotion]);

  /* He steps out of the way when the finale owns the screen. */
  useEffect(() => {
    const footer = document.getElementById("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInFooter(entry.isIntersecting),
      { threshold: 0.4 },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  /* And he starts pointing once registration is what you are looking at. */
  useEffect(() => {
    const register = document.getElementById("register");
    if (!register) return;

    const observer = new IntersectionObserver(
      ([entry]) => setRegisterNear(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(register);
    return () => observer.disconnect();
  }, []);

  const speaking = current !== null;
  const hidden = inFooter && !speaking;

  const pose: Pose = speaking ? "talk" : registerNear ? "point" : "idle";
  const active = POSES[pose];

  const handlePoke = () => {
    // Clicking the pointing pose gets an answer about the thing he is pointing
    // at. Otherwise the first click gets the standing line and every one after
    // that gets him defensive.
    if (pose === "point") {
      say("register.nudge");
      return;
    }

    pokeCount.current += 1;
    say(pokeCount.current > 1 ? "idle.poke" : "idle");
  };

  return (
    <div className="pointer-events-none fixed bottom-6 left-4 z-40 md:bottom-10 md:left-8">
      <motion.div
        animate={{ y: hidden ? 96 : speaking ? 0 : 22, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div style={{ x, y }} className="relative">
          {/* Bubble sits above him; click-through so it never blocks the page. */}
          <GuideBubble current={current} nonce={nonce} />

          <div className="pointer-events-auto flex items-end gap-2">
            <motion.button
              type="button"
              aria-label={`${event.brand.hostLabel}, the site's host — hear a line`}
              onPointerEnter={() => setHovered(true)}
              onPointerLeave={() => setHovered(false)}
              onFocus={() => setHovered(true)}
              onBlur={() => setHovered(false)}
              onClick={handlePoke}
              animate={{
                rotate: hovered ? active.rotate - 3 : active.rotate,
                scale: hovered ? active.scale * 1.05 : active.scale,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="block h-24 w-auto origin-bottom md:h-32"
            >
              <Image
                src={active.src}
                alt=""
                width={320}
                height={520}
                /* Fixed to the bottom of the viewport, so it always paints early. */
                loading="eager"
                unoptimized
                className="h-full w-auto select-none"
              />
            </motion.button>

            <span
              aria-hidden="true"
              className="label-mono mb-2 hidden text-ink-soft/70 md:block"
            >
              {event.brand.hostLabel}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
