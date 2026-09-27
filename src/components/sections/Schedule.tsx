"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { useGuide } from "@/components/guide/GuideProvider";
import Section from "@/components/layout/Section";
import { event } from "@/content/event";

/**
 * The schedule, framed as a classified file.
 *
 * A plain accordion built on real buttons, so it works with a keyboard, a screen
 * reader and JavaScript-triggered height animation alike. The host comments on
 * the first open only.
 */
export default function Schedule() {
  const [openId, setOpenId] = useState<string | null>(
    event.schedule[0]?.id ?? null,
  );
  const { say } = useGuide();

  const toggle = (id: string) => {
    setOpenId((current) => {
      const next = current === id ? null : id;
      if (next !== null) say("schedule.open");
      return next;
    });
  };

  return (
    <Section
      id="schedule"
      number="04"
      title="Schedule"
      kicker="Two days · 14 sessions"
      lede="Reporting opens thirty minutes before the first session each day. Bring your college ID."
    >
      <div className="border-t border-rule">
        {event.schedule.map((day) => {
          const open = openId === day.id;
          const panelId = `schedule-panel-${day.id}`;
          const buttonId = `schedule-trigger-${day.id}`;

          return (
            <div key={day.id} className="border-b border-rule">
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => toggle(day.id)}
                  className="group flex w-full items-baseline justify-between gap-6 py-5 text-left transition-colors hover:text-red md:py-7"
                >
                  <span className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                    <span className="text-xl font-bold uppercase tracking-tight md:text-3xl">
                      {day.day}
                    </span>
                    <span className="label-mono text-ink-soft">{day.date}</span>
                  </span>
                  <span className="label-mono shrink-0 text-ink-soft">
                    {day.items.length} sessions {open ? "−" : "+"}
                  </span>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <ol className="grid-12 pb-8">
                      {day.items.map((item) => (
                        <li
                          key={`${item.time}-${item.title}`}
                          className="col-span-4 grid grid-cols-1 gap-x-6 gap-y-1 border-t border-rule py-4 md:col-span-12 md:grid-cols-12 md:items-baseline md:py-3"
                        >
                          <span className="label-mono tabular-nums text-ink-soft md:col-span-1">
                            {item.time}
                          </span>
                          <span className="font-medium md:col-span-6">
                            {item.title}
                          </span>
                          <span className="label-mono text-ink-soft md:col-span-3">
                            {item.venue}
                          </span>
                          <span className="label-mono text-red md:col-span-2 md:text-right">
                            {item.note ?? ""}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
