"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { useGuide } from "@/components/guide/GuideProvider";
import MagneticButton from "@/components/ui/MagneticButton";
import { event, navItems } from "@/content/event";
import { scrollToId } from "@/lib/scroll";

/**
 * Fixed navigation. Always present, never animated beyond a background that
 * settles in once you leave the top of the page.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { say } = useGuide();
  const firstLink = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("intro-locked");
    firstLink.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("intro-locked");
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  const nudgeAboutRegister = () => say("register.hover");

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled
            ? "border-b border-rule bg-paper/85 backdrop-blur-md"
            : "border-b border-transparent"
        }`}
      >
        <div className="shell flex h-16 items-center justify-between gap-6 md:h-20">
          <button
            type="button"
            onClick={() => go("hero")}
            className="label-mono shrink-0 text-left"
          >
            {event.brand.wordmark}
          </button>

          <nav aria-label="Sections" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => go(item.id)}
                    className="label-mono group flex items-baseline gap-2 text-ink-soft transition-colors hover:text-ink"
                  >
                    <span className="text-[0.6rem] text-ink-soft/60 transition-colors group-hover:text-red">
                      {item.number}
                    </span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <MagneticButton
              onClick={() => go("register")}
              onEngage={nudgeAboutRegister}
              className="label-mono bg-ink px-4 py-2.5 text-paper transition-colors hover:bg-red md:px-5"
            >
              {event.hero.cta.primary}
            </MagneticButton>

            <button
              type="button"
              className="label-mono md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 bg-paper pt-24 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="shell flex flex-col">
              {navItems.map((item, i) => (
                <li key={item.id} className="rule-t">
                  <button
                    ref={i === 0 ? firstLink : undefined}
                    type="button"
                    onClick={() => go(item.id)}
                    className="flex w-full items-baseline justify-between gap-6 py-4 text-left"
                  >
                    <span className="label-mono text-red">{item.number}</span>
                    <span className="flex-1 text-2xl font-bold uppercase tracking-tight">
                      {item.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
