# Authentic film assets

Captured on 24 October 2026 from unmodified project frontends, with no signed-in accounts, private data, generated UI, fake results, or API credentials. These are interface previews, not evidence that backend services were tested. The user explicitly approved retaining original screenshot colors inside the sage/cream film.

| Asset | Source | Scope |
| --- | --- | --- |
| `campus-filters.png` | CampusMesh `2dbebdddd8f7c54f36436a9e7d85c302f6621616`, `frontend`, `/` | Real navigation, marketplace heading, search and filters. Crop x100–1335, y0–385 from a 1440×900 capture. The unavailable-backend area below this crop is not shown; no listings, maps, or routes were fabricated. |
| `campus-login.png` | Same CampusMesh checkout, `/login` | Unfilled login interface. |
| `adaptui.png` | Owner’s local AdaptUI checkout `d173f1ecb83cf0880f9055b62be37c5eeb6904ba`, `popup.html` | 440×840 popup preview; actual profile cards, without fabricated scan results or activation claims. |
| `clearhead.png` | ClearHead `d27ff6894ba577469922110369539d8814f38fa5`, `clearhead`, `/` | 1440×900 idle interface; no prompt submitted or AI response generated. The existing source hook error does not prevent this idle UI capture. |
| `splitgrid.png` | Expenses `34165fdd4915e907ae56b85b22ff01ea76d1933d`, `SplitGrid/frontend`, `/` | 1440×900 landing screen. |
| `splitgrid-create.png` | Same Expenses checkout | Existing Create Group screen, reached through its actual button. No group created. |
| `splitgrid-code.txt` | Same Expenses checkout, `frontend/src/context/AppContext.jsx`, lines 11–28 | Exact `simplifyDebts` source excerpt. |
| `safescan.webp` | Owner’s earlier portfolio `public/images/safescan-home.webp` | Byte-for-byte copy of the owner-supplied Figma design screenshot, documented there as supplied 15 October 2026. Presented as a design concept. |

The renderer adds browser framing outside screenshots and uses whole-image transforms or crops of actual existing components. It does not redraw their labels, recolor interfaces, or fabricate interactions. Source captures are kept outside `public/`; only the finished MP4, poster and captions ship to browsers.
