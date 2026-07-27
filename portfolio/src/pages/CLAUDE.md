# CLAUDE.md — src/pages

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Page-level components, one per route. Pages own layout and compose components from `src/components/`.

| File | Route | Description |
|---|---|---|
| Home.jsx | `/` | Hero section with profile photo, name, tagline, and summary. No CTA buttons. |
| Resume.jsx | `/resume` | PDF embed via `<object>` with fallback text and download `<a>` link. Resume path is defined in the `RESUME_PATH` constant at the top — change it there if the file moves. |
| Projects.jsx | `/projects` | Imports `projects` array from `src/data/projects.js` and renders a `<Carousel />` (3D drum). Renders it bare — see "Projects tilt" below before adding any wrapper. |
| Contact.jsx | `/contact` | Renders `<ContactPanel />`. No page-specific logic. |
| BJJ.jsx | `/bjj` | Brazilian Jiu-Jitsu write-up. Prose body plus a `<FightPhoto />` fed by `latestFight` from `src/data/fights.js`. |

## Projects tilt

`Projects.jsx` renders `<Carousel items={projects} />` with no transform wrapper around it. The carousel's 15° lean is applied inside `Carousel.jsx` (`TILT_Y`), on purpose. Wrapping the carousel in a `[perspective:…]` + `[transform:rotateY(…)]` layer here nests a second 3D context inside the carousel's own perspective, which breaks pointer hit-testing on the cards — the "View Project" link becomes unclickable while still looking completely normal. Adjust `TILT_Y` in `Carousel.jsx` to change the lean.

## Fight photo

`BJJ.jsx` renders the fight photo inside the description body via `<FightPhoto />`. The page passes no literal paths — image, alt text, and caption all come from `latestFight` in `src/data/fights.js`, and the file itself lives in `public/bjj/`. To swap the photo, edit that data file only.

## Resume PDF

The PDF is served from `public/resume.pdf`. To update the resume, replace that file. `RESUME_PATH` in `Resume.jsx` points to `/resume.pdf` — update the constant if you rename the file.
