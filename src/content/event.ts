/**
 * Single source of truth for all event content.
 *
 * Everything on the site reads from here. To swap the placeholder content for
 * the real thing, edit this file only — no components need to change.
 */

export type NavItem = { id: string; label: string; number: string };

export type Fact = { label: string; value: string; note?: string };

export type Activity = {
  id: string;
  number: string;
  title: string;
  blurb: string;
  time: string;
  location: string;
  /** Placeholder original artwork shipped in /public/comic. */
  image: string;
  tags: string[];
};

export type ScheduleDay = {
  id: string;
  day: string;
  date: string;
  items: { time: string; title: string; venue: string; note?: string }[];
};

export type Contact = { name: string; role: string; phone: string; email: string };

export const event = {
  /** Brand block. */
  brand: {
    wordmark: "MULTIVERSE CAMPUS",
    edition: "EDITION 001",
    organiser: "GeeksforGeeks",
    /** Shown as a small kicker above the hero title. */
    presents: "GeeksforGeeks presents",
    hostLabel: "DEADPOOL",
    tagline:
      "One campus. Infinite timelines. Pick a universe and show up in it.",
    disclaimer:
      "A fan-made student project. Not affiliated with, endorsed by, or sponsored by Marvel. No official artwork or logos are used.",
  },

  /** Hero. Lines are animated individually, never letter by letter. */
  hero: {
    lines: ["MARVEL:", "MULTIVERSE", "CAMPUS"] as const,
    lede:
      "A two-day fest for students of this college. Every event is its own timeline — register once and compete across universes.",
    cta: { primary: "Register", secondary: "See the schedule" },
    scrollCue: "Scroll to enter",
    metadata: [
      { label: "Dates", value: "TBA — 2 days" },
      { label: "Venue", value: "[Campus Auditorium]" },
      { label: "Edition", value: "001" },
    ] as Fact[],
  },

  /** Event facts grid. */
  facts: [
    { label: "Dates", value: "TBA", note: "Two full days" },
    { label: "Venue", value: "[Campus]", note: "Main auditorium & labs" },
    { label: "Reporting", value: "08:30", note: "Both days" },
    {
      label: "Eligibility",
      value: "Students only",
      note: "Enrolled students of this college",
    },
    { label: "Team size", value: "1 – 4", note: "Varies by activity" },
    { label: "Entry", value: "Free", note: "No registration fee" },
  ] as Fact[],

  /** Activities. Also drives the pinned multiverse panels. */
  activities: [
    {
      id: "quiz",
      number: "01",
      title: "Marvel Quiz",
      blurb:
        "Heroes, villains and timelines. Written rounds, then a buzzer final in front of the auditorium.",
      time: "Day 1 · 10:00",
      location: "Auditorium",
      image: "/comic/quiz.svg",
      tags: ["Teams of 2", "3 rounds"],
    },
    {
      id: "cosplay",
      number: "02",
      title: "Cosplay Showdown",
      blurb:
        "Original costumes, original characters. Craft, character and stage presence judged separately.",
      time: "Day 1 · 14:00",
      location: "Open Air Theatre",
      image: "/comic/cosplay.svg",
      tags: ["Solo", "Walk-on"],
    },
    {
      id: "short-film",
      number: "03",
      title: "Short Film",
      blurb:
        "Three minutes, one universe. Shoot before the fest and screen it to a live audience.",
      time: "Day 2 · 11:00",
      location: "Screening Room",
      image: "/comic/film.svg",
      tags: ["Teams of 4", "Pre-submitted"],
    },
    {
      id: "debate",
      number: "04",
      title: "Multiverse Debate",
      blurb:
        "Motion: the snap was justified. Timed arguments and an open floor you will not survive by volume alone.",
      time: "Day 2 · 13:30",
      location: "Seminar Hall",
      image: "/comic/debate.svg",
      tags: ["Teams of 2", "Asian parliamentary"],
    },
    {
      id: "design",
      number: "05",
      title: "Poster Design",
      blurb:
        "A cover for an issue that does not exist. Export at print size, judged blind.",
      time: "Day 2 · 15:00",
      location: "Design Lab",
      image: "/comic/design.svg",
      tags: ["Solo", "2 hours"],
    },
    {
      id: "escape",
      number: "06",
      title: "Escape the Timeline",
      blurb:
        "A timed campus trail. Four clues, four locations, one clock that does not stop for you.",
      time: "Both days · 16:00",
      location: "Across campus",
      image: "/comic/escape.svg",
      tags: ["Teams of 4", "Outdoor"],
    },
  ] as Activity[],

  /** Schedule, framed as a classified file. */
  schedule: [
    {
      id: "day-1",
      day: "Day One",
      date: "TBA — [Date]",
      items: [
        { time: "08:30", title: "Reporting & Registration Desk", venue: "Main Gate" },
        { time: "09:30", title: "Opening Address", venue: "Auditorium" },
        {
          time: "10:00",
          title: "Marvel Quiz — Written Round",
          venue: "Auditorium",
          note: "Prelims",
        },
        { time: "12:30", title: "Lunch", venue: "Cafeteria" },
        { time: "14:00", title: "Cosplay Showdown", venue: "Open Air Theatre" },
        {
          time: "16:00",
          title: "Escape the Timeline — Leg 1",
          venue: "Across campus",
        },
        { time: "18:00", title: "Day One Close", venue: "Auditorium" },
      ],
    },
    {
      id: "day-2",
      day: "Day Two",
      date: "TBA — [Date]",
      items: [
        { time: "09:00", title: "Reporting", venue: "Main Gate" },
        { time: "11:00", title: "Short Film Screenings", venue: "Screening Room" },
        { time: "13:30", title: "Multiverse Debate", venue: "Seminar Hall" },
        { time: "15:00", title: "Poster Design — Timed Round", venue: "Design Lab" },
        { time: "16:00", title: "Escape the Timeline — Final", venue: "Across campus" },
        {
          time: "17:30",
          title: "Marvel Quiz — Buzzer Final",
          venue: "Auditorium",
        },
        { time: "19:00", title: "Prizes & Closing", venue: "Auditorium" },
      ],
    },
  ] as ScheduleDay[],

  /** Registration copy. */
  registration: {
    title: "Registration",
    lede:
      "One form per team. Your teammates can be added by name — they do not need to fill this in separately.",
    deadline: "Closes [Date], 23:59",
    cost: "Free to enter. There is no registration fee.",
    includes: [
      "Entry to every activity you select",
      "Delegate kit and ID badge",
      "Both days, all venues",
    ],
    consent:
      "I confirm the details above are correct and agree to the event rules and code of conduct.",
  },

  /** The scrolling band. Decorative repetition, kept short and factual. */
  ticker: [
    "MULTIVERSE CAMPUS",
    "GEEKSFORGEEKS",
    "OPEN TO STUDENTS OF THIS COLLEGE",
    "TWO DAYS · SIX TIMELINES",
    "FREE ENTRY",
    "REGISTER NOW",
  ],

  contacts: [
    {
      name: "[Student Name]",
      role: "Event Head",
      phone: "+91 00000 00000",
      email: "head@example.edu",
    },
    {
      name: "[Student Name]",
      role: "Registrations",
      phone: "+91 00000 00000",
      email: "register@example.edu",
    },
  ] as Contact[],
} as const;

export const navItems: NavItem[] = [
  { id: "hero", label: "Index", number: "00" },
  { id: "facts", label: "Brief", number: "01" },
  { id: "activities", label: "Activities", number: "02" },
  { id: "multiverse-file", label: "Multiverse File", number: "03" },
  { id: "schedule", label: "Schedule", number: "04" },
  { id: "register", label: "Register", number: "05" },
];

/** Activities promoted into the pinned horizontal scroll sequence. */
export const multiversePanels: Activity[] = event.activities.slice(0, 4);
