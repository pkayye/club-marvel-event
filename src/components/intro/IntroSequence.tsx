"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, animate } from "motion/react";

import { useGuide } from "@/components/guide/GuideProvider";
import { useIntro } from "@/components/intro/IntroProvider";
import { DIALOGUE } from "@/content/dialogue";
import { event } from "@/content/event";

/**
 * The loading interruption — the one thing on this site that happens exactly
 * once per session.
 *
 * Sequence: the counter climbs, stalls, the host complains, the host cuts the
 * overlay open, the overlay splits, the site is revealed.
 *
 * Two deliberate properties:
 *
 * 1. The initial render is identical on the server and the client (a visible
 *    loading screen), so there is no hydration mismatch. The effect then either
 *    plays it out or dismisses it.
 * 2. The effect is written to survive a StrictMode double-invoke — setup, full
 *    teardown, setup again — and a watchdog guarantees the overlay can never
 *    strand a visitor on a dead loading screen.
 */

const SESSION_KEY = "mc-intro-played";

const T = {
  progressToStallMs: 950,
  interruptAt: 1250,
  slashAt: 2900,
  revealAt: 3250,
  splitAt: 3450,
  doneAt: 4050,
} as const;

/** Absolute ceiling. Whatever happens above, the overlay is gone by here. */
const HARD_DEADLINE_MS = 7000;

const STALL_AT = 62;

type Phase = "loading" | "interrupt" | "slash" | "split" | "hidden";

export default function IntroSequence() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [percent, setPercent] = useState(0);
  const { say, setIntroActive } = useGuide();
  const { markReady } = useIntro();

  const finished = useRef(false);

  const release = () => {
    document.documentElement.classList.remove("intro-locked");
  };

  /* Watchdog: the overlay is decorative, the page is not. It always yields. */
  useEffect(() => {
    const watchdog = window.setTimeout(() => {
      if (finished.current) return;
      finished.current = true;
      setPhase("hidden");
      setIntroActive(false);
      release();
      markReady();
    }, HARD_DEADLINE_MS);

    return () => window.clearTimeout(watchdog);
  }, [markReady, setIntroActive]);

  useEffect(() => {
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, ms));
    };
    const clearAll = () => timers.forEach(window.clearTimeout);

    const alreadyPlayed = (() => {
      try {
        return window.sessionStorage.getItem(SESSION_KEY) === "1";
      } catch {
        return false;
      }
    })();

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Repeat visits and motion-sensitive visitors go straight to the site.
    // Deferred by a tick: state changes belong in a callback, not the effect
    // body, and it lets the overlay paint exactly once before it goes.
    if (alreadyPlayed || reduceMotion) {
      at(0, () => {
        finished.current = true;
        setPercent(100);
        setPhase("hidden");
        markReady();
      });
      return clearAll;
    }

    setIntroActive(true);
    document.documentElement.classList.add("intro-locked");

    // 1. The counter climbs and stalls short of the finish.
    const climb = animate(0, STALL_AT, {
      duration: T.progressToStallMs / 1000,
      ease: "linear",
      onUpdate: setPercent,
    });

    // 2. The host interrupts.
    at(T.interruptAt, () => setPhase("interrupt"));

    // 3. The slash, and the counter finally completes.
    at(T.slashAt, () => {
      setPhase("slash");
      animate(STALL_AT, 100, {
        duration: 0.24,
        ease: "easeOut",
        onUpdate: setPercent,
      });
    });

    // 4. The reveal line lands on the real site, not the overlay.
    at(T.revealAt, () => say("intro.reveal"));

    // 5. The overlay splits and leaves.
    at(T.splitAt, () => setPhase("split"));

    at(T.doneAt, () => {
      finished.current = true;
      setPhase("hidden");
      setIntroActive(false);
      release();
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* Private mode: replaying the intro is not a problem. */
      }
      markReady();
    });

    return () => {
      climb.stop();
      clearAll();
      release();
    };
  }, [markReady, say, setIntroActive]);

  const visible = phase !== "hidden";
  const isSlash = phase === "slash" || phase === "split";
  const isSplit = phase === "split";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          aria-hidden="true"
          className="fixed inset-0 z-[100] overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Two paper panels that part along the cut. */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-paper"
            animate={{ y: isSplit ? "-102%" : "0%" }}
            transition={{ duration: 0.62, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-paper"
            animate={{ y: isSplit ? "102%" : "0%" }}
            transition={{ duration: 0.62, ease: [0.76, 0, 0.24, 1] }}
          />

          {/* Readout. */}
          <motion.div
            className="absolute inset-0 flex flex-col justify-between p-6 md:p-10"
            animate={{ opacity: isSlash ? 0 : 1 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-start justify-between gap-6">
              <p className="label-mono">{event.brand.wordmark}</p>
              <p className="label-mono text-ink-soft">{event.brand.edition}</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-end justify-between gap-6">
                <p className="label-mono text-ink-soft">
                  {phase === "interrupt"
                    ? "INTERRUPT DETECTED"
                    : "CALIBRATING MULTIVERSE..."}
                </p>
                <p className="font-mono text-4xl tabular-nums md:text-6xl">
                  {String(Math.round(percent)).padStart(2, "0")}
                  <span className="text-ink-soft">%</span>
                </p>
              </div>

              {/* Progress rule. */}
              <div className="h-px w-full bg-rule">
                <motion.div
                  className="h-px origin-left bg-red"
                  style={{ scaleX: percent / 100 }}
                />
              </div>

              {/* The host's complaint, spoken from inside the overlay. */}
              <AnimatePresence>
                {phase !== "loading" ? (
                  <motion.p
                    key="interrupt"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-xl text-balance text-lg md:text-2xl"
                  >
                    <span className="label-mono mr-2 text-red">
                      {event.brand.hostLabel}:
                    </span>
                    {DIALOGUE["intro.interrupt"].text}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* The cut itself. */}
          <motion.div
            className="pointer-events-none absolute inset-x-[-10%] top-1/2 origin-left -translate-y-1/2 rotate-[-1.5deg]"
            initial={false}
            animate={{ scaleX: isSlash ? 1 : 0, opacity: isSlash ? 1 : 0 }}
            transition={{ duration: 0.22, ease: [0.9, 0, 1, 1] }}
          >
            <div className="h-8 bg-red md:h-10" />
            <div className="h-px bg-ink" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
