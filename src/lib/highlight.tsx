import type { ReactNode } from "react";

// Matches the quantitative claims in résumé bullets: 87.6%, 4,353, 400ms,
// 83K+, 50%+, "30 seconds", "30 minutes". Kept deliberately narrow so it
// only lights up real metrics.
const METRIC = /(\d[\d,.]*(?:%\+?|K\+|\+|ms)?(?:\s(?:seconds|minutes))?)/g;

/**
 * Splits a sentence so its metrics can be styled, without touching the
 * underlying copy in content.ts. Presentation-only: the same string renders
 * plain in any view that doesn't call this.
 */
export function highlightMetrics(text: string, className: string): ReactNode[] {
  return text.split(METRIC).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className={className}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}
