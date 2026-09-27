"use client";

import { motion } from "motion/react";

import { useGuide } from "@/components/guide/GuideProvider";
import { useIntro } from "@/components/intro/IntroProvider";
import MagneticButton from "@/components/ui/MagneticButton";
import { event } from "@/content/event";
import { scrollToId } from "@/lib/scroll";

/**
 * The hero. Always present, and it holds the only large piece of animation the
 * visitor sees before they have chosen to interact.
 *
 * The title animates per line, never per letter: letter-by-letter is flashy and
 * makes the visitor wait to read the name of the event.
 */
export default function Hero() {
  const { ready } = useIntro();
  const { say } = useGuide();

  const enter = { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section
      id="hero"
      className="anchor-offset relative flex min-h-[92svh] flex-col justify-end pb-12 pt-28 md:pb-16 md:pt-32"
    >
      <div className="shell">
        {/* Event metadata — the facts the visitor actually needs, first. */}
        <motion.div
          className="rule-t flex flex-wrap justify-between gap-x-10 gap-y-2 pt-4"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {event.hero.metadata.map((item) => (
            <p key={item.label} className="label-mono text-ink-soft">
              {item.label}
              <span className="ml-2 text-ink">{item.value}</span>
            </p>
          ))}
        </motion.div>

        <motion.p
          className="label-mono mt-10 flex items-center gap-3 text-ink-soft md:mt-14"
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ ...enter, delay: 0.2 }}
        >
          <span className="inline-block h-1.5 w-1.5 shrink-0 bg-red" />
          {event.brand.presents}
        </motion.p>

        <h1 className="display-title mt-4">
          {event.hero.lines.map((line, index) => (
            <span key={line} className="block overflow-hidden py-[0.06em]">
              <motion.span
                className="hero-line block"
                initial={{ y: "112%" }}
                animate={ready ? { y: "0%" } : { y: "112%" }}
                transition={{ ...enter, delay: 0.05 * index }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          className="rule-t mt-10 grid-12 gap-y-8 pt-6 md:mt-14"
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ ...enter, delay: 0.35 }}
        >
          <p className="text-lead col-span-4 max-w-xl text-ink-soft md:col-span-6">
            {event.hero.lede}
          </p>

          <div className="col-span-4 flex flex-wrap items-center gap-3 md:col-span-6 md:justify-end">
            <MagneticButton
              onClick={() => scrollToId("register")}
              onEngage={() => say("register.hover")}
              className="label-mono bg-ink px-6 py-4 text-paper transition-colors hover:bg-red"
            >
              {event.hero.cta.primary}
            </MagneticButton>
            <MagneticButton
              onClick={() => scrollToId("schedule")}
              strength={0.2}
              className="label-mono border border-rule-strong px-6 py-4 transition-colors hover:border-ink"
            >
              {event.hero.cta.secondary}
            </MagneticButton>
          </div>
        </motion.div>

        <motion.p
          className="label-mono mt-12 flex items-center gap-3 text-ink-soft md:mt-16"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <span className="inline-block h-px w-10 bg-red" />
          {event.hero.scrollCue}
        </motion.p>
      </div>
    </section>
  );
}
