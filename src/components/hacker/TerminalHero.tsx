"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { TerminalPane } from "@/components/hacker/TerminalPane";
import { bootLines, profile } from "@/lib/content";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const TYPE_SPEED_MS = 14;
const LINE_PAUSE_MS = 110;

// "RB" in the ANSI Shadow figlet font.
const MONOGRAM = [
  "██████╗ ██████╗ ",
  "██╔══██╗██╔══██╗",
  "██████╔╝██████╔╝",
  "██╔══██╗██╔══██╗",
  "██║  ██║██████╔╝",
  "╚═╝  ╚═╝╚═════╝ ",
];

const link =
  "text-term-cyan underline decoration-term-cyan/30 underline-offset-4 transition hover:decoration-term-cyan hover:text-term-green-bright focus-visible:rounded-sm focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-term-green";

export function TerminalHero({ active }: { active: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-9 xl:grid-cols-[minmax(0,1fr)_24rem] xl:gap-6">
      <WhoamiPane active={active} />
      <BootPane />
    </div>
  );
}

/** neofetch-style identity card. Always server-rendered: it carries the h1. */
function WhoamiPane({ active }: { active: boolean }) {
  const status = [
    profile.openToWork && "open_to_work",
    profile.openToRelocation && "open_to_relocation",
  ].filter(Boolean);

  const facts: [string, ReactNode][] = [
    [
      "status",
      <span key="s" className="flex flex-wrap gap-x-4 text-term-green">
        {status.map((flag) => (
          <span key={String(flag)} className="whitespace-nowrap">
            <span aria-hidden="true">● </span>
            {flag}
          </span>
        ))}
      </span>,
    ],
  ];

  const contact: [string, ReactNode][] = [
    [
      "email",
      <a key="e" href={`mailto:${profile.email}`} className={link}>
        {profile.email}
      </a>,
    ],
    [
      "linkedin",
      <a
        key="l"
        href={profile.linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={link}
      >
        {profile.linkedin}
      </a>,
    ],
    [
      "phone",
      <a
        key="p"
        href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}
        className={link}
      >
        {profile.phone}
      </a>,
    ],
  ];

  return (
    <TerminalPane
      id="whoami"
      as="div"
      index="~"
      fileName="whoami"
      title="Introduction"
      meta={`${profile.handle}@portfolio`}
      active={active}
    >
      <p className="mb-5 text-term-dim">
        <span className="text-term-green">❯</span> neofetch
      </p>
      <div className="flex gap-8">
        <pre
          aria-hidden="true"
          className="hidden shrink-0 bg-gradient-to-b from-term-green-bright to-term-line-active bg-clip-text pt-1 text-[12px] leading-[1.12] text-transparent sm:block"
        >
          {MONOGRAM.join("\n")}
        </pre>

        <div className="min-w-0 flex-1">
          <h1 className="phosphor text-2xl font-bold tracking-tight text-term-green-bright sm:text-3xl">
            {profile.name}
          </h1>
          <p className="mt-1 text-term-amber">{profile.role}</p>
          <hr className="my-3.5 border-term-line" />
          <FactList rows={facts} />
          <p
            aria-hidden="true"
            className="my-3.5 flex items-center gap-3 text-xs text-term-dim"
          >
            <span className="w-4 border-t border-term-line" />
            contact
            <span className="flex-1 border-t border-term-line" />
          </p>
          <FactList rows={contact} />
          <div aria-hidden="true" className="mt-5 flex gap-1">
            {[
              "bg-term-red",
              "bg-term-amber",
              "bg-term-green",
              "bg-term-cyan",
              "bg-term-magenta",
              "bg-term-fg",
            ].map((c) => (
              <span key={c} className={`h-3 w-6 ${c}`} />
            ))}
          </div>
        </div>
      </div>
    </TerminalPane>
  );
}

function FactList({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="grid grid-cols-[4.5rem_1fr] gap-x-3 gap-y-1 sm:grid-cols-[5.5rem_1fr]">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-term-amber">{k}</dt>
          <dd className="min-w-0 break-words">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Decorative boot log that types itself out. Every line is laid out from
 * the first paint (untyped text is `invisible`), so the typing never shifts
 * layout. Skipped entirely under prefers-reduced-motion.
 */
function BootPane() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [linesShown, setLinesShown] = useState(0);
  const [charsShown, setCharsShown] = useState(0);
  const [animationDone, setAnimationDone] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    function tick(line: number, chars: number) {
      if (line >= bootLines.length) {
        setAnimationDone(true);
        return;
      }
      if (chars >= bootLines[line].length) {
        timeoutRef.current = setTimeout(() => {
          setLinesShown(line + 1);
          setCharsShown(0);
          tick(line + 1, 0);
        }, LINE_PAUSE_MS);
        return;
      }
      timeoutRef.current = setTimeout(() => {
        setCharsShown(chars + 1);
        tick(line, chars + 1);
      }, TYPE_SPEED_MS);
    }

    tick(0, 0);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [prefersReducedMotion]);

  const shown = prefersReducedMotion ? bootLines.length : linesShown;
  const done = prefersReducedMotion || animationDone;

  return (
    <TerminalPane
      as="div"
      index="b"
      fileName="boot.log"
      title="Boot log"
      meta="tty1"
      bodyClassName="p-5 sm:p-6 h-full"
    >
      <div aria-hidden="true" className="flex h-full flex-col">
        <p className="mb-5 text-term-dim">
          <span className="text-term-green">❯</span> ./boot.sh
        </p>
        <ol className="flex flex-col gap-1">
          {bootLines.map((line, i) => {
            const typed =
              i < shown ? line : i === shown ? line.slice(0, charsShown) : "";
            const rest = line.slice(typed.length);
            return (
              <li key={i} className="flex gap-2">
                <span
                  className={
                    "shrink-0 whitespace-pre " +
                    (i < shown ? "text-term-green" : "invisible")
                  }
                >
                  [ ok ]
                </span>
                <span>
                  {typed}
                  <span className="invisible">{rest}</span>
                </span>
              </li>
            );
          })}
        </ol>
        <p className={"mt-auto pt-6 " + (done ? "" : "invisible")}>
          <span className="text-term-green">{profile.handle}@portfolio</span>
          <span className="text-term-dim">:</span>
          <span className="text-term-cyan">~</span>
          <span className="text-term-dim">$ </span>
          <span className="cursor-block" />
        </p>
      </div>
    </TerminalPane>
  );
}
