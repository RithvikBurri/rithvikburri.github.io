import type { ReactNode } from "react";

/**
 * A TUI pane in the style of lazygit/k9s: box border with the pane's
 * index + filename set into the top edge, metadata on the right edge, and
 * a brighter border + glow when it holds "focus" (driven by scroll-spy).
 */
export function TerminalPane({
  id,
  index,
  fileName,
  title,
  meta,
  active = false,
  as = "section",
  className = "",
  bodyClassName = "p-5 sm:p-6",
  children,
}: {
  id?: string;
  index: string;
  fileName: string;
  /** Human-readable name, for screen readers (the visible label is the filename). */
  title: string;
  meta?: string;
  active?: boolean;
  as?: "section" | "div" | "aside";
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  const Tag = as;
  const headingId = id ? `${id}-heading` : undefined;

  return (
    <Tag
      id={id}
      aria-labelledby={headingId}
      data-active={active || undefined}
      className={
        "relative rounded-[3px] border bg-term-panel/90 transition-[border-color,box-shadow] duration-300 " +
        (active
          ? "border-term-line-active shadow-[0_0_0_1px_rgb(47_158_95/0.15),0_0_32px_-6px_rgb(74_222_128/0.25)]"
          : "border-term-line shadow-[0_18px_40px_-24px_rgb(0_0_0/0.9)]") +
        (id ? " scroll-mt-32 md:scroll-mt-24" : "") +
        (className ? ` ${className}` : "")
      }
    >
      {/* Title set into the top border */}
      <div className="pointer-events-none absolute inset-x-3 top-0 flex -translate-y-1/2 items-center justify-between gap-3 text-xs leading-none">
        <h2
          id={headingId}
          className={
            "pane-title flex items-center gap-1.5 px-1.5 py-0.5 font-mono font-medium transition-colors " +
            (active ? "text-term-green-bright phosphor" : "text-term-dim")
          }
        >
          <span
            aria-hidden="true"
            className={active ? "text-term-green" : "text-term-faint"}
          >
            [{index}]
          </span>
          <span className="sr-only">{title}: </span>
          {fileName}
        </h2>
        {meta && (
          <span
            aria-hidden="true"
            className="pane-title hidden px-1.5 py-0.5 font-mono text-term-faint sm:inline"
          >
            {meta}
          </span>
        )}
      </div>

      <div
        className={`font-mono text-[13px] leading-relaxed text-term-fg sm:text-sm ${bodyClassName}`}
      >
        {children}
      </div>
    </Tag>
  );
}

/**
 * Editor-style source view with a line-number gutter. Each entry is one
 * logical line; long lines wrap with the continuation aligned to the code.
 */
export function CodeLines({ lines }: { lines: ReactNode[] }) {
  return (
    <ol className="flex flex-col">
      {lines.map((line, i) => (
        <li key={i} className="flex min-h-[1.65em] gap-4">
          <span
            aria-hidden="true"
            className="w-6 shrink-0 select-none text-right tabular-nums text-term-faint"
          >
            {i + 1}
          </span>
          <span className="min-w-0 flex-1 break-words">{line}</span>
        </li>
      ))}
    </ol>
  );
}
