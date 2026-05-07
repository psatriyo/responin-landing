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


assert(/id="pricing-story"/.test(pricing), 'Pricing page should expose an Indonesia-relatable pricing story');
assert(/id="pricing-structure"/.test(pricing), 'Pricing page should retain modular pricing structure');
assert(/pricing_agent_definition_desc/.test(pricing), 'Pricing page should define one agent with concrete team/workflow examples');
assert(/name="commitmentMonths"/.test(pricing), 'Pricing calculator should include a commitment length control');
assert(/data-price-result="commitmentTotal"/.test(pricing), 'Pricing calculator should show all-in total after commitment discount');
assert(!/admin\/coordinator|staffComparison/.test(pricing), 'Pricing calculator should remove admin/coordinator comparison UI');
assert(!/\bbots?\b/i.test(pricing), 'Pricing page customer-facing copy should use agents, not bots');
assert(/const PricingConfig =/.test(app), 'Pricing assumptions should be centralized in PricingConfig');
assert(/commitmentDiscounts/.test(app), 'Commitment discount thresholds should be centralized in PricingConfig');
assert(/calculateTieredMonthly/.test(app), 'Pricing calculator should use reusable tiered monthly calculation');
assert(/calculateCommitmentDiscountRate/.test(app), 'Pricing calculator should use reusable commitment discount calculation');
assert(/\.pricing-story-grid/.test(css), 'CSS should include pricing story grid styles');

console.log('landing architecture OK');
