"use client";

import type { ReactNode } from "react";
import { Accordeon } from "../../libs/react-ultimate-components/src";

export interface FaqItem {
  question: string;
  answer: ReactNode;
}

interface CollapsibleFaqProps {
  items: FaqItem[];
}

export default function CollapsibleFaq({ items }: CollapsibleFaqProps) {
  return (
    <Accordeon
      questions={items}
      allowMultiple
      maxWidthClassName="max-w-none"
      className="!bg-white/70 dark:!bg-bg-card/80"
    />
  );
}
