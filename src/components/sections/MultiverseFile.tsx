import MultiversePanel from "@/components/sections/MultiversePanel";
import MultiverseScene from "@/components/sections/MultiverseScene";
import Reveal from "@/components/ui/Reveal";
import { event, multiversePanels } from "@/content/event";

/**
 * The multiverse file: the site's one scroll-linked set piece.
 *
 * This file stays a server component — it renders the panels into the HTML and
 * hands them to the client scene as children, so the content is indexable and
 * present on first paint.
 */
export default function MultiverseFile() {
  const count = multiversePanels.length;

  return (
    <section
      id="multiverse-file"
      className="anchor-offset relative bg-ink text-paper"
    >
      <div className="shell pb-10 pt-20 md:pt-28">
        <Reveal>
          <header className="border-t border-white/20 pt-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
              <span className="label-mono text-red">03</span>
              <span className="label-mono text-paper/50">
                Classified · scroll to open
              </span>
            </div>
            <h2 className="section-title mt-5 max-w-[16ch] text-paper">
              Multiverse File
            </h2>
            <p className="text-lead mt-5 max-w-2xl text-paper/70">
              Four timelines, filed like a dossier. Keep scrolling and the file
              travels sideways.
            </p>
          </header>
        </Reveal>
      </div>

      <MultiverseScene panels={multiversePanels} count={count}>
        {multiversePanels.map((activity) => (
          <MultiversePanel key={activity.id} activity={activity} total={count} />
        ))}
      </MultiverseScene>

      <p className="shell label-mono py-8 text-paper/40">
        {event.brand.wordmark} · File 001 ends here
      </p>
    </section>
  );
}
