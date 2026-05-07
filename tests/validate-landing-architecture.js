const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const index = read('index.html');
const learnMore = read('learnmore.html');
const app = read('app.js');
const css = read('styles.css');
const pricing = read('pricing.html');

assert(/class="container hero-grid"/.test(index), 'Hero must use the two-column hero-grid layout');
assert(/class="proof-strip"/.test(index), 'Landing page must expose proof metrics immediately after hero');
assert(!/<script src="chat-data\.js"/.test(index), 'chat-data.js must not be loaded synchronously on index.html');
assert(/<script src="i18n\.js" defer><\/script>/.test(index), 'i18n.js should be deferred');
assert(/<script src="app\.js" defer><\/script>/.test(index), 'app.js should be deferred');
assert(/role="tablist" aria-label="Chat demo modes"/.test(index), 'Chat mode controls need tablist semantics');
assert(/role="tabpanel"/.test(index), 'Chat panels need tabpanel semantics');
assert(/class="navigation-card/.test(index), 'Learn More bridge should use navigation-card, not problem-card links');
assert(!/style="display:\s*none/.test(index), 'Index should not use inline display:none for state');
assert(!/class="problem-card fade-up" style="text-decoration: none; color: inherit;"/.test(index), 'Bridge links should not rely on inline link-card styling');
assert(/role="dialog" aria-modal="true"/.test(index), 'Mobile menu should expose dialog semantics');
assert(!/<script src="chat-data\.js"/.test(learnMore), 'learnmore.html should not load chat-data.js');
assert(!/data-i18n="ui\.vs_r1_c1">Personalization/.test(learnMore), 'Personalization comparison row must not reuse the Memory i18n key');
assert(/function updateComparisonLabels\(\)/.test(app), 'app.js must refresh responsive table labels after translation changes');
assert(/const AppConfig =/.test(app) && /mobileBreakpoint/.test(app), 'app.js should centralize runtime constants in AppConfig');
assert(/AppConfig\.chatDataSrc/.test(app), 'chat data source should be configurable');
assert(/\.content-auto/.test(css), 'CSS should include content-visibility helper');
assert(/\.hero-grid/.test(css), 'CSS should include optimized hero-grid styles');


assert(/id="packages"/.test(pricing), 'Pricing page should expose bundled packages before calculator');
assert(/Starter Pilot/.test(pricing) && /Growth Ops/.test(pricing) && /Business \/ Corporate/.test(pricing), 'Pricing page should include three bundled package tiers');
assert(/data-price-result="monthlySavings"/.test(pricing), 'Pricing calculator should output monthly savings');
assert(/const PricingRoiConfig =/.test(app), 'Pricing ROI assumptions should be centralized in PricingRoiConfig');
assert(/weeksPerMonth/.test(app), 'Pricing ROI calculator should centralize weeks-per-month assumption');
assert(/\.pricing-package-grid/.test(css), 'CSS should include package grid styles');

console.log('landing architecture OK');
