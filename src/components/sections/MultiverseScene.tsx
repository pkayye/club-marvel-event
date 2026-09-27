"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

import { event } from "@/content/event";
import { PANEL_ASIDES } from "@/content/dialogue";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { useMediaQuery } from "@/lib/useMediaQuery";

/**
 * The one genuinely scroll-linked scene on the site.
 *
 * Desktop, motion allowed: the wrapper pins, the track translates horizontally,
 * and the red rule underneath fills as you go. The panels themselves are rendered
 * by the server and handed in as children, so the content exists in the HTML
 * whether or not GSAP ever runs.
 *
 * Everywhere else — narrow screens, reduced motion, JS disabled — the same markup
 * degrades to a snap-scrolling row you can swipe. No pinning, no hijacking, and
 * nothing trapped off-screen.
 */
export default function MultiverseScene({
  children,
  panels,
  count,
}: {
  children: ReactNode;
  panels: { title: string }[];
  count: number;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const progressBar = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const prefersReducedMotion = useReducedMotion();
  const pinned = isDesktop && !prefersReducedMotion;

  useGSAP(
    () => {
      registerGsap();
      if (!pinned) return;

      const root = wrapper.current;
      const track = root?.querySelector<HTMLElement>("[data-track]");
      const scroller = root?.querySelector<HTMLElement>("[data-scroller]");
      if (!root || !track || !scroller) return;

      const mm = gsap.matchMedia();

      /* Created inside a GSAP context, so useGSAP reverts it on unmount. */
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const travel = () =>
            Math.max(0, track.scrollWidth - window.innerWidth);

          // The markup ships scrollable, which is the safe default: if this
          // scene never runs, every panel is still reachable by swiping or
          // scrolling. Only once the tween is genuinely in charge do we clip
          // the row, and the cleanup hands scrolling straight back.
          scroller.style.overflowX = "hidden";

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: () => `+=${travel()}`,
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const next = Math.min(
                  count - 1,
                  Math.floor(self.progress * count),
                );
                setActive((prev) => (prev === next ? prev : next));
              },
            },
          });

          timeline.to(track, { x: () => -travel() }, 0);

          if (progressBar.current) {
            timeline.fromTo(
              progressBar.current,
              { scaleX: 0 },
              { scaleX: 1 },
              0,
            );
          }

          return () => {
            scroller.style.overflowX = "";
            setActive(0);
          };
        },
      );
    },
    { scope: wrapper, dependencies: [pinned, count] },
  );

  /* On the swipeable fallback there is no scrub, so track the row's own scroll. */
  useEffect(() => {
    if (pinned) return;

    const root = wrapper.current;
    const scroller = root?.querySelector<HTMLElement>("[data-scroller]");
    if (!scroller) return;

    const onScroll = () => {
      const items = Array.from(
        scroller.querySelectorAll<HTMLElement>("[data-panel]"),
      );
      const centre = scroller.scrollLeft + scroller.clientWidth / 2;
      let closest = 0;
      let best = Number.POSITIVE_INFINITY;

      items.forEach((item, index) => {
        const distance = Math.abs(item.offsetLeft + item.clientWidth / 2 - centre);
        if (distance < best) {
          best = distance;
          closest = index;
        }
      });

      setActive((prev) => (prev === closest ? prev : closest));
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [pinned, count]);

  const aside = PANEL_ASIDES[active % PANEL_ASIDES.length];
  const total = String(count).padStart(2, "0");

  return (
    <div ref={wrapper} className="relative h-[100svh] overflow-hidden">
      <div className="flex h-full flex-col justify-between py-8 md:py-12">
        <div className="shell flex items-start justify-between gap-6">
          <p className="label-mono text-paper/50">
            {event.brand.edition} · File 001
          </p>
          <p className="label-mono tabular-nums text-red">
            {String(active + 1).padStart(2, "0")} / {total}
          </p>
        </div>

        <div
          data-scroller
          className="relative flex flex-1 snap-x snap-mandatory items-center overflow-x-auto overflow-y-hidden"
        >
          <div
            data-track
            className="moving flex w-max items-stretch gap-6 px-5 md:gap-10 md:px-12"
          >
            {children}
          </div>
        </div>

        <div className="shell">
          <p
            className="label-mono max-w-3xl text-paper/70"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="text-red">{event.brand.hostLabel}:</span> {aside}
          </p>

          <div className="mt-5 h-px w-full bg-white/15">
            <div ref={progressBar} className="h-px origin-left bg-red" />
          </div>

          {/* Swipeable fallback needs a labelled position, not just a bar. */}
          {!pinned ? (
            <p className="label-mono mt-3 text-paper/40">
              {panels[active]?.title ?? ""} — swipe for more
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
