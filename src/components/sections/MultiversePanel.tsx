import Image from "next/image";

import type { Activity } from "@/content/event";

/**
 * One panel of the multiverse file.
 *
 * A plain server component: the markup is in the HTML for the first paint, and
 * the client-side scene only attaches motion to it. Content is never gated behind
 * an animation library.
 */
export default function MultiversePanel({
  activity,
  total,
}: {
  activity: Activity;
  total: number;
}) {
  return (
    <article
      data-panel
      aria-label={`${activity.number} of ${String(total).padStart(2, "0")}: ${activity.title}`}
      className="flex w-[80vw] shrink-0 snap-start flex-col border-t border-white/20 pt-4 md:w-[42vw] lg:w-[46vw]"
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="label-mono text-red">{activity.number}</span>
        <span className="label-mono text-paper/50">
          {activity.time} · {activity.location}
        </span>
      </div>

      <div className="relative mt-5 aspect-16/10 overflow-hidden bg-white/5">
        <Image
          src={activity.image}
          alt=""
          fill
          sizes="(min-width: 768px) 46vw, 80vw"
          className="object-cover"
        />
      </div>

      <h3 className="mt-6 text-2xl font-bold uppercase tracking-tight text-paper md:text-4xl">
        {activity.title}
      </h3>
      <p className="mt-4 max-w-prose text-sm leading-relaxed text-paper/70 md:text-base">
        {activity.blurb}
      </p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {activity.tags.map((tag) => (
          <li
            key={tag}
            className="label-mono border border-white/20 px-2 py-1 text-paper/60"
          >
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );
}
