"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Which section is currently on screen, for the progress rail.
 *
 * The root margin collapses the viewport to a thin band around the middle, so a
 * section is "active" only while it actually owns the centre of the screen.
 */
export function useActiveSection(ids: string[]) {
  const key = ids.join(",");
  const list = useMemo(() => key.split(",").filter(Boolean), [key]);
  const [active, setActive] = useState(list[0] ?? "");

  useEffect(() => {
    const elements = list
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const winner = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (winner) setActive(winner.target.id);
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: [0, 0.2, 0.5, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [list]);

  return active;
}
