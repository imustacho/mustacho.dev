# Mustacho.dev

An interactive developer portfolio and blog built with **Next.js 16 (App Router)** and **React 19**. It features spring-physics UI animations, a custom interactive terminal CLI emulator, and a multi-theme color system.

## Tech Stack

*   **Framework:** Next.js 16.2 (App Router) & React 19.2
*   **Styling:** Tailwind CSS v4 & PostCSS
*   **Animations:** Motion (Framer Motion)
*   **Content:** Markdown posts in `blogs/`, project and skill JSON in `src/data/`
*   **Markdown Parsing:** React Markdown

## Getting Started

### 1. Install Dependencies

```bash
pnpm install --frozen-lockfile
```

### 2. Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### 3. Build & Run Production

```bash
npm run build
npm start
```

## Validation

Run `npm run lint` and `npm run build`. With the site running, install a test
browser once with `pnpm exec playwright install chromium`, then run
`npm run test:browser`. Set `TEST_BASE_URL` to test another local port and
`PLAYWRIGHT_CHANNEL=msedge` to use an installed Edge browser.

The browser suite checks translated navigation, denied/corrupt theme storage,
system theme changes, mobile menus, skill deep links, terminal startup, every
published route, 404 responses and local assets. Run against `npm run dev` to
exercise React Strict Mode as well as against `npm start` for production.

Fonts are served from `public/fonts/`; their SIL Open Font Licenses are included
there. Both builds and page loads work without contacting Google Fonts. Blog
Markdown is rendered on the server, and list pages only send post summaries.
