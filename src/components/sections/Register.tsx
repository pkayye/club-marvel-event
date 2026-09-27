"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";

import { useGuide } from "@/components/guide/GuideProvider";
import Section from "@/components/layout/Section";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import MagneticButton from "@/components/ui/MagneticButton";
import { event } from "@/content/event";

/**
 * Registration.
 *
 * Posts straight to Formspree — no backend to run before the event. The finale
 * is the only place on the site where a lot happens at once, which is why it
 * happens once: a red sweep, a confirmation panel, and the host's last line.
 *
 * If the endpoint is not configured the form says so plainly instead of
 * accepting a submission and dropping it.
 */

const ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ID;

type Status = "idle" | "submitting" | "success" | "error";

const YEARS = [
  "1st year",
  "2nd year",
  "3rd year",
  "4th year",
  "Postgraduate",
  "Other",
] as const;

export default function Register() {
  const [status, setStatus] = useState<Status>("idle");
  const { say, pushSuppressor, popSuppressor } = useGuide();
  const wrap = useRef<HTMLDivElement>(null);
  const announced = useRef(false);

  const configured = Boolean(ENDPOINT);

  /* Comment once, when the form arrives — not again on every scroll past. */
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !announced.current) {
          announced.current = true;
          say("form.reach");
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [say]);

  async function onSubmit(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    if (!configured) return;

    const form = formEvent.currentTarget;
    setStatus("submitting");

    try {
      const response = await fetch(`https://formspree.io/f/${ENDPOINT}`, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error(`Formspree responded ${response.status}`);

      form.reset();
      setStatus("success");
      say("register.success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div ref={wrap}>
      <Section
        id="register"
        number="05"
        title="Register"
        kicker={event.registration.deadline}
        lede={event.registration.lede}
      >
        <div className="grid-12 gap-y-12">
          {/* Left column: what you get, and the practical notes. */}
          <aside className="col-span-4 md:col-span-4">
            <h3 className="label-mono text-ink-soft">Includes</h3>
            <ul className="mt-4 flex flex-col">
              {event.registration.includes.map((item) => (
                <li
                  key={item}
                  className="border-t border-rule py-3 text-sm leading-relaxed"
                >
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-6 flex items-start gap-2 text-sm text-ink-soft">
              <span
                aria-hidden="true"
                className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 bg-red"
              />
              {event.registration.cost}
            </p>

            <h3 className="label-mono mt-10 text-ink-soft">Questions</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {event.contacts.map((contact) => (
                <li key={contact.email} className="text-sm">
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-ink-soft">
                    {contact.role} ·{" "}
                    <a
                      href={`tel:${contact.phone.replace(/\s/g, "")}`}
                      className="underline decoration-rule-strong underline-offset-4 hover:text-red"
                    >
                      {contact.phone}
                    </a>
                  </p>
                </li>
              ))}
            </ul>
          </aside>

          {/* Right column: the form. */}
          <div className="col-span-4 md:col-span-8">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  role="status"
                  aria-live="polite"
                >
                  <div className="relative overflow-hidden border border-ink bg-paper px-6 py-10 md:px-10 md:py-14">
                    {/* The finale sweep. */}
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-1 origin-left bg-red"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <p className="label-mono text-red">Registration received</p>
                    <p className="section-title mt-4 max-w-[18ch]">
                      You are in the multiverse
                    </p>
                    <p className="mt-5 max-w-prose text-ink-soft">
                      A confirmation is on its way to your inbox. Keep it — you
                      will need it at the reporting desk.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="label-mono mt-8 border border-rule-strong px-5 py-3 transition-colors hover:border-ink"
                    >
                      Register another team
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={onSubmit}
                  onFocus={() => pushSuppressor("register-form")}
                  onBlur={() => popSuppressor("register-form")}
                  className="flex flex-col gap-8"
                >
                  <div className="grid gap-8 md:grid-cols-2">
                    <TextField
                      name="name"
                      label="Full name"
                      required
                      autoComplete="name"
                      placeholder="As on your college ID"
                    />
                    <TextField
                      name="email"
                      label="Email"
                      type="email"
                      required
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@example.edu"
                    />
                    <TextField
                      name="phone"
                      label="Phone"
                      type="tel"
                      required
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+91 00000 00000"
                    />
                    <TextField
                      name="department"
                      label="Department / Course"
                      required
                      placeholder="e.g. Computer Science"
                    />
                    <SelectField name="year" label="Year of study" options={YEARS} />
                    <TextField
                      name="teamName"
                      label="Team name"
                      placeholder="Optional"
                    />
                  </div>

                  <TextAreaField
                    name="teamMembers"
                    label="Teammates"
                    placeholder="One name per line, with their email"
                    hint="Only the team lead needs to submit this form."
                  />

                  <fieldset className="flex flex-col gap-4">
                    <legend className="label-mono text-ink-soft">
                      Activities you want to enter
                    </legend>
                    <div className="grid gap-3 md:grid-cols-2">
                      {event.activities.map((activity) => (
                        <label
                          key={activity.id}
                          className="flex cursor-pointer items-start gap-3 border-t border-rule py-3 text-sm"
                        >
                          <input
                            type="checkbox"
                            name={`activity_${activity.id}`}
                            value="yes"
                            className="mt-0.5 h-4 w-4 shrink-0 accent-red"
                          />
                          <span>
                            <span className="font-medium">{activity.title}</span>
                            <span className="block text-ink-soft">
                              {activity.time} · {activity.location}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <TextAreaField
                    name="notes"
                    label="Anything we should know"
                    rows={2}
                    placeholder="Accessibility needs, dietary requirements, queries"
                  />

                  <label className="flex cursor-pointer items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      name="consent"
                      value="yes"
                      required
                      className="mt-0.5 h-4 w-4 shrink-0 accent-red"
                    />
                    <span className="text-ink-soft">
                      {event.registration.consent}{" "}
                      <span className="text-red" aria-hidden="true">
                        *
                      </span>
                    </span>
                  </label>

                  {/* Honeypot — humans never see it, naive bots fill it in. */}
                  <input
                    type="text"
                    name="_gotcha"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                  />

                  <div className="flex flex-wrap items-center gap-4">
                    <MagneticButton
                      type="submit"
                      disabled={!configured || status === "submitting"}
                      onEngage={() => say("register.hover")}
                      className="label-mono bg-ink px-7 py-4 text-paper transition-colors hover:bg-red disabled:cursor-not-allowed disabled:bg-ink-soft"
                    >
                      {status === "submitting" ? "Sending…" : "Submit registration"}
                    </MagneticButton>

                    <p
                      role="status"
                      aria-live="polite"
                      className="label-mono text-ink-soft"
                    >
                      {status === "submitting" ? "Sending your details" : ""}
                    </p>
                  </div>

                  {!configured ? (
                    <p className="border border-rule-strong bg-paper-dim px-4 py-3 text-sm">
                      <span className="label-mono mr-2 text-red">
                        Not configured
                      </span>
                      Set <code>NEXT_PUBLIC_FORMSPREE_ID</code> to enable
                      submissions. See <code>.env.example</code>.
                    </p>
                  ) : null}

                  {status === "error" ? (
                    <p
                      role="alert"
                      className="border border-red px-4 py-3 text-sm text-red-deep"
                    >
                      That did not go through. Check your connection and try
                      again, or use one of the phone numbers alongside.
                    </p>
                  ) : null}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Section>
    </div>
  );
}
