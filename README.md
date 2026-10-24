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
- `src/components/ExperienceJournal.jsx` and `ExperienceJournal.css` contain compact experience cards with expandable focus details. Their role summaries, skills, and work-area descriptions live in `src/data.js`.
- `src/components/LearningHighlights.jsx` and `LearningHighlights.css` contain the education note, expandable milestone stories, and highlighted competition wins.
- `src/components/Playground.jsx` contains the three experiments.
- `src/components/ReelPlayer.jsx` contains the homepage introduction player.
- `scripts/reel/` contains the editable 43-second “I MAKE IDEAS MOVE” film, original 120 BPM score, and authentic UI captures with provenance; see `docs/reel.md`.
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

Keyboard navigation, visible focus styles, a skip link, a focus-trapped mobile menu, semantic page headings, descriptive destination links, and reduced-motion styles are included. The introduction video starts only when played and includes captions and playback controls. Playground motion only runs when activated and stops automatically.

The homepage project cards swing into place once, lift and tilt on pointer hover, and can be animated again with “Swing the cards.” Selecting a project opens its information below the collage without changing routes. “Back to the cards” closes the information and restores focus to the selected card. Reduced-motion preferences remove the swinging and tilting.

The hero’s “Let’s connect” button scrolls to Connect. The education note’s “See what I’m building” link opens the homepage project-card board, including from other routes. Redundant hero and below-board project buttons are omitted.

`src/components/PortraitCanvas.jsx` and `PortraitCanvas.css` frame the supplied photo as an interactive creative canvas. Design, Code, and AI buttons change its composition and annotations. Pointer tilt is bounded; keyboard/touch work through native buttons and reduced motion disables movement.

The tech-stack cards fan out on arrival. Hover reveals a category’s tools with a lift, pointer tilt, and staggered labels. Clicking or focusing a card centers it; category buttons, previous/next controls, horizontal swipes, and Left/Right/Home/End keys provide other ways to explore. Motion finishes without looping and respects reduced-motion preferences. The same component appears on the homepage and `/skills`.

The experience section shows both companies in compact ivory cards. Each keeps its role and summary visible, with an “Explore my focus” button that reveals work areas and skills. Native buttons support keyboard and touch; gentle monogram and disclosure transitions respect reduced motion. The component is shared by Home, About, and Experience.

Education uses a compact paper note with a link to the projects. Milestones expand on click or keyboard activation, with one story open at a time and direct event/project links inside. Four poster presentation wins and first place in debate lead the section in prominent sage and clay panels. Hackathon and TechSprint participation appear beneath them, collapsed initially. Small stamp movements and disclosure transitions stop under reduced-motion preferences.
