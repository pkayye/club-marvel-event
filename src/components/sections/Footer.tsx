import { event, navItems } from "@/content/event";

/**
 * The footer. Plain anchors rather than scripted jumps, so it works with
 * JavaScript off and is crawlable. Lenis intercepts in-page anchors itself when
 * smooth scrolling is active.
 */
export default function Footer() {
  return (
    <footer id="footer" className="anchor-offset mt-10 bg-ink text-paper">
      <div className="shell flex flex-col gap-14 py-16 md:py-24">
        <div className="grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-6">
            <p className="label-mono text-paper/50">
              {event.brand.edition} · {event.brand.organiser}
            </p>
            <p className="display-title mt-6 max-w-[12ch] text-paper">
              {event.brand.wordmark}
            </p>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-paper/60">
              {event.brand.tagline}
            </p>
          </div>

          <nav aria-label="Footer" className="col-span-4 md:col-span-3">
            <p className="label-mono text-paper/50">Sections</p>
            <ul className="mt-5 flex flex-col">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="flex items-baseline justify-between gap-4 border-t border-white/15 py-3 text-sm transition-colors hover:text-red"
                  >
                    <span>{item.label}</span>
                    <span className="label-mono text-paper/40">
                      {item.number}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-4 md:col-span-3">
            <p className="label-mono text-paper/50">Contacts</p>
            <ul className="mt-5 flex flex-col">
              {event.contacts.map((contact) => (
                <li key={contact.email} className="border-t border-white/15 py-3">
                  <p className="text-sm font-medium">{contact.name}</p>
                  <p className="label-mono mt-1 text-paper/50">{contact.role}</p>
                  <p className="mt-2 flex flex-col gap-1 text-sm text-paper/70">
                    <a
                      href={`mailto:${contact.email}`}
                      className="underline decoration-white/30 underline-offset-4 hover:text-red"
                    >
                      {contact.email}
                    </a>
                    <a
                      href={`tel:${contact.phone.replace(/\s/g, "")}`}
                      className="hover:text-red"
                    >
                      {contact.phone}
                    </a>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/15 pt-6">
          <p className="label-mono text-paper/50">
            {event.registration.deadline}
          </p>
          <p className="max-w-2xl text-xs leading-relaxed text-paper/40">
            {event.brand.disclaimer} All artwork on this site is original
            placeholder illustration created for the event.
          </p>
        </div>
      </div>
    </footer>
  );
}
