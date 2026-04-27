# Responin Landing Page

The official landing page for **Responin** — your personal AI agent for business automation.

🌐 **Live site:** [responin.com](https://responin.com)

---

## Overview

Responin builds dedicated AI agents that learn your workflows, remember your context, and operate with intimate knowledge of how your business runs. This landing page showcases the product's value proposition, features, and real-world use cases with a polished, conversion-focused design.

---

## Features

### Core Experience
- 🌐 **Bilingual** — Indonesian (default) and English with instant language switching via `i18n.js`
- 🌙 **Dark & Light Mode** — Theme toggle with `localStorage` persistence and smooth transitions
- 📱 **Fully Responsive** — Mobile-first design with hamburger menu, sticky mobile CTA, and touch-optimized interactions
- ⚡ **Zero Dependencies** — Vanilla HTML/CSS/JS, no build tools, no frameworks, runs directly in any browser

### Interactive Demos
- 💬 **1:1 Chat Demo** — 5 clickable scenarios showing real AI agent conversations:
  - 📋 Invoice status lookup
  - 📦 Delivery tracking
  - 📊 Sales summary & YoY comparison
  - ✉️ Email drafting & sending
  - 🔍 Customer history lookup
- 👥 **Group Chat Demo** — 3 team scenarios showing the agent in a collaborative context:
  - 📋 Project status update
  - 🚨 Order escalation handling
  - 📊 Weekly briefing generation

### Content Sections
- 📊 **Hero Stats Bar** — Animated counters (45%, 60%, 24/7, <30s) with eased transitions on scroll
- ⚔️ **Responin vs Generic AI** — 6-row comparison table (Memory, Personalization, Privacy, Growth, Action, Integration)
- 🔴 **The Problem** — 6 pain-point cards (Admin Black Hole, Disconnected Systems, Human Bottlenecks, Scale = Headcount, Decision Fatigue, Inconsistent Execution)
- ✅ **Core Solutions** — 9 solution cards:
  1. Intelligent Internal Reminders
  2. Natural Language Data Entry
  3. Automated Email Orchestration
  4. End-to-End Process Mapping
  5. Financial Monitoring & Alerts
  6. Sales & CRM Workflows
  7. Customer Support Automation
  8. Intelligent Reporting & Briefings
  9. Scheduling & Calendar Intelligence
- 🏭 **9 Industry Sectors** — Healthcare, Finance, Retail, Manufacturing, Legal, Logistics, Education, Real Estate, SaaS
- 📈 **Comparison Table** — Responin vs Traditional Methods (8 dimensions)
- ❓ **FAQ Accordion** — 6 expandable questions covering privacy, results, integrations, differentiation, safety, and setup
- 💬 **Quote Section** — Brand philosophy statement

### Legal Pages
- 📜 **Privacy Policy** — Full bilingual privacy policy (`privacy.html`)
- 📜 **Terms of Use** — Full bilingual terms of service (`termsofuse.html`)

### UI/UX
- ⚙️ **Settings Panel** — Language and theme controls in a dropdown (desktop) and mobile menu
- 🎭 **Scroll Animations** — Fade-up animations with staggered card reveals via `IntersectionObserver`
- 📲 **Sticky Mobile CTA** — Email CTA that appears on scroll past hero (mobile only)
- 🔍 **SEO & Social** — Open Graph meta tags, Twitter Card, favicon, and theme-color

---

## Project Structure

```
responin-landing/
├── index.html          # Main landing page (703 lines)
├── privacy.html        # Privacy Policy page (152 lines)
├── termsofuse.html     # Terms of Use page (172 lines)
├── styles.css          # All styles, dark/light themes (984 lines)
├── i18n.js             # EN/ID translations, namespaced (889 lines)
├── app.js              # All interactive logic (500 lines)
├── validate-i18n.js   # i18n validation script (161 lines)
├── CNAME               # Custom domain: responin.com
├── .gitignore          # Ignores .DS_Store
└── README.md           # This file
```

### Key Files Explained

| File | Purpose |
|------|---------|
| `index.html` | Single-page landing site — hero, comparison tables, chat demos, solutions, industries, FAQ, CTA, footer |
| `privacy.html` | Privacy policy with bilingual toggle, shares `styles.css` and `i18n.js` with main page |
| `termsofuse.html` | Terms of use with same shared architecture as privacy page |
| `styles.css` | Full CSS including dark/light themes, responsive breakpoints, animations, chat UI, FAQ accordion |
| `i18n.js` | All translations in 4 namespaces: `ui`, `chat`, `gc` (group chat), `legal`. Supports dot-notation key resolution |
| `app.js` | Language/theme switching, chat demos (1:1 + group), FAQ accordion, scroll animations, stats counter, sticky CTA |
| `validate-i18n.js` | Node.js script that validates EN↔ID key parity, duplicate detection, and HTML `data-i18n` attribute coverage |

---

## i18n Architecture

Translations are organized into **4 namespaces** in `i18n.js`:

- **`ui`** — All UI strings for the landing page (nav, hero, sections, FAQ, footer, etc.)
- **`chat`** — 1:1 chat demo scenarios (5 scenarios, each with EN/ID message arrays)
- **`gc`** — Group chat demo scenarios (3 scenarios with sender labels and multi-line messages)
- **`legal`** — Privacy policy and terms of use page content

Key resolution uses **dot notation** (`data-i18n="ui.hero_title"`) with `data-i18n-html` for HTML content and `data-i18n-placeholder` for input placeholders. Legal pages use `data-page-title` to dynamically set the `<title>`.

Run validation:
```bash
node validate-i18n.js
```

---

## Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/psatriyo/responin-landing.git
   ```
2. Open `index.html` in any browser — no server or build step needed

---

## Deployment

Deployed via **GitHub Pages** with a custom domain (`responin.com`). Pushing to `main` automatically publishes updates. The `CNAME` file ensures the custom domain is preserved across deployments.

---

## Customization

### Changing the Default Language
In `app.js`:
```js
const savedLang = localStorage.getItem('responin-lang') || 'id'; // Change to 'en' for English default
```

### Changing the Default Theme
In `app.js`:
```js
const savedTheme = localStorage.getItem('responin-theme') || 'dark'; // Change to 'light'
```

### Adding Chat Scenarios
Add new entries to `chatScenarios` in `app.js` with both `en` and `id` message arrays. Each message has `role` (user/agent), `text` (plain) or `html` (with `<span class="highlight">` tags).

### Adding Group Chat Scenarios
Add entries to `gcScenarios` in `app.js`. Include sender key mappings in `gcSenderAvatars` and avatar colors in `gcAvatarColors`.

### Adding Translations
Add new keys to both `en` and `id` objects in `i18n.js` under the appropriate namespace (`ui`, `chat`, `gc`, or `legal`). Reference them in HTML with `data-i18n="namespace.key"`.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, flexbox, grid, animations) |
| Logic | Vanilla JavaScript (ES6+) |
| Fonts | Google Fonts — Inter |
| i18n | Custom system via `data-i18n` attributes + `i18n.js` dictionary |
| Hosting | GitHub Pages |
| Domain | Custom via CNAME (responin.com) |

---

## License

© 2026 Responin. All rights reserved.