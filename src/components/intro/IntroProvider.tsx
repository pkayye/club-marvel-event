"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Tracks whether the loading interruption has finished.
 *
 * Sections that animate on load (the hero title) wait for `ready` so they do not
 * spend their entrance hidden behind the overlay. There is a hard safety
 * timeout so content can never be stranded if the sequence fails.
 */

type IntroApi = {
  ready: boolean;
  markReady: () => void;
};

const SAFETY_TIMEOUT_MS = 6000;

const IntroContext = createContext<IntroApi>({
  ready: true,
  markReady: () => {},
});

export function useIntro() {
  return useContext(IntroContext);
}

export default function IntroProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), SAFETY_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, []);

  // Stable identity: consumers list this in effect dependencies, and a new
  // function each render would tear their effects down mid-sequence.
  const markReady = useCallback(() => setReady(true), []);

  const value = useMemo<IntroApi>(
    () => ({ ready, markReady }),
    [ready, markReady],
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}
