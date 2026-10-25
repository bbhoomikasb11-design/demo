---
name: "Bhoomika S. — Portfolio"
description: "Curiosity in design. Purpose in code."
colors:
  ink: "#29483d"
  accent: "#245440"
  accent-hover: "#193e2f"
  muted: "#5e6e58"
  soft-ink: "#53684d"
  muted-emphasis: "#7a8b70"
  paper: "#f7f8f4"
  ground: "#eeefeb"
  white: "#fff"
  active-paper: "#fafbf7"
  line: "#dde2d9"
  contact-field: "#e9efdf"
  showcase-field: "#e1e8d8"
  skill-field: "#edf0e7"
  filter-active-ink: "#3a5931"
  code-field: "#d6e5c7"
  code-ink: "#486d35"
  focus: "#3c7452"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(40px, 4.1vw, 58px)"
    fontWeight: 650
    lineHeight: 1.24
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Manrope, sans-serif"
    fontSize: "42px"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Manrope, sans-serif"
    fontSize: "22px"
    fontWeight: 650
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "16px"
    fontWeight: 450
    lineHeight: 1.9
  body-detail:
    fontFamily: "Manrope, sans-serif"
    fontSize: "14px"
    fontWeight: 450
    lineHeight: 1.95
  navigation:
    fontFamily: "Manrope, sans-serif"
    fontSize: "14px"
    fontWeight: 650
  button:
    fontFamily: "Manrope, sans-serif"
    fontSize: "12px"
    fontWeight: 700
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "10px"
    fontWeight: 750
    lineHeight: 1.5
    letterSpacing: "0.08em"
  chip:
    fontFamily: "Manrope, sans-serif"
    fontSize: "10px"
    fontWeight: 450
    lineHeight: 1.4
rounded:
  chip: "6px"
  code-tile: "13px"
  media: "17px"
  card: "19px"
  featured-media: "22px"
  mobile-sheet: "24px"
  showcase: "25px"
  navigation: "28px"
  filter: "30px"
  sheet: "32px"
  button: "50px"
  circle: "50%"
spacing:
  compact: "6px"
  element: "8px"
  control: "12px"
  inset: "20px"
  group: "24px"
  block: "32px"
  content: "40px"
  mobile-section: "90px"
  section: "132px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "14px 21px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "14px 21px"
  icon-button-raised:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.circle}"
    width: "37px"
    height: "37px"
  navigation-item:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.navigation}"
    rounded: "{rounded.navigation}"
    padding: "15px 20px"
  navigation-active:
    backgroundColor: "{colors.active-paper}"
    textColor: "{colors.ink}"
    typography: "{typography.navigation}"
    rounded: "{rounded.navigation}"
    padding: "15px 20px"
  filter-chip:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.filter}"
    padding: "12px 17px"
  filter-selected:
    backgroundColor: "{colors.white}"
    textColor: "{colors.filter-active-ink}"
    rounded: "{rounded.filter}"
    padding: "12px 17px"
  skill-chip:
    backgroundColor: "{colors.skill-field}"
    textColor: "{colors.muted}"
    typography: "{typography.chip}"
    rounded: "{rounded.chip}"
    padding: "6px 10px"
  experience-card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.card}"
    padding: "30px"
  type-range:
    width: "100%"
    height: "3px"
  inline-code-tile:
    backgroundColor: "{colors.code-field}"
    textColor: "{colors.code-ink}"
    rounded: "{rounded.code-tile}"
    width: "49px"
    height: "48px"
---

# Design System: Bhoomika S. — Portfolio

## Overview

**Creative North Star: "Personal Studio"**

A personal studio in forest green, sage, and warm white. The user's pinned Kree8 reference establishes the fixed navigation rail, rounded scrolling sheet, narrow editorial copy, wider project showcases, and tactile controls. Manrope, crisp outline icons, restrained rotations, and soft layered shadows give the interface a thoughtful, approachable character.

The work changes scale between reading and looking: quiet text sits beside generous code-drawn interface compositions. Homepage project art is original illustrative UI, with that status disclosed on detail pages. The Designs gallery contains nine visual boards across Mobile Apps, Web Apps, and Websites, with concise concept/study labels and an original ClearHead capture. Gallery sources are recorded in `public/media/designs/README.md`. The homepage also uses Bhoomika’s supplied portrait and an original introduction-video poster; their sources are recorded in `docs/assets.md` and `docs/reel.md`. Motion is a brief entrance or a direct response to an action. Small section labels and pill controls are native to this chosen reference and retain their specific orientation and action roles.

**Key Characteristics:**

- Forest text and controls over warm paper and pale sage fields.
- A persistent desktop rail with alternating editorial and showcase widths.
- Manrope hierarchy, open paragraph leading, and tightly spaced display type.
- Softly raised pills, clipped project panels, and gently rotated code objects.
- Finite entrances, manual project navigation, and three bounded playground studies.

This scan records the final cascade in `src/styles.css`, the component behavior in `src/App.jsx` and `src/components/`, and the approved directions in `docs/surface-brief.md` and `docs/design-gallery-brief.md`. The independent finish review returned **ship**; the gallery’s two review findings were fixed and its ship scope confirmed. Frontmatter captures reused desktop defaults; responsive exceptions below are part of the system. Colors and typography inside individual gallery concepts remain local to their artboards, while the surrounding portfolio retains its established tokens.

## Colors

The palette is a quiet family of forest and sage greens grounded by warm white and a soft gray-green surrounding canvas.

### Primary

- **Forest ink** (`ink`) carries headings, identity, active navigation, and primary reading contrast.
- **Forest action** (`accent`, `accent-hover`) identifies primary actions and native input accents; its darker hover shade stays within the same family.
- **Readable sage ink** (`muted`, `soft-ink`) supports metadata, secondary navigation, descriptions, and longer section copy. These are the final contrast-adjusted source values.
- **Muted emphasis** (`muted-emphasis`) softens selected large headline words. It is distinct from the secondary reading color.
- **Focus green** (`focus`) marks keyboard focus with a visible outline.

### Neutral

- **Warm paper** (`paper`) is the main content sheet; **surrounding ground** (`ground`) holds the rail and mobile header.
- **White** (`white`) raises buttons and experience cards; **active paper** (`active-paper`) identifies the selected navigation item.
- **Soft divider** (`line`) separates skill, education, achievement, and footer-adjacent content without boxing every section.
- **Sage fields** (`contact-field`, `showcase-field`, `skill-field`) differentiate the closing contact region, layered showcase, and small skill tags.
- **Code tile** (`code-field`, `code-ink`) is the inline hero object's local light-and-dark pairing. **Selected filter ink** (`filter-active-ink`) remains an established token; the gallery’s category links use the shell’s forest text and raised white selected surface.

### Named Rules

**The Reading Contrast Rule.** Use the final muted and soft-ink values for secondary reading text. Pale sage surfaces and decorative headline emphasis do not replace readable body colors.

## Typography

**Display Font:** Manrope, with a sans-serif fallback.

**Body Font:** Manrope, with a sans-serif fallback. The variable font is self-hosted at `/fonts/manrope-variable.ttf`, supports weights (200–800), and uses `font-display: swap`.

**Character:** A single, rounded geometric sans-serif connects personal identity, editorial copy, and compact controls. Georgia italic provides local signature treatments, including the gallery’s small signature. Individual gallery artboards combine their own sans-serif and serif treatments to distinguish concepts without changing the shell typography.

### Hierarchy

- **Display:** The frontmatter display role is the desktop hero. Large standalone page headings use (58px, 1.2); project detail titles use (52px, 1.2). Contact headings grow to (61px), or (70px) on the standalone contact page.
- **Headline:** The headline role is the major section heading. Balanced lines, weight (650), and negative tracking give it presence without a separate typeface.
- **Title:** The title role is the general content title. Featured project titles use (20px); experience titles use (17px). Gallery board titles use (19px, 1.4) with concise (11px) labels; its page heading is available to assistive technology without adding a visible text block.
- **Body:** The body role is section copy, with a maximum width of (590px). Detail prose uses the body-detail role. The gallery omits summaries; experience descriptions use (12px, 1.95). The root weight is (450).
- **Navigation and button:** Stronger compact text identifies destinations and actions; active states use material and color as well as weight.
- **Label:** Existing small uppercase section labels orient the reader above major headings and beside outline icons. Their role is contextual; headings and project descriptions carry the substantive message. Mobile section labels use (8px), with narrower local caption treatments retained only where already present.

### Named Rules

**The One Family Rule.** Keep Manrope across the portfolio shell’s display, reading, and controls. Preserve local italic signatures. Gallery concepts may own distinct typographic treatments inside their artboards without extending those treatments to the shell.

## Layout

The desktop shell occupies the viewport. The navigation rail stays in place while the right-hand content pane scrolls independently. At the default desktop size, the rail is (300px); its collapsed state is (95px). The pane has exterior padding (32px 18px 18px 10px), and the rounded page sheet has a minimum height of `calc(100dvh - 50px)`.

Two centered content widths create the rhythm: editorial content is capped at (660px), with width `calc(100% - 120px)`; showcases are capped at (860px), with width `calc(100% - 80px)`. The hero now uses the showcase width to pair its copy with the supplied portrait: a flexible text column, (32px) gap, and (260px) portrait column. Above a hero-container width of (740px), its headline scales from (40px) to (50px). Below that threshold a portrait capped at (260px) sits above the copy with a (30px) gap, preserving the existing mobile headline sizes. The desktop hero starts at (72px) of top padding, and its video follows at (42px). Major sections use generous (132px) top spacing. Small control groups use gaps such as (6px), (8px), and (12px), while grouped content commonly uses (20px), (24px), and (32px). These are observed reusable measurements, not an enforced arithmetic scale.

The Designs gallery is one full-width column at every viewport, capped at (1140px), with a desktop gap of (38px). Each board is authored at (1000 × 700px) and retains its (10:7) ratio as `ResizeObserver` scales the composition to its container. Names and concise concept/study labels sit below the art, beside the overview/detail control. The gallery contains no descriptive project prose, case-study links, or repository links. Skill rows pair a title column of (240px) with wrapping tags. The home playground uses three columns; the dedicated playground uses two columns.

### Responsive behavior

| Viewport | Shell and content behavior |
| --- | --- |
| At least 1600px | Rail (320px), editorial maximum (700px), showcase maximum (940px); portrait hero display capped at (50px). |
| 951–1200px | Rail (244px), editorial width `calc(100% - 80px)`, showcase width `calc(100% - 44px)`; section headings (36px). |
| 761–950px | Rail (205px), editorial width `calc(100% - 56px)`; hero display (35px), section headings (31px); tech cards scale to their container and standalone experiments use two columns. |
| At most 760px | Header (76px); content height `calc(100dvh - 76px)`; sheet radius uses `mobile-sheet`; drawer width (300px), capped at (86vw). Editorial width `calc(100% - 44px)`, capped at (560px); showcase width `calc(100% - 30px)`. |
| 500–760px | Home experiments use two columns with the last study spanning both; the dedicated playground stays one column. Section headings use (37px). |
| At most 370px | Editorial width `calc(100% - 36px)` and showcase width `calc(100% - 24px)`; hero actions stack; hero display (27px), section headings (28px). |

On mobile, the final hero uses top padding (39px), centered content, display size `clamp(30px, 8.1vw, 45px)`, and leading (1.3). Core section, About, and project-detail prose remains (13px); hero description is (13px), becoming (12px) at the smallest breakpoint. General section spacing is (90px). Gallery gaps become (29px), board titles become (17px), and artboards retain their (10:7) ratio. Gallery padding becomes (21px 15px); palette swatches are hidden and the enlarge affordance stays visible. The native viewer provides a (1400px) zoomed canvas for scrolling through details on small screens. The collapsed desktop rail never replaces the mobile drawer.

## Elevation & Depth

Depth is soft and tactile. White controls float slightly above neutral surfaces; sage panels separate larger visual regions. Fine dividers organize factual lists, while the main sheet and experience cards have restrained ambient shadows. Layered project art uses more depth inside its own visual frame.

### Shadow Vocabulary

- **Raised control:** `0 2px 3px #263e3010, 0 9px 15px #263e300c, 0 22px 24px #263e3005` — the shared `--shadow` on white actions, selected navigation, filters, and circular controls.
- **Primary action:** `0 2px 4px #16362520, 0 9px 17px #2e503524` — the forest primary button at rest.
- **Action hover:** `0 3px 5px #263e3010, 0 12px 20px #263e3015` — button lift with a small upward translation.
- **Page sheet:** `0 2px 8px #334b3310` — separates the sheet from the surrounding ground.
- **Experience card:** `0 2px 4px #3c513307, 0 10px 23px #3c51330a` — ambient elevation for factual experience entries.
- **Introduction player:** `0 3px 6px #30402608, 0 16px 28px #3040260c` — a white rounded frame and diffuse shadow around the 16:9 video, continuing the tactile media treatment of the pinned reference.

### Named Rules

**The Tactile Control Rule.** Reserve the recurring raised white treatment for controls and selected states; use the quieter sheet and card shadows for content surfaces.

## Shapes

The page sheet, media frames, and cards use softly rounded rectangles. Pill geometry belongs to actions, navigation, and gallery category links; small skill and technology tags have tighter corners. Circular controls handle compact directional or utility actions. The frontmatter names the actual reused radii rather than forcing every surface onto one radius.

Project media clips its illustrative composition. The desktop hero showcase has its own rounded frame; featured art is slightly tighter. Gallery boards use a (16px) radius around the complete scaled artboard. Small identity and code tiles may rotate by a few degrees while readable copy remains upright. Outline SVG icons use thin, crisp strokes and accompany labels or accessible names.

The supplied portrait preserves its full (3:4) image and natural warm colors. Its interactive canvas has three perspectives: Design uses selection handles and a cursor label; Code uses brackets and deep-sage backing; AI connects three idea labels. Native pressed-state buttons switch compositions, with (550ms) paper transitions and a bounded pointer tilt. Labels stay outside the face. Ivory, sage, and restrained butter accents tie it to the project board. No motion loops; reduced-motion preferences remove movement while retaining selection and annotations.

## Components

### Buttons

Tactile, compact actions with clear labels.

- **Shape and material:** The primary and secondary variants share pill geometry, centered content, a small icon gap, and a minimum height of (50px). The primary is forest with white text; the secondary is white with forest text.
- **Hover:** Buttons translate upward by (3px) and use the action-hover shadow. The primary darkens. Transforms use (0.35s) and the shared easing `cubic-bezier(.16,1,.3,1)`.
- **Focus:** A visible (2px) focus-green outline sits (5px) away from controls. Icon-only buttons carry accessible names.
- **Mobile:** General actions use a minimum height of (47px) and padding (13px 17px); hero actions retain (11px) text in the final cascade. Local contact actions have their own more compact padding.
- **Text links:** Small inline actions underline on hover and nudge their arrow. They do not use the raised pill material.

### Chips

Two different uses remain visually distinct.

- **Gallery categories:** Three rounded links lead to Mobile Apps, Web Apps, and Websites. Selection uses a raised white surface and `aria-current="page"`; hover adds a pale field. Routes support direct visits and browser history. Overview/detail controls use native buttons with `aria-pressed`.
- **Skill and technology tags:** Small, static tinted rectangles wrap naturally. They describe capabilities and project tools; they do not inherit filter behavior.

### Cards / Containers

Visual work is generous; factual content is orderly.

- **Design boards:** Three boards per category present complete visual compositions: SafeScan, Roam, and Tempo; CampusMesh, SplitGrid, and ClearHead; Atelier / 04, Sunday, and Elsewhere. Each mobile concept contains three phone screens. Browser boards show detailed app or editorial website layouts. Names, concept/study labels, palette swatches, and a closer-look control accompany the artwork. The enlarge affordance appears on hover or keyboard focus and stays visible on mobile.
- **Design viewer:** A native modal dialog opens the selected board, with overview/detail and fit/zoom controls. Its scrollable canvas supports keyboard and touch exploration. Escape, the close button, or backdrop activation closes it and returns focus to the opener. Artwork’s decorative inner controls remain noninteractive; gallery controls carry accessible names.
- **Homepage project board:** Seven warm-white polaroids form an irregular three-column collage, with authored CSS pins, paperclips, and tape. Cards rotate by −4° to +4°, use 6–10px paper insets, and show an external-arrow-shaped affordance that opens same-page details. At container widths below 640px the collage becomes two columns, with the final project centered. Project names stay visible on phones; decorative subtitles disappear below 380px.
- **Inline project details:** A cream project file opens below the collage with its illustration, factual description, contribution or technologies where supplied, and GitHub/Figma/live destination. It uses two columns on desktop and stacks on phones. The project heading receives focus; returning to the board restores the trigger’s focus.
- **Experience cards:** Two compact ivory cards keep both companies, roles, and original summaries visible. Small sage and clay monograms match the paper identity. A single disclosure per company reveals work areas and skills without nested controls. Details align with the summary on desktop and span the card on narrow screens.
- **Tech-stack fan:** Six illustrated cards preserve the supplied skill groups. Five overlapping cards are visible on wider screens; the center and two neighbors remain on phones. Cream, sage, blue-gray, pale olive, lavender, and clay distinguish categories while forest typography connects them to the site. A card reveals its tools when hovered or focused; activation centers it. Previous/next controls and six named category buttons stay below the fan.
- **Education and milestones:** The compact ivory education note retains its degree, location, CGPA, and project link. Four poster presentation wins lead the achievements section on deep sage, followed by the first-place debate win on clay. Secondary hackathon and TechSprint participation use compact disclosures, initially closed, with original descriptions and destinations.

### Inputs / Fields

The only user input field is the playground's native range control. Its visible track has height (3px), uses a local muted olive accent, and exposes an accessible type-size label. The value runs from (24px) to (48px) in steps of (4px), with matching minus/plus controls and disabled endpoints. No contact form or general text-field system is implemented.

### Navigation

The desktop rail pairs outline icons with labels. The active item uses active paper, forest ink, and the raised-control shadow; a small arrow reinforces selection. The collapsed rail hides labels while retaining accessible names and titles. Contact, resume, and social actions remain separate from the main page list.

Mobile navigation opens as a drawer over a blurred backdrop. It traps keyboard focus, closes with Escape or backdrop activation, restores focus to the menu button, and makes the page inert while open. The page content also receives focus after route changes. Preserve the skip link and visible focus treatment when extending navigation.

The gallery routes are `/designs/mobile-apps`, `/designs/web-apps`, and `/designs/websites`. `/designs` and the former `/projects` listing open Mobile Apps by default. Original `/projects/:projectId` detail routes and homepage project access remain available.

### Layered Showcase and Playground

The hero contains a user-controlled 43-second portfolio film, “I MAKE IDEAS MOVE,” rendered at 1920×1080 and 24fps. Exact kinetic typography and a projected modular object connect real UI captures through masks, camera framing, grid assemblies, and a final collapse to a point. Cream and sage are sampled from the original film; butter yellow provides restrained emphasis. Original screenshot colors are preserved with the owner’s approval. An original 120 BPM electronic score synchronizes the key reveals and includes a brief near-silent moment before the signature. The poster leaves the center play-control area clear. Playback never starts automatically or loops, and pauses when hidden or offscreen. Captions, seeking, sound, fullscreen and replay remain available; there is no story or download footer. The inline code tile rotates slightly on heading hover.

The homepage project collage has a physical-paper motion sequence: each card swings from its fastening point and settles over (1.15s), with (65ms) sibling delays. Hover straightens, lifts, enlarges, and tilts the selected card towards the pointer. Selection opens the inline project file over (560ms). The sequence runs once on arrival, or when “Swing the cards” is pressed; it does not loop. All spatial movement is removed for reduced-motion preferences.

The tech-stack fan deals into place over (950ms) with (55ms) card delays. Hover lifts and straightens a card above its neighbors, with subtle pointer tilt; its illustration shrinks into a mark and tool labels enter with (35ms) spacing. Category changes move the fan using transforms over (720ms). Keyboard focus centers the chosen card so its content stays within the phone viewport. Touch swipes, arrow buttons, and category buttons keep exploration manual. Reduced-motion preferences remove entrance, tilt, reveal, and navigation transitions.

Experience focus details unfold over (300ms). Monograms straighten on hover or keyboard focus; card shadows deepen subtly. Both companies remain visible, and details open independently. Reduced-motion preferences remove movement while retaining the disclosure state.

Milestone stories unfold over (350ms); stamps straighten on interaction over (400ms). Only one story opens at a time, with no automatic switching or looping. Education and award facts stay visible. Reduced-motion preferences remove movement while keeping the selected state clear.

Gallery closer-look controls move the center phone forward and spread its companions, switch browser compositions between overview and detail, or enlarge the ClearHead capture. These transitions finish after each action and never autoplay. Reduced motion removes transitions while preserving all selected views and viewer controls.

The playground has exactly three bounded studies: a saved-state button, adjustable Manrope type, and a user-triggered three-tile motion study. The motion study uses a (1.1s) animation with (0.12s) staggered delays. Section entrances run once as they enter view.

**The Motion at Your Pace Rule.** Entrances finish, project switching stays manual, and playground motion begins on request. Under `prefers-reduced-motion: reduce`, interface animations, transitions, and smooth scrolling are disabled. The introduction stays on its poster until explicitly played; visitors choose when to start it.

## Do's and Don'ts

### Do:

- **Do** preserve the rail, rounded sheet, and alternating editorial/showcase widths established by the pinned reference.
- **Do** use the final contrast-adjusted reading colors and the single-column, art-led Designs gallery.
- **Do** retain native small section labels for orientation and tactile pills for actions and selected states.
- **Do** preserve truthful visual provenance: label illustrative UI, and use actual project captures when available.
- **Do** preserve keyboard focus, named icon controls, mobile drawer behavior, and reduced-motion support.
- **Do** make motion finite and let visitors control project changes and playground replay.

### Don't:

- **Don't** turn every content row into a raised card or replace the narrow/wide composition with a repeated uniform grid.
- **Don't** promote pale illustrative text colors or tiny decorative captions into body-text defaults.
- **Don't** extend a gallery concept’s palette or typography, a project illustration palette, or a local italic signature into a new global visual system.
- **Don't** add an auto-advancing carousel, infinite playground, autoplay video, or continuously repeating experiment animation.
- **Don't** present illustrative UI as supplied screenshots or add invented metrics, testimonials, or agency proof as visual content.
