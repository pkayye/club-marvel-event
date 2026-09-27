import type { ReactNode } from "react";

import Reveal from "@/components/ui/Reveal";

/**
 * Every section shares one skeleton: numbered header, hairline rule, heading,
 * and the same vertical rhythm. The repetition is what makes the page read as a
 * single document rather than a stack of slides.
 */
export default function Section({
  id,
  number,
  title,
  kicker,
  lede,
  children,
  className = "",
}: {
  id: string;
  number: string;
  title: string;
  kicker?: string;
  lede?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`anchor-offset relative ${className}`}>
      <div className="shell py-20 md:py-28 lg:py-36">
        <Reveal>
          <header className="rule-t pt-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
              <span className="label-mono text-red">{number}</span>
              {kicker ? (
                <span className="label-mono text-ink-soft">{kicker}</span>
              ) : null}
            </div>
            <h2 className="section-title mt-5 max-w-[16ch]">{title}</h2>
            {lede ? (
              <p className="text-lead mt-5 max-w-2xl text-ink-soft">{lede}</p>
            ) : null}
          </header>
        </Reveal>

        <div className="mt-12 md:mt-16">{children}</div>
      </div>
    </section>
  );
}
