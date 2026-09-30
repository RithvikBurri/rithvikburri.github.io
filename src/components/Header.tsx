import { profile } from "@/lib/content";

/** Fixed window chrome: traffic lights + shell prompt. */
export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center border-b border-term-line bg-term-bar/90 px-4 font-mono backdrop-blur sm:px-6">
      <a
        href="#top"
        className="flex items-center gap-2 text-sm focus-visible:rounded-sm focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-term-green"
      >
        <span aria-hidden="true" className="hidden gap-1.5 sm:flex">
          <span className="h-2.5 w-2.5 rounded-full bg-term-red/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-term-amber/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-term-green/80" />
        </span>
        <span className="sm:ml-2">
          <span className="text-term-green">{profile.handle}</span>
          <span className="hidden text-term-green sm:inline">@portfolio</span>
          <span className="text-term-dim">:</span>
          <span className="text-term-cyan">~</span>
        </span>
      </a>
    </header>
  );
}
