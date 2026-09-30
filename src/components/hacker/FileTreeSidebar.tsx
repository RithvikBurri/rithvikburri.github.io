"use client";

import { navSections } from "@/lib/content";
import { scrollToSection } from "@/lib/use-active-section";
import { TerminalPane } from "@/components/hacker/TerminalPane";

const itemBase =
  "group flex w-full items-center gap-2 whitespace-nowrap rounded-[2px] px-2 py-1 text-left transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-term-green";

/** ≥ md: a sticky "[0] files" pane with a tree. */
export function FileTreeSidebar({ activeId }: { activeId: string | null }) {
  return (
    <nav aria-label="Sections" className="h-full">
      <div className="sticky top-24">
        <TerminalPane
          as="div"
          index="0"
          fileName="files"
          title="Files"
          bodyClassName="px-3 pb-4 pt-5"
        >
          <p className="mb-2 px-2 text-term-cyan">~/portfolio</p>
          <ul className="flex flex-col">
            {navSections.map((s, i) => {
              const active = activeId === s.id;
              const last = i === navSections.length - 1;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(s.id)}
                    aria-current={active ? "location" : undefined}
                    className={
                      itemBase +
                      (active
                        ? " bg-term-green/10 text-term-green-bright"
                        : " text-term-dim hover:bg-term-line/60 hover:text-term-fg")
                    }
                  >
                    <span aria-hidden="true" className="text-term-faint">
                      {last ? "└─" : "├─"}
                    </span>
                    <span className="flex-1">{s.fileName}</span>
                    <span
                      aria-hidden="true"
                      className={active ? "text-term-green" : "invisible"}
                    >
                      ◂
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </TerminalPane>
      </div>
    </nav>
  );
}

/** < md: horizontal tab strip pinned under the header. */
export function FileTabStrip({ activeId }: { activeId: string | null }) {
  return (
    <nav
      aria-label="Sections"
      className="sticky top-14 z-40 -mx-4 flex sm:-mx-6 gap-1 overflow-x-auto border-b border-term-line bg-term-bar/95 px-4 py-2 backdrop-blur md:hidden"
    >
      {navSections.map((s, i) => {
        const active = activeId === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollToSection(s.id)}
            aria-current={active ? "location" : undefined}
            className={
              "shrink-0 whitespace-nowrap rounded-[2px] px-2.5 py-1 font-mono text-xs transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-term-green " +
              (active
                ? "bg-term-green/15 text-term-green-bright"
                : "text-term-dim hover:text-term-fg")
            }
          >
            <span aria-hidden="true" className="text-term-faint">
              {i + 1}:
            </span>
            {s.fileName}
          </button>
        );
      })}
    </nav>
  );
}
