import Section from "@/components/layout/Section";
import ActivityCard from "@/components/ui/ActivityCard";
import GrowRule from "@/components/ui/GrowRule";
import { event } from "@/content/event";

/**
 * Activities, laid out as comic panels: a strict grid with uneven image crops, so
 * the section feels like a page of a book rather than a card carousel.
 */
export default function Activities() {
  return (
    <Section
      id="activities"
      number="02"
      title="Activities"
      kicker="Six timelines"
      lede="Enter as many as you like. Team size and format differ per activity — check the tags before you commit."
    >
      <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {event.activities.map((activity, index) => (
          <ActivityCard key={activity.id} activity={activity} index={index} />
        ))}
      </div>

      <GrowRule className="mt-16" />
    </Section>
  );
}
