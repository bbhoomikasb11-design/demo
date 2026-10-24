# Bhoomika S. — Portfolio

A responsive React + Vite portfolio using the navigation, page shell, editorial proportions, tactile controls, and project-led structure of [Kree8 Studio](https://www.kree8.studio/). The palette is warm white, forest green, and sage.

## Run locally

```sh
npm install
npm run dev
```

Vite prints the local URL. To create a production build:

```sh
npm run build
npm run preview
```

## Pages

- `/` — introduction, animated project-card collage with same-page details, skills, experience, education, achievements, and Connect.
- `/projects` — the seven projects, with Design, Full-stack, and AI filters.
- `/projects/:projectId` — individual project details and their original destination links.
- `/playground` — three contained, user-activated experiments.
- `/skills`, `/about`, `/experience`, and `/contact` — focused versions of the relevant content.

## Editing

- `src/data.js` contains project content, all destination links, skills, and experience.
- `src/App.jsx` contains page layouts and navigation.
- `src/components/ProjectArt.jsx` contains the illustrative project previews.
- `src/components/ProjectBoard.jsx` contains the seven swinging polaroid cards; `ProjectSpotlight.jsx` contains their inline details and destination links.
- `src/components/TechStack.jsx` and `TechStack.css` contain the interactive fan of six skill cards. `TechCardArt.jsx` contains their original SVG illustrations.
- `src/components/ExperienceJournal.jsx` and `ExperienceJournal.css` contain the experience folders and expandable work areas. Their role summaries, skills, and work-area descriptions live in `src/data.js`.
- `src/components/LearningHighlights.jsx` and `LearningHighlights.css` contain the education note, expandable milestone stories, and award stamps.
- `src/components/Playground.jsx` contains the three experiments.
- `src/components/ReelPlayer.jsx` contains the homepage introduction player.
- `scripts/reel/` contains the editable video and original music generators; see `docs/reel.md`.
- `src/styles.css` contains the visual system, responsive layouts, and motion.
- `public/fonts/` contains the self-hosted Manrope font and its license.
- `public/media/bhoomika-portrait.jpg` is the supplied homepage portrait, optimized for the web. Its source and preparation are recorded in `docs/assets.md`.
- `docs/reference-study.md` records the reference analysis and adaptation.
- `DESIGN.md` records the implemented palette, typography, spacing, components, and motion rules.
- `docs/verification.md` records the checks performed and their scope.

The project covers are original interface studies, not screenshots of the linked applications. This is also stated on each project detail page. Replace them with actual project captures whenever those are available.

## Hosting

The production output is `dist/`. Configure the host to serve `index.html` for frontend routes, so direct visits and refreshes work. A Netlify-compatible fallback is included in `public/_redirects`; Vercel routing is configured in `vercel.json`.

The portfolio has no backend or contact submission service. Contact buttons open an email draft in the visitor's email client. No analytics or tracking scripts are included.

## Accessibility and motion

Keyboard navigation, visible focus styles, a skip link, a focus-trapped mobile menu, semantic page headings, descriptive destination links, and reduced-motion styles are included. The introduction video starts only when played and includes captions, a text alternative, and a download. Playground motion only runs when activated and stops automatically.

The homepage project cards swing into place once, lift and tilt on pointer hover, and can be animated again with “Swing the cards.” Selecting a project opens its information below the collage without changing routes. “Back to the cards” closes the information and restores focus to the selected card. Reduced-motion preferences remove the swinging and tilting.

The homepage hero’s “Explore projects” and “Let’s connect” buttons scroll to the card board and Connect section on the same page.

The tech-stack cards fan out on arrival. Hover reveals a category’s tools with a lift, pointer tilt, and staggered labels. Clicking or focusing a card centers it; category buttons, previous/next controls, horizontal swipes, and Left/Right/Home/End keys provide other ways to explore. Motion finishes without looping and respects reduced-motion preferences. The same component appears on the homepage and `/skills`.

The experience journal has two company folders. Click a folder or use Left/Right/Home/End while its tab is focused to switch roles. Each folder has three expandable work areas, remembers its open area, and keeps the original role summary and focus skills visible. Paper entrances and hover effects are finite and respect reduced-motion preferences. The journal is shared by the homepage, About, and Experience pages.

Education uses a compact paper note with a link to the projects. Milestones expand on click or keyboard activation, with one story open at a time and direct event/project links inside. Award facts stay visible. Small stamp movements and disclosure transitions stop under reduced-motion preferences.
