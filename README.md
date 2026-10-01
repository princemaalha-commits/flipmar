# Dribbble — Design Discovery

A responsive, independent frontend recreation of Dribbble’s design-discovery experience. Built with React, TypeScript, and Vite.

## Run locally

```sh
npm ci
npm run dev
```

Open the Vite URL printed in your terminal. The development server binds to `0.0.0.0` and supports proxied preview hostnames.

## What works

- Responsive navigation, dropdown menus, and a curated gallery of 24 designs
- Search and trending searches, with Shots, Designers, and Services browsing modes
- Category, tag, color, and timeframe filtering, plus four sorting options
- Likes and bookmarks saved in browser local storage
- Saved-inspiration collections and incremental gallery pagination
- Detailed shot previews with shareable `?shot=…` links
- Designer profiles, service inquiries, and project-brief forms
- Image uploads with validation and resizing, published for the current session
- Demo account creation and logout
- Keyboard-accessible dialogs, focus trapping, Escape dismissal, and reduced-motion support

Artwork and fonts are served locally; rendering does not depend on third-party image or font servers.

## Commands

```sh
npm run build       # TypeScript checks and production build in dist/
npm run preview     # Serve the production build
npm test            # 26 unit tests for filtering, sorting, and data helpers
npm run test:ui     # Browser flows, responsive checks, and accessibility audits
```

For `test:ui`, keep the development server running on port 5173. To test a different server:

```sh
BASE_URL=http://127.0.0.1:4173 npm run test:ui
```

The browser-check script uses an npm-packaged headless Chromium for Linux environments. It performs 25 checks, including five viewport sizes from 320px to 1440px, and axe WCAG A/AA audits. Reports and screenshots go into the ignored `test-results/` directory.

## Demo boundaries

This is **not connected to Dribbble or any backend**. No real accounts, emails, inquiries, project submissions, subscriptions, or payments are created. Account forms do not request passwords or transmit email addresses. Only the demo display name, likes, and saved shot IDs are stored locally. Uploaded images stay in memory until the page is refreshed.

Designer names, biographies, availability, pricing, and job listings are illustrative demo content, not authoritative attribution or live marketplace information. See [ARTWORK_CREDITS.md](ARTWORK_CREDITS.md) for imagery sources. Dribbble’s name and the original artworks belong to their respective owners.

## Stack

React 19 · TypeScript · Vite · Lucide icons · self-hosted DM Sans, DM Serif Display, and Damion fonts · Vitest · Playwright · axe-core
