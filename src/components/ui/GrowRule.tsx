"use client";

import { useRef } from "react";

import { gsap, registerGsap, useGSAP } from "@/lib/gsap";

/**
 * A hairline that draws itself as the block scrolls past.
 *
 * This is scroll-*linked*, so it belongs to GSAP rather than Motion: the rule's
 * length is a direct function of scroll position, scrubbed in both directions.
 *
 * The line renders at full length in static CSS, so under reduced motion — where
 * no matchMedia branch runs — it simply stays complete rather than empty.
 */
export default function GrowRule({
  className,
  tone = "red",
}: {
  className?: string;
  tone?: "red" | "ink";
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();

      const line = scope.current?.querySelector<HTMLElement>("[data-rule]");
      if (!line) return;

      const mm = gsap.matchMedia();

      /* Created inside a GSAP context, so useGSAP reverts it on unmount. */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: scope.current,
              start: "top 88%",
              end: "bottom 45%",
              scrub: true,
            },
          },
        );
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className={className}>
      <div
        data-rule
        className={`h-px origin-left ${tone === "red" ? "bg-red" : "bg-ink"}`}
      />
    </div>
  );
}
