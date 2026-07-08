# Mustacho.dev

An interactive developer portfolio and blog built with **Next.js 16 (App Router)** and **React 19**. It features spring-physics UI animations, a custom interactive terminal CLI emulator, and a passcode-secured blog CMS.

## Tech Stack

*   **Framework:** Next.js 16.2 (App Router) & React 19.2
*   **Styling:** Tailwind CSS v4 & PostCSS
*   **Animations:** Motion (Framer Motion)
*   **Database:** Local JSON File (`src/data/blogs.json`)
*   **Markdown Parsing:** React Markdown

## Environment Variables

Create a `.env.local` file in the root directory:

```env
ADMIN_PASSCODE=your_secret_passcode_here
```

*   `ADMIN_PASSCODE`: Used to authenticate access to the `/admin` CMS dashboard.

## Getting Started

### 1. Install Dependencies

```bash
npm install
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

## Local APIs

*   `GET /api/blogs` — Retrieve all blog posts.
*   `POST /api/blogs` — Create a new blog post.
*   `GET | PUT | DELETE /api/blogs/[id]` — Fetch, update, or delete a single post.
*   `POST /api/admin/login` — Verify admin passcode.
