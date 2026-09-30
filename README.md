# Portfolio Website

Rithvik Burri's personal portfolio: a terminal-UI themed site (matrix rain,
typed boot log, tmux/lazygit-style panes, file-tree navigation). Built with
Next.js (App Router) + TypeScript + Tailwind CSS, exported as a fully static
site for GitHub Pages.

## Stack

- **Next.js 16** (App Router), statically exported (`output: "export"`)
- **TypeScript**
- **Tailwind CSS v4** (design tokens in `src/app/globals.css`)
- **JetBrains Mono**, self-hosted via `@fontsource-variable/jetbrains-mono`
- No backend, no database: all content lives in one typed file,
  [`src/lib/content.ts`](./src/lib/content.ts)

## Project structure

```
src/
  app/
    layout.tsx            # root layout, metadata, font
    page.tsx              # header + terminal layout
    globals.css           # color tokens, CRT overlay, cursor
  components/
    Header.tsx            # fixed window chrome / prompt
    MatrixRain.tsx        # canvas falling-code background
    hacker/
      HackerLayout.tsx    # page grid + scroll-spy wiring
      TerminalHero.tsx    # whoami (neofetch) + boot.log panes
      HackerSections.tsx  # education.md, experience.log, skills.json, ...
      TerminalPane.tsx    # TUI pane chrome + line-numbered code view
      FileTreeSidebar.tsx # desktop file tree + mobile tab strip
      StatusBar.tsx       # tmux-style status line
  lib/
    content.ts            # all site copy (edit this to update the site)
    highlight.tsx         # highlights metrics (87.6%, 400ms, ...) in bullets
    use-active-section.ts # scroll-spy for the focused pane
    use-prefers-reduced-motion.ts
```

To change any text on the site (name, experience, skills, certifications,
contact info), edit `src/lib/content.ts`; nothing else needs to change.

## Local development

Requires Node.js 20.9+ (Node 22 recommended — see `.github/workflows/deploy.yml`).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Building locally

```bash
npm run build
```

This produces a fully static site in `out/`. You can preview it with any
static file server, e.g.:

```bash
npx serve out
```

`npm run lint` runs ESLint over the project.

## Deploying to GitHub Pages

Deployment is automated by [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml):
on every push to `main`, it builds the static export and publishes it with
GitHub's official Pages actions.

**One-time setup**, after pushing this repo to GitHub:

1. Go to the repo's **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push to `main` (or re-run the workflow from the **Actions** tab).

The workflow automatically detects the right base path:

- If the repo is named `<your-username>.github.io` (a user/organization
  page), the site is served from the domain root and no base path is
  needed.
- For any other repo name (a project page), it's served from
  `https://<your-username>.github.io/<repo-name>/`, and the workflow sets
  `NEXT_PUBLIC_BASE_PATH=/<repo-name>` at build time so all assets and
  links resolve correctly.

No manual configuration is required either way — this is computed from
`github.event.repository.name` at build time, whatever you end up naming
the repo.

### Deploying elsewhere

Because this is a static export, the contents of `out/` after `npm run build`
can be hosted on any static file host (Netlify, Vercel, S3, nginx, etc.).
If you deploy to a subpath on a host other than GitHub Pages, set
`NEXT_PUBLIC_BASE_PATH` to that subpath before building; leave it unset to
serve from the domain root.
