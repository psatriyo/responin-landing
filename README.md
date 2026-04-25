# Responin Landing Page

The official landing page for **Responin** — your personal AI agent for business automation.

## Overview

Responin builds dedicated AI agents that learn your workflows, remember your context, and operate with intimate knowledge of how your business runs. This landing page showcases the product's value proposition, features, and real-world use cases.

## Features

- 🌐 **Bilingual** — Indonesian (default) and English with instant language switching
- 🌙 **Dark & Light Mode** — Theme toggle with user preference persistence
- 💬 **Interactive Chat Demo** — 5 clickable scenarios showing real AI agent conversations
- 📊 **Comparison Tables** — Responin vs Generic AI, and Responin vs Traditional Methods
- 🏭 **9 Industry Sectors** — Healthcare, Finance, Retail, Manufacturing, Legal, Logistics, Education, Real Estate, SaaS
- 📱 **Responsive** — Mobile-first design with smooth scroll animations
- ⚙️ **Settings Panel** — Language and theme controls in a clean dropdown

## Tech Stack

- **HTML5 / CSS3 / Vanilla JS** — No frameworks, no build tools, zero dependencies
- **Google Fonts** — Inter typeface
- **GitHub Pages** — Ready for deployment via CNAME

## Project Structure

```
responin-landing/
├── index.html    # Single-file landing page (HTML + CSS + JS)
├── CNAME         # Custom domain for GitHub Pages
└── README.md     # This file
```

## Getting Started

1. Clone the repo
   ```bash
   git clone https://github.com/psatriyo/responin-landing.git
   ```
2. Open `index.html` in any browser — no server needed

## Deployment

This project is deployed via **GitHub Pages**. Pushing to `main` automatically publishes updates.

## Customization

### Changing the Default Language
In the `<script>` section, modify:
```js
let currentLang = 'id'; // Change to 'en' for English default
```

### Changing the Default Theme
The theme is stored in `localStorage`. To change the default:
```js
const savedTheme = localStorage.getItem('responin-theme') || 'dark'; // Change to 'light'
```

### Adding Chat Scenarios
Add new entries to the `chatScenarios` object in the JS section, with both `en` and `id` arrays.

## License

© 2026 Responin. All rights reserved.