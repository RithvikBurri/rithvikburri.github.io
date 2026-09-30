"use client";

import { MatrixRain } from "@/components/MatrixRain";
import {
  FileTabStrip,
  FileTreeSidebar,
} from "@/components/hacker/FileTreeSidebar";
import { HackerSections } from "@/components/hacker/HackerSections";
import { StatusBar } from "@/components/hacker/StatusBar";
import { TerminalHero } from "@/components/hacker/TerminalHero";
import { navSections } from "@/lib/content";
import { useActiveSection } from "@/lib/use-active-section";

// The hero ("whoami") is spied too, so scrolling back up returns focus to it.
const SPY_IDS = ["whoami", ...navSections.map((s) => s.id)];

/**
 * Layer stack, back to front:
 *   matrix rain (canvas)  →  panes  →  header / status bar  →  CRT glass
 */
export function HackerLayout() {
  const spied = useActiveSection(SPY_IDS);
  const activeId = spied === "whoami" ? null : spied;

  return (
    <div className="relative min-h-screen bg-term-bg font-mono text-term-fg">
      <MatrixRain />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-14 sm:px-6 lg:px-8">
        <FileTabStrip activeId={activeId} />
        <div className="grid gap-6 pt-8 sm:pt-10 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-8">
          <div className="hidden h-full md:block">
            <FileTreeSidebar activeId={activeId} />
          </div>
          <main className="flex min-w-0 flex-col gap-9">
            <TerminalHero active={activeId === null} />
            <HackerSections activeId={activeId} />
          </main>
        </div>
      </div>

      <StatusBar activeId={activeId} />
      <div aria-hidden="true" className="crt-overlay" />
    </div>
  );
}
