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

- `/` — introduction, featured work, playground, skills, experience, education, achievements, About, and Connect.
- `/projects` — the seven projects, with Design, Full-stack, and AI filters.
- `/projects/:projectId` — individual project details and their original destination links.
- `/playground` — three contained, user-activated experiments.
- `/skills`, `/about`, `/experience`, and `/contact` — focused versions of the relevant content.

## Editing

- `src/data.js` contains project content, all destination links, skills, and experience.
- `src/App.jsx` contains page layouts and navigation.
- `src/components/ProjectArt.jsx` contains the illustrative project previews.
- `src/components/Playground.jsx` contains the three experiments.
- `src/styles.css` contains the visual system, responsive layouts, and motion.
- `public/fonts/` contains the self-hosted Manrope font and its license.
- `docs/reference-study.md` records the reference analysis and adaptation.
- `DESIGN.md` records the implemented palette, typography, spacing, components, and motion rules.
- `docs/verification.md` records the checks performed and their scope.

The project covers are original interface studies, not screenshots of the linked applications. This is also stated on each project detail page. Replace them with actual project captures whenever those are available.

## Hosting

The production output is `dist/`. Configure the host to serve `index.html` for frontend routes, so direct visits and refreshes work. A Netlify-compatible fallback is included in `public/_redirects`; Vercel routing is configured in `vercel.json`.

The portfolio has no backend or contact submission service. Contact buttons open an email draft in the visitor's email client. No analytics or tracking scripts are included.

## Accessibility and motion

Keyboard navigation, visible focus styles, a skip link, a focus-trapped mobile menu, semantic page headings, descriptive destination links, and reduced-motion styles are included. The hero animates once and can be replayed. Playground motion only runs when activated and stops automatically.
