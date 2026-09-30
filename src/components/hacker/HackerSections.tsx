"use client";

import type { ReactNode } from "react";
import { CodeLines, TerminalPane } from "@/components/hacker/TerminalPane";
import {
  certifications,
  education,
  experience,
  navSections,
  profile,
  skills,
} from "@/lib/content";
import { highlightMetrics } from "@/lib/highlight";

// Syntax-highlight primitives shared by the "source file" panes.
const P = ({ children }: { children: ReactNode }) => (
  <span className="text-term-faint">{children}</span>
);
const Key = ({ children }: { children: ReactNode }) => (
  <span className="text-term-amber">{children}</span>
);
const Str = ({ children }: { children: ReactNode }) => (
  <span className="text-term-green">{children}</span>
);
const Comment = ({ children }: { children: ReactNode }) => (
  <span className="italic text-term-dim">{children}</span>
);

const strLink =
  "text-term-green underline decoration-term-green/30 underline-offset-4 transition hover:text-term-green-bright hover:decoration-term-green-bright focus-visible:rounded-sm focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-term-green";

function meta(id: string) {
  const i = navSections.findIndex((s) => s.id === id);
  return { index: String(i + 1), ...navSections[i] };
}

export function HackerSections({ activeId }: { activeId: string | null }) {
  const pane = (id: string) => {
    const m = meta(id);
    return {
      id,
      index: m.index,
      fileName: m.fileName,
      title: m.label,
      active: activeId === id,
    };
  };

  const skillCount = skills.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="flex flex-col gap-9">
      {/* education.md — markdown source */}
      <TerminalPane {...pane("education")} meta="markdown">
        <CodeLines
          lines={[
            <span key="d" className="font-bold text-term-green-bright">
              <P>## </P>
              {education.degree}, Minor in {education.minor}
            </span>,
            <span key="s" className="font-semibold">
              <P>**</P>
              {education.school}
              <P>**</P>
            </span>,
            <span key="t">
              <P>`</P>
              <span className="text-term-amber">{education.dates}</span>
              <P>`</P>
            </span>,
          ]}
        />
      </TerminalPane>

      {/* experience.log — git-log style timeline */}
      <TerminalPane
        {...pane("experience")}
        meta={`${experience.length} entries`}
      >
        <ol className="flex flex-col">
          {experience.map((job, i) => {
            const last = i === experience.length - 1;
            return (
              <li
                key={`${job.org}-${job.role}`}
                className="relative pb-7 pl-7 last:pb-0"
              >
                {/* graph gutter */}
                <span
                  aria-hidden="true"
                  className="absolute left-[3px] top-[0.45em] h-2.5 w-2.5 rounded-full border-2 border-term-green bg-term-panel"
                />
                {!last && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-[7px] top-[1.3em] w-px bg-term-line"
                  />
                )}

                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                  <h3 className="font-bold text-term-green-bright">
                    {job.role}
                    <span className="font-normal text-term-dim"> @ </span>
                    <span className="font-medium text-term-fg">{job.org}</span>
                  </h3>
                  <span className="text-xs tabular-nums text-term-amber">
                    {job.dates}
                  </span>
                </div>
                <ul className="mt-2.5 flex flex-col gap-2">
                  {job.bullets.map((bullet, j) => (
                    <li key={j} className="flex gap-2.5">
                      <span
                        aria-hidden="true"
                        className="text-term-line-active"
                      >
                        ▸
                      </span>
                      <span className="text-term-fg/90">
                        {highlightMetrics(
                          bullet,
                          "font-semibold text-term-amber",
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </TerminalPane>

      {/* skills.json — JSON source */}
      <TerminalPane
        {...pane("skills")}
        meta={`${skills.length} groups · ${skillCount} items`}
      >
        <CodeLines
          lines={[
            <P key="open">{"{"}</P>,
            ...skills.map((group, gi) => (
              <span key={group.category} className="block pl-[2ch]">
                <Key>&quot;{group.category}&quot;</Key>
                <P>: [</P>
                {group.items.map((item, i) => (
                  <span key={item}>
                    <Str>&quot;{item}&quot;</Str>
                    {i < group.items.length - 1 && <P>, </P>}
                  </span>
                ))}
                <P>]{gi < skills.length - 1 ? "," : ""}</P>
              </span>
            )),
            <P key="close">{"}"}</P>,
          ]}
        />
      </TerminalPane>

      {/* certs.yaml — YAML source */}
      <TerminalPane
        {...pane("certifications")}
        meta={`${certifications.length} items`}
      >
        <CodeLines
          lines={[
            <Key key="k">certifications:</Key>,
            ...certifications.map((cert) => (
              <span key={cert.name} className="block pl-[2ch]">
                <P>- </P>
                <span className="text-term-fg">{cert.name}</span>
              </span>
            )),
          ]}
        />
      </TerminalPane>

      {/* contact.sh — shell script */}
      <TerminalPane {...pane("contact")} meta="bash · +x">
        <CodeLines
          lines={[
            <Comment key="sb">#!/usr/bin/env bash</Comment>,
            <Comment key="c"># any of these works</Comment>,
            <span key="b" />,
            <span key="em">
              <Key>EMAIL</Key>
              <P>=</P>
              <P>&quot;</P>
              <a href={`mailto:${profile.email}`} className={strLink}>
                {profile.email}
              </a>
              <P>&quot;</P>
            </span>,
            <span key="li">
              <Key>LINKEDIN</Key>
              <P>=</P>
              <P>&quot;</P>
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={strLink}
              >
                {profile.linkedin}
              </a>
              <P>&quot;</P>
            </span>,
            <span key="ph">
              <Key>PHONE</Key>
              <P>=</P>
              <P>&quot;</P>
              <a
                href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}
                className={strLink}
              >
                {profile.phone}
              </a>
              <P>&quot;</P>
            </span>,
            <span key="b2" />,
            <span key="open">
              <span className="text-term-cyan">open</span>{" "}
              <Str>&quot;mailto:$EMAIL&quot;</Str>{" "}
              <Comment># say hello</Comment>
            </span>,
          ]}
        />
      </TerminalPane>
    </div>
  );
}
