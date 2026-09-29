# Git Mastery

A dark, animation-rich learning site that teaches Git and GitHub from zero to expert — built with Astro, TypeScript, Tailwind CSS, and a handful of small interactive islands (Preact).

Every article is original writing based on official documentation (Git docs, the Pro Git book, GitHub Docs, GitHub Skills, the GitHub CLI manual, Atlassian's Git tutorials, Conventional Commits, and Semantic Versioning). Each page ends with a "Learn more" box linking to the exact source(s) it was based on.

## What's inside

- **Start Here** — orientation, install instructions, first-time setup, a learning-path selector
- **Git** — Fundamentals → Intermediate → Advanced → Expert/Internals
- **GitHub** — Basics, Collaboration, Project Management, Automation & CI/CD, Security, Admin & Teams, Open Source
- **Workflows** — branching strategies, commit conventions, semantic versioning
- **Fix It** — a searchable troubleshooting guide plus a "what went wrong?" decision tree
- **Cheat Sheet** — every command, filterable and copy-on-click
- **Playground** — an interactive Git graph (commit/branch/merge/rebase/cherry-pick/reset/revert) with a challenge mode, and a sandbox terminal
- **Learning Path** — 4-week and 8-week guided plans with progress tracking
- **Resources** — curated docs/tools, plus an instantly-searchable glossary

Progress and quiz/challenge completion are tracked in `localStorage` (per browser, never sent anywhere).

## Tech stack

- [Astro](https://astro.build) + TypeScript, content stored as MDX in a content collection
- Tailwind CSS v4 (CSS-first `@theme` config in `src/styles/global.css`)
- GSAP + ScrollTrigger for scroll animations, [Lenis](https://github.com/darkroomengineering/lenis) for smooth scroll, Astro's built-in `ClientRouter` for view-transition-style tab navigation
- Shiki (built into Astro) for code highlighting; Fuse.js for fuzzy search
- Preact islands for the interactive bits (command palette, quizzes, the Git graph playground, the terminal simulator) — kept small and loaded lazily (`client:visible` / `client:idle`) wherever possible
- Self-hosted variable fonts via Fontsource (Inter, JetBrains Mono)

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:4321.

## Building

```bash
npm run build
npm run preview
```

`npm run build` runs a full static build into `dist/`; `npm run preview` serves that build locally so you can sanity-check the production output.

Type-check the whole project (including `.astro` files) with:

```bash
npx astro check
```

## Deploying to GitHub Pages

1. Open `astro.config.mjs` and set `SITE` to your GitHub Pages URL and `BASE`:
   - Project page (`username.github.io/repo-name`): set `BASE` to `/repo-name`.
   - User/org page or a custom domain: leave `BASE` as `/`.
2. Push to `main`. `.github/workflows/deploy.yml` builds the site and deploys it to GitHub Pages automatically (via `actions/deploy-pages`).
3. In your repository's **Settings → Pages**, set the source to **GitHub Actions** (one-time setup).


## Adding a new topic

Topics live in `src/content/topics/<git|github|workflows>/<subtab>/<slug>.mdx`. Frontmatter is validated by the schema in `src/content.config.ts`:

```mdx
---
title: Example Topic
summary: One sentence describing what this page teaches.
level: beginner # beginner | intermediate | advanced | expert
primaryTab: git # git | github | workflows
subtab: fundamentals # must match an existing sub-tab slug
category: Commands
tags: [example, tag-list]
sources:
  - label: Git — git example
    url: https://git-scm.com/docs/git-example
readingTime: 4 # minutes, your honest estimate
related: [another-topic-slug, a-third-slug]
order: 1 # controls position + prev/next within the subtab
lastReviewed: 2026-01-15
---

## Why it matters

Plain-language explanation, short sentences, a real analogy if one helps.

```bash
git example --flag
```

<Callout type="tip">
A callout — type is one of "tip", "warning", "golden", or "info". No import needed.
</Callout>

## Try it yourself

A small, concrete exercise.
```

Fix It entries follow the same idea in `src/content/fixes/*.mdx`, validated against the `fixes` schema in the same config file (symptom, summary, severity, sources, related, order, lastReviewed).

Sub-tab labels/descriptions live in `src/data/subtab-copy.ts`. The cheat sheet, glossary, curated resources, quizzes, and learning-path plans are plain typed data files under `src/data/`.

## Content sources

- Git documentation — https://git-scm.com/doc
- Pro Git book — https://git-scm.com/book
- Git command reference — https://git-scm.com/docs
- GitHub Docs — https://docs.github.com
- GitHub Skills — https://skills.github.com
- GitHub CLI manual — https://cli.github.com/manual
- Atlassian Git tutorials — https://www.atlassian.com/git/tutorials
- Conventional Commits — https://www.conventionalcommits.org
- Semantic Versioning — https://semver.org
- Oh Shit, Git!?! — https://ohshitgit.com
- Learn Git Branching — https://learngitbranching.js.org

Content is original and based on these sources — always check the official docs for the latest changes.
