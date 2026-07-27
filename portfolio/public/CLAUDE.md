# CLAUDE.md — public/

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Static assets served at the root URL. Files here are not processed by Vite.

| Path | Purpose |
|---|---|
| `resume.pdf` | Resume document. Replace this file to update the resume — no code changes needed. |
| `projects/` | PNG preview images for project cards. Filename must match the `image` field in `src/data/projects.js`. |
| `_redirects` | Netlify catch-all redirect so BrowserRouter deep links work (`/* /index.html 200`). |

The `vercel.json` at the repo root serves the same purpose for Vercel deployments.
