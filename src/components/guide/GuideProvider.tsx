"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { DIALOGUE, PRIORITY, type GuideLineId } from "@/content/dialogue";

/**
 * The fourth-wall guide's brain.
 *
 * Deliberately restrictive, because a guide that talks constantly is worse than
 * no guide at all:
 *   - one bubble at a time
 *   - a cooldown between bubbles
 *   - priorities, so a success message always beats a hover quip
 *   - `once` lines that never repeat in a session
 *   - suppression while the intro plays or the visitor is in a form field
 */

const COOLDOWN_MS = 8000;

export type GuideBubbleState = { id: GuideLineId; text: string } | null;

type GuideApi = {
  /** Currently displayed bubble, or null. */
  current: GuideBubbleState;
  /** Bumps on every new bubble so consumers can re-run entrance animation. */
  nonce: number;
  /** Request a line. Silently ignored if it loses to priority, cooldown or suppression. */
  say: (id: GuideLineId) => void;
  dismiss: () => void;
  /** Block all non-intro lines, e.g. while a form field has focus. */
  pushSuppressor: (reason: string) => void;
  popSuppressor: (reason: string) => void;
  /** While true, only `intro.*` lines may play. */
  setIntroActive: (active: boolean) => void;
};

const GuideContext = createContext<GuideApi | null>(null);

export function useGuide() {
  const ctx = useContext(GuideContext);
  if (!ctx) throw new Error("useGuide must be used inside <GuideProvider>");
  return ctx;
}

export default function GuideProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<GuideBubbleState>(null);
  const [nonce, setNonce] = useState(0);

  const lastSpokenAt = useRef(Number.NEGATIVE_INFINITY);
  const spokenOnce = useRef(new Set<GuideLineId>());
  const suppressors = useRef(new Set<string>());
  const activePriority = useRef(0);
  const introActive = useRef(false);
  const hideTimer = useRef<number | null>(null);

  const clearTimer = () => {
    if (hideTimer.current !== null) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const dismiss = useCallback(() => {
    clearTimer();
    activePriority.current = 0;
    setCurrent(null);
  }, []);

  const say = useCallback((id: GuideLineId) => {
    const line = DIALOGUE[id];
    if (!line) return;

    // During the intro, only the intro's own lines get through.
    if (introActive.current && !id.startsWith("intro.")) return;
    if (suppressors.current.size > 0 && !id.startsWith("intro.")) return;

    // The finale is too important to lose to a cooldown.
    const bypasses = line.priority >= PRIORITY.success;

    if (line.once && spokenOnce.current.has(id)) return;

    // Never let a lower-priority line stomp the bubble already on screen.
    if (activePriority.current > 0 && line.priority <= activePriority.current) {
      return;
    }

    const now = performance.now();
    if (!bypasses && now - lastSpokenAt.current < COOLDOWN_MS) return;

    spokenOnce.current.add(id);
    lastSpokenAt.current = now;
    activePriority.current = line.priority;
    clearTimer();
    setCurrent({ id, text: line.text });
    setNonce((n) => n + 1);

    hideTimer.current = window.setTimeout(() => {
      activePriority.current = 0;
      hideTimer.current = null;
      setCurrent(null);
    }, line.duration);
  }, []);

  const pushSuppressor = useCallback((reason: string) => {
    suppressors.current.add(reason);
  }, []);

  const popSuppressor = useCallback((reason: string) => {
    suppressors.current.delete(reason);
  }, []);

  const setIntroActive = useCallback((active: boolean) => {
    introActive.current = active;
  }, []);

  useEffect(() => clearTimer, []);

  const value = useMemo<GuideApi>(
    () => ({
      current,
      nonce,
      say,
      dismiss,
      pushSuppressor,
      popSuppressor,
      setIntroActive,
    }),
    [current, nonce, say, dismiss, pushSuppressor, popSuppressor, setIntroActive],
  );

  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>;
}
