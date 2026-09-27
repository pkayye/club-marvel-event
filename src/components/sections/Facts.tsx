import Section from "@/components/layout/Section";
import Reveal from "@/components/ui/Reveal";
import { event } from "@/content/event";

/**
 * The brief. This is content the visitor came for, so it is plain HTML with the
 * lightest possible reveal — no scroll tricks, nothing that delays reading it.
 */
export default function Facts() {
  return (
    <Section
      id="facts"
      number="01"
      title="The Brief"
      kicker="Event facts"
      lede="Everything you need to know before you pick a timeline. Times are indicative and confirmed on the schedule."
    >
      <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 md:gap-x-10 md:gap-y-14">
        {event.facts.map((fact, index) => (
          <Reveal key={fact.label} delay={(index % 3) * 0.06}>
            <div className="rule-t pt-4">
              <dt className="label-mono text-ink-soft">{fact.label}</dt>
              <dd className="mt-3 text-2xl font-bold tracking-tight md:text-4xl">
                {fact.value}
              </dd>
              {fact.note ? (
                <p className="mt-2 text-sm text-ink-soft">{fact.note}</p>
              ) : null}
            </div>
          </Reveal>
        ))}
      </dl>
    </Section>
  );
}
