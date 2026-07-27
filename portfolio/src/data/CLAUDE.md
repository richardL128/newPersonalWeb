# CLAUDE.md — src/data

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## projects.js

Single source of truth for all project cards. Export is a named `projects` array consumed by `src/pages/Projects.jsx`.

### Project object schema

```js
{
  name: string,        // displayed as the card title
  description: string, // 1–2 sentence summary shown below the title
  link: string,        // URL opened in a new tab; omit or set null to hide the link
  image: string,       // path relative to /public, e.g. '/projects/my-project.png'
}
```

To add a project: append an object to the array and drop the PNG into `public/projects/`.

To remove a project: delete its object from the array (and optionally delete the image file).

`name` is used as the React list key — keep names unique.

## fights.js

Holds the photo shown on the BJJ page (`src/pages/BJJ.jsx`, rendered by `<FightPhoto />`). Export is a named `latestFight` object.

```js
{
  image: string,   // path relative to /public, e.g. '/bjj/latest-fight.png'
  alt: string,     // screen-reader description of the photo
  caption: string, // small caption under the photo; omit or set null to hide it
}
```

To swap the photo: drop the file into `public/bjj/` and point `image` at it. No component changes are needed.
