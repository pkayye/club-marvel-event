/**
 * Every line the fourth-wall guide can say, keyed by trigger id.
 *
 * Keep these short. The guide is a garnish: if every interaction produces a
 * joke, the event information stops being readable.
 */

export type GuideLineId =
  | "intro.interrupt"
  | "intro.reveal"
  | "register.hover"
  | "scroll.fast"
  | "schedule.open"
  | "form.reach"
  | "register.success"
  | "activity.first"
  | "idle"
  | "idle.poke"
  | "register.nudge";

/** Higher wins when two triggers fire close together. */
export const PRIORITY = {
  success: 40,
  hover: 30,
  milestone: 20,
  scroll: 15,
  idle: 5,
} as const;

export type GuideLine = {
  text: string;
  priority: number;
  /** How long the bubble stays up, in ms. */
  duration: number;
  /** Ignore this line if it has already played once this session. */
  once?: boolean;
};

export const DIALOGUE: Record<GuideLineId, GuideLine> = {
  "intro.interrupt": {
    text: "This is taking too long.",
    priority: PRIORITY.success,
    duration: 2600,
    once: true,
  },
  "intro.reveal": {
    text: "Finally. A website with taste.",
    priority: PRIORITY.success,
    duration: 3200,
    once: true,
  },
  "register.hover": {
    text: "Yes, click it. That is literally why it exists.",
    priority: PRIORITY.hover,
    duration: 3600,
  },
  "scroll.fast": {
    text: "Whoa. Save some scrolling for the rest of us.",
    priority: PRIORITY.scroll,
    duration: 3200,
  },
  "schedule.open": {
    text: "A timetable. The most dangerous villain of college life.",
    priority: PRIORITY.milestone,
    duration: 3600,
    once: true,
  },
  "form.reach": {
    text: "Your personal data is now part of the plot.",
    priority: PRIORITY.milestone,
    duration: 3600,
    once: true,
  },
  "register.success": {
    text: "Congratulations. You have joined the cinematic universe.",
    priority: PRIORITY.success,
    duration: 5000,
    once: true,
  },
  "activity.first": {
    text: "Pick a timeline. Any timeline.",
    priority: PRIORITY.hover,
    duration: 3200,
    once: true,
  },
  idle: {
    text: "I am legally required to ask you to register.",
    priority: PRIORITY.idle,
    duration: 3200,
  },
  "idle.poke": {
    text: "Stop poking. I am not a button. Okay, I am a button.",
    priority: PRIORITY.idle,
    duration: 3400,
  },
  "register.nudge": {
    text: "I would point at it, but I am contractually limited to one gesture.",
    priority: PRIORITY.hover,
    duration: 3600,
  },
};

/** Guide poser lines shown inside the pinned multiverse scene, by panel index. */
export const PANEL_ASIDES: string[] = [
  "Rule one of the multiverse: read the schedule.",
  "Rule two: the quiz has a buzzer round. Bring nerve.",
  "Rule three: your costume is not a crime. Probably.",
  "Rule four: three minutes of film. No pressure.",
];
