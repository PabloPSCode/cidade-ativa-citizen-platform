"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";

type WrapperTag =
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "span"
  | "div";

export interface FadeTextProps {
  items: string[]; // texts to rotate
  intervalMs?: number; // total time each item stays on screen (default 5000)
  fadeMs?: number; // duration of fade in/out (default 600)
  wrapper?: WrapperTag; // tag used to render the text (default "div")
  className?: string; // utility classes (e.g., Tailwind)
  startIndex?: number; // optional initial index (default 0)
  loop?: boolean; // if false, stops on the last item (default true)
}

export default function FadeText({
  items,
  intervalMs = 5000,
  fadeMs = 600,
  wrapper = "div",
  className,
  startIndex = 0,
  loop = true,
}: FadeTextProps) {
  const texts = useMemo(() => items.filter(Boolean), [items]);
  const [index, setIndex] = useState(() =>
    texts.length ? Math.min(Math.max(startIndex, 0), texts.length - 1) : 0
  );
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!texts.length) return;

    // show -> (interval - fade) -> fade out -> (end of interval) -> switch text
    setVisible(true);

    const safeFade = Math.min(
      Math.max(fadeMs, 0),
      Math.max(intervalMs - 50, 0)
    );
    const fadeOutAt = Math.max(intervalMs - safeFade, 0);

    const t1 = setTimeout(() => setVisible(false), fadeOutAt);
    const t2 = setTimeout(() => {
      const hasNext = index + 1 < texts.length;
      if (hasNext) setIndex((i) => i + 1);
      else if (loop) setIndex(0);
      else setVisible(true); // keep last visible if not looping
    }, intervalMs);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [index, texts, intervalMs, fadeMs, loop]);

  if (!texts.length) return null;

  const Tag = wrapper;

  return (
    <Tag
      aria-live="polite"
      className={className}
      style={{
        transition: `opacity ${fadeMs}ms ease`,
        opacity: visible ? 1 : 0,
        willChange: "opacity",
      }}
    >
      {texts[index]}
    </Tag>
  );
}

