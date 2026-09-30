"use client";

import { useSyncExternalStore } from "react";
import { navSections, profile } from "@/lib/content";
import { scrollToSection } from "@/lib/use-active-section";

// Minute-resolution clock as an external store. The server snapshot is ""
// so the prerendered HTML and hydration agree; the time fills in right after.
function subscribeClock(onChange: () => void) {
  const id = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(id);
}
function clockSnapshot() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** tmux-style status line: session · windows (active = focused pane) · clock. */
export function StatusBar({ activeId }: { activeId: string | null }) {
  const time = useSyncExternalStore(subscribeClock, clockSnapshot, () => "");
  const activeIndex = navSections.findIndex((s) => s.id === activeId);

  return (
    <nav
      aria-label="Window list"
      className="fixed inset-x-0 bottom-0 z-50 flex h-7 items-stretch border-t border-term-line bg-term-bar font-mono text-[11px] text-term-dim sm:text-xs"
    >
      <span className="flex items-center bg-term-green px-2.5 font-bold text-term-bg">
        {profile.handle}
      </span>

      {/* window list (≥ sm) */}
      <ul className="hidden min-w-0 items-stretch overflow-hidden sm:flex">
        <li className="flex">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0 })}
            className={
              "px-2.5 transition-colors hover:text-term-fg focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-2 focus-visible:outline-term-green " +
              (activeId === null ? "bg-term-line text-term-green-bright" : "")
            }
          >
            0:whoami{activeId === null ? "*" : ""}
          </button>
        </li>
        {navSections.map((s, i) => {
          const active = s.id === activeId;
          return (
            <li key={s.id} className="flex">
              <button
                type="button"
                onClick={() => scrollToSection(s.id)}
                className={
                  "whitespace-nowrap px-2.5 transition-colors hover:text-term-fg focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-2 focus-visible:outline-term-green " +
                  (active ? "bg-term-line text-term-green-bright" : "")
                }
              >
                {i + 1}:{s.id}
                {active ? "*" : ""}
              </button>
            </li>
          );
        })}
      </ul>

      {/* active window only (< sm) */}
      <span className="flex items-center px-2.5 text-term-green-bright sm:hidden">
        {activeIndex >= 0
          ? `${activeIndex + 1}:${navSections[activeIndex].id}*`
          : "0:whoami*"}
      </span>

      <span className="ml-auto flex items-center gap-3 px-2.5">
        {profile.openToWork && (
          <span className="hidden text-term-green md:inline">
            ● open_to_work
          </span>
        )}
        <span aria-hidden="true" className="tabular-nums text-term-fg">
          {time}
        </span>
      </span>
    </nav>
  );
}
