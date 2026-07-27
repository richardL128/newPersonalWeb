# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the production build locally
```

## Architecture

React SPA scaffolded with Vite. Four client-side routes rendered via React Router v6 `BrowserRouter`. A persistent `<Header>` wraps all routes.

| Layer | Path | Role |
|---|---|---|
| Entry | `src/main.jsx` | ReactDOM root mount |
| Router | `src/App.jsx` | BrowserRouter, route definitions, Header placement |
| Components | `src/components/` | Reusable UI: Header, ProjectCard, ContactPanel |
| Pages | `src/pages/` | One file per route: Home, Resume, Projects, Contact |
| Data | `src/data/projects.js` | Project card content — edit here to add/remove projects |
| Static | `public/` | resume.pdf, project PNG previews |

See each directory's own CLAUDE.md for component-level details.

## Styling

Tailwind CSS v4 with the `@tailwindcss/vite` plugin (no `tailwind.config.js`). Custom theme tokens (font, accent colour) are declared in `src/index.css` inside the `@theme {}` block. CMU Serif is loaded via CDN link in `index.html`.

## Updating content

- **Resume**: replace `public/resume.pdf`.
- **Projects**: edit `src/data/projects.js` and drop PNG files in `public/projects/`.
- **Contact info**: edit the `contactInfo` object in `src/components/ContactPanel.jsx`.
- **Landing page text**: edit `src/pages/Home.jsx`.

## Deployment

Targets Netlify or Vercel. `public/_redirects` handles Netlify SPA routing; `vercel.json` handles Vercel. No `vite.config.js` base URL change is needed.
