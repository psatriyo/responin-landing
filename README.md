# Responin Landing Page

Official static website for **Responin** — a personal AI operations agent for business automation.

🌐 **Live site:** <https://responin.com>
📦 **Repository:** <https://github.com/psatriyo/responin-landing>

---

## Overview

This repository contains the production GitHub Pages site for Responin. The site is a bilingual, conversion-focused lead-generation experience for founders, operators, SMB owners, and business decision-makers evaluating AI-driven operations automation.

The main landing page moves visitors through:

1. A concise hero with a product preview.
2. A proof strip with impact metrics.
3. Interactive direct-message and group-chat demos.
4. Problem, differentiation, and implementation-flow sections.
5. A bridge to the deeper Learn More page.
6. A Calendly booking CTA for a workflow audit.

The codebase intentionally remains **static and dependency-free**: plain HTML, CSS, and vanilla JavaScript. There is no bundler, package manager requirement, framework, or build step.

---

## Current Site Architecture

### Pages

| Page | Purpose | Primary assets |
|---|---|---|
| `index.html` | Main lead-generation landing page: hero, proof strip, chat demo, problem, why, how, Learn More bridge, CTA, footer | `styles.css`, `i18n.js`, `app.js`, lazy `chat-data.js` |
| `learnmore.html` | Deep-dive page: early-access proof, journey context, core solutions, industries, Responin vs generic AI, ROI teaser, FAQ, return path, CTA | `styles.css`, `i18n.js`, `app.js` |
| `privacy.html` | Bilingual privacy policy | `legal.css`, `i18n.js`, `i18n-legal.js`, `legal.js` |
| `termsofuse.html` | Bilingual terms of use | `legal.css`, `i18n.js`, `i18n-legal.js`, `legal.js` |

### Key implementation details

- **Lead capture destination:** all booking CTAs are normalized through `body[data-booking-url]` and `.booking-link` handling in `app.js`.
- **Language support:** Indonesian is the default language, with English available via settings controls.
- **Theme support:** dark mode is the default; light/dark preference persists in `localStorage`.
- **Main-page chat demo:** `chat-data.js` is lazy-loaded by `app.js` when the chat demo nears the viewport or when group-chat mode is requested.
- **Accessibility:** the site includes skip links, semantic landmarks, visible focus states, ARIA-aware mobile menu state, tablist semantics for chat demos, keyboard escape handling, and reduced-motion support.
- **Performance:** scripts on landing/deep-dive pages are deferred, chat scenarios are lazy-loaded, below-the-fold heavy sections use `content-visibility` helpers, and the site avoids runtime dependencies.

---

## Repository Structure

```text
responin-landing/
├── index.html                              # Main conversion landing page
├── learnmore.html                          # Deep-dive product/industry/comparison page
├── privacy.html                            # Privacy policy
├── termsofuse.html                         # Terms of use
├── styles.css                              # Main shared stylesheet for landing + learn-more pages
├── legal.css                               # Legal-page stylesheet
├── app.js                                  # Main shared interactive behavior
├── chat-data.js                            # Lazy-loaded chat-demo scenario data
├── i18n.js                                 # Landing + learn-more UI translations and group-chat labels
├── i18n-legal.js                           # Legal-page translations loaded only by legal pages
├── legal.js                                # Legal-page language switching
├── icons.svg                               # SVG sprite used by nav, settings, chat, CTA icons
├── CNAME                                   # GitHub Pages custom domain: responin.com
├── validate-site.js                        # Structural/regression checks for HTML architecture
├── validate-i18n.js                        # Translation parity and data-i18n coverage checks
├── tests/
│   └── validate-landing-architecture.js    # Landing architecture regression checks
├── IMPLEMENTATION_SPEC.md                  # Historical implementation/audit spec
├── CRO_COPY_AUDIT_v4.md                    # Historical CRO copy audit notes
├── ID_COPY_AUDIT.md                        # Historical Indonesian copy audit notes
├── ID_COPY_AUDIT_v3.md                     # Historical Indonesian copy audit notes
└── README.md                               # This file
```

---

## Features

### Core experience

- **Bilingual UI:** Indonesian (`id`) and English (`en`) via `data-i18n` attributes.
- **Persistent language preference:** stored as `responin-lang` in `localStorage`.
- **Persistent theme preference:** stored as `responin-theme` in `localStorage`.
- **Responsive navigation:** desktop nav, mobile hamburger menu, settings controls, and sticky mobile CTA.
- **Booking CTA normalization:** all `.booking-link` anchors are set from `AppConfig.bookingUrl`.
- **No build step:** files can be opened directly or served by any static server.

### Main landing page sections

`index.html` currently includes:

1. Fixed header/navigation.
2. Hero with two-column layout and product preview.
3. Proof strip with animated metrics: `45%`, `60%`, `24/7`, `<30s`.
4. Interactive chat demo:
   - Direct Message mode with 5 scenarios.
   - Group Chat mode with 3 scenarios.
5. Problem section with 6 pain-point cards.
6. Why Responin section with 3 differentiation pillars.
7. How It Works section with 4 implementation steps.
8. Learn More bridge with navigation cards to deeper content.
9. Final CTA section.
10. Footer and legal links.

### Learn More page sections

`learnmore.html` currently includes:

1. Early Access / social-proof strip.
2. Journey context: “Step 2 of 2”.
3. Core Solutions grid with 9 solution cards.
4. Industries section with detailed before/after examples for retail, finance, and startup/SaaS, plus additional industry coverage.
5. Responin vs Generic AI comparison table.
6. ROI teaser.
7. FAQ accordion.
8. Return path back to the main landing page.
9. Final CTA and footer.

### Interactive demos

`chat-data.js` provides:

- **Direct-message scenarios:**
  - Invoice status lookup.
  - Delivery tracking.
  - Sales summary and YoY comparison.
  - Email drafting/sending.
  - Customer history lookup.
- **Group-chat scenarios:**
  - Project status update.
  - Order escalation.
  - Weekly briefing.

Direct-message scenario text lives in `chat-data.js`. Group-chat localized line labels are resolved through the `gc` namespace in `i18n.js`.

---

## JavaScript Architecture

### `app.js`

Primary behavior for `index.html` and `learnmore.html`:

- `AppConfig` centralizes runtime constants:
  - booking URL,
  - default language/theme,
  - chat-data source,
  - animation timings,
  - mobile breakpoint,
  - IntersectionObserver thresholds.
- `CssClass` centralizes shared state class names.
- Language switching:
  - applies `data-i18n`, `data-i18n-html`, and `data-i18n-placeholder`,
  - updates document language,
  - updates translated comparison-table mobile labels.
- Theme switching:
  - persists selection,
  - updates active theme buttons,
  - shows a small chat-style theme message when relevant.
- Mobile menu:
  - opens/closes with ARIA state updates,
  - traps focus while open,
  - restores focus to the trigger.
- Chat demo:
  - lazy-loads `chat-data.js`,
  - renders direct/group messages dynamically,
  - maintains active tab/ARIA state.
- FAQ accordion.
- Reveal animations and stat counters with reduced-motion fallback.
- Sticky mobile CTA visibility.

### `legal.js`

Legal pages intentionally use a smaller script. It only handles:

- legal-page translation application,
- language switching,
- legal page title updates.

---

## i18n Architecture

### Translation files

| File | Loaded by | Contents |
|---|---|---|
| `i18n.js` | `index.html`, `learnmore.html`, legal pages | Core `translations` object with `ui`, empty/reserved `chat`, and `gc` namespaces |
| `i18n-legal.js` | `privacy.html`, `termsofuse.html` | Extends `translations` with the `legal` namespace |

### Namespaces

- `ui` — landing and learn-more UI copy, labels, CTAs, FAQ, footer, metrics.
- `chat` — currently reserved/empty; direct-message scenarios are stored in `chat-data.js`.
- `gc` — group-chat scenario labels and localized message lines.
- `legal` — privacy policy and terms copy, loaded from `i18n-legal.js`.

### HTML attributes

- `data-i18n="ui.some_key"` replaces text content.
- `data-i18n-html` allows trusted translation strings containing small inline markup.
- `data-i18n-placeholder="ui.some_key"` updates placeholders where needed.
- `data-page-title="legal.some_key"` is used by legal pages for translated document titles.

When adding or changing translation keys, update both `en` and `id` values and run validation.

---

## CSS Architecture

### `styles.css`

Used by the main landing and Learn More pages. It contains:

- reset/base styles,
- CSS custom properties for theme tokens,
- dark and light theme variables,
- navigation and mobile menu styles,
- hero/proof strip styles,
- card grids and section layouts,
- chat UI styles,
- FAQ and comparison table styles,
- responsive breakpoints,
- reduced-motion handling,
- utility classes such as:
  - `.is-hidden`,
  - `.is-visible`,
  - `.justify-center`,
  - `.text-center`,
  - `.content-auto`.

### `legal.css`

Used only by `privacy.html` and `termsofuse.html` for legal-page typography/layout and the simpler legal-page language toggle.

---

## Validation & QA

Run all checks from the repository root:

```bash
node --check app.js
node validate-site.js
node validate-i18n.js
node tests/validate-landing-architecture.js
```

What these cover:

- `node --check app.js` — JavaScript syntax check.
- `node validate-site.js` — required landmarks, CTAs, script loading expectations, legal-page separation, and key structural regressions.
- `node validate-i18n.js` — EN/ID key parity, duplicate key checks, HTML `data-i18n` coverage, and legal page title keys.
- `node tests/validate-landing-architecture.js` — landing layout, lazy chat loading, ARIA/tab semantics, comparison-table key correctness, and content-visibility helpers.

Optional local smoke test:

```bash
python3 -m http.server 8765
# then open:
# http://127.0.0.1:8765/index.html
# http://127.0.0.1:8765/learnmore.html
# http://127.0.0.1:8765/privacy.html
# http://127.0.0.1:8765/termsofuse.html
```

---

## Local Development

### Quick start

```bash
git clone https://github.com/psatriyo/responin-landing.git
cd responin-landing
python3 -m http.server 8765
```

Then visit <http://127.0.0.1:8765/>.

You can also open the HTML files directly in a browser, but a local server better matches GitHub Pages behavior for linked assets.

### Editing common site values

#### Booking URL

The booking URL is set in each page’s `<body>`:

```html
<body data-booking-url="https://calendly.com/hi-responin/30min">
```

`app.js` reads this into `AppConfig.bookingUrl` and applies it to `.booking-link` anchors.

#### Default language

The default language comes from the root `<html lang="id">` value and is read by `AppConfig.defaultLang`.

#### Default theme

The default theme is defined in `AppConfig.defaultTheme` inside `app.js`.

#### Adding landing/learn-more translations

1. Add the key under `translations.en.ui` and `translations.id.ui` in `i18n.js`.
2. Reference it in HTML with `data-i18n="ui.your_key"`.
3. Run `node validate-i18n.js`.

#### Adding legal translations

1. Add the key under the `legal` namespace in `i18n-legal.js` for both languages.
2. Reference it from `privacy.html` or `termsofuse.html`.
3. Run `node validate-i18n.js`.

#### Adding a direct-message chat scenario

1. Add a scenario under `chatScenarios` in `chat-data.js`.
2. Include both `en` and `id` arrays.
3. Add a corresponding tab/button in `index.html` with `data-scenario="your_key"`.
4. Ensure each message uses either `text` for plain text or `html` for trusted inline formatting.
5. Run the validation suite.

#### Adding a group-chat scenario

1. Add the scenario under `gcScenarios` in `chat-data.js`.
2. Add sender/message translation keys under `translations.en.gc` and `translations.id.gc` in `i18n.js`.
3. Update `gcSenderAvatars` and `gcAvatarColors` if needed.
4. Add a corresponding tab/button in `index.html` with `data-gc-scenario="your_key"`.
5. Run the validation suite.

---

## Deployment

The site is deployed through **GitHub Pages** using the custom domain in `CNAME`:

```text
responin.com
```

Pushing or merging changes into `main` publishes the updated static site through GitHub Pages.

**Repository convention:** make changes on a branch and open a PR against `main`. Do not push directly to `main`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3, CSS custom properties, flexbox, grid, responsive media queries |
| Logic | Vanilla JavaScript |
| Fonts | Google Fonts — Inter |
| Icons | Local SVG sprite: `icons.svg` |
| i18n | Custom `data-i18n` dictionary system |
| Hosting | GitHub Pages |
| Domain | `CNAME` → `responin.com` |

---

## Maintenance Notes

- Keep `README.md` aligned with structural changes to HTML, JS, CSS, and validation scripts.
- Run validation before opening PRs.
- Preserve the no-build, dependency-free deployment model unless the project explicitly adopts a build pipeline.
- Keep legal-page logic separate from main landing-page logic.
- Avoid inline layout styles; prefer reusable classes in `styles.css` or `legal.css`.
- Prefer lazy loading for heavy or below-the-fold interactive data.

---

## License

© 2026 Responin. All rights reserved.
