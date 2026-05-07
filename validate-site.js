const fs = require('fs');
const path = require('path');

const root = __dirname;
const BOOKING_URL = 'https://calendly.com/hi-responin/30min';

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function count(text, pattern) {
  return (text.match(pattern) || []).length;
}

function validateIndex() {
  const html = read('index.html');
  assert(/<header>[\s\S]*<nav>/i.test(html), 'index.html is missing header/nav landmarks');
  assert(/<main id="main">/i.test(html), 'index.html is missing <main id="main">');
  assert(/href="#main" class="skip-link"/i.test(html), 'index.html skip link is missing');
  assert(!/onclick=/i.test(html), 'index.html still contains inline onclick handlers');
  assert(!/<section class="section" id="compare">/i.test(html), 'index.html still contains the deferred #compare section');
  assert(/application\/ld\+json/i.test(html), 'index.html is missing structured data');
  assert(/rel="canonical" href="https:\/\/responin.com\/"/i.test(html), 'index.html is missing canonical URL');
  assert(count(html, new RegExp(BOOKING_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) >= 4, 'index.html does not use the booking CTA consistently');
  assert(!/mailto:/i.test(html), 'index.html still contains mailto links');
}

function validateLearnMore() {
  const html = read('learnmore.html');
  assert(/<header>[\s\S]*<nav>/i.test(html), 'learnmore.html is missing header/nav landmarks');
  assert(/<main id="main">/i.test(html), 'learnmore.html is missing <main id="main">');
  assert(/href="#main" class="skip-link"/i.test(html), 'learnmore.html skip link is missing');
  assert(!/onclick=/i.test(html), 'learnmore.html still contains inline onclick handlers');
  assert(!/style="/i.test(html), 'learnmore.html should not rely on inline layout styles');
  assert(!/<script src="chat-data\.js"/i.test(html), 'learnmore.html should not load chat-data.js');
  assert(/<script src="i18n\.js" defer><\/script>/i.test(html), 'learnmore.html should defer i18n.js');
  assert(/<script src="app\.js" defer><\/script>/i.test(html), 'learnmore.html should defer app.js');
  assert(/data-i18n="ui\.vs_r2_c1">Personalization/i.test(html), 'learnmore.html comparison personalization row uses the wrong i18n key');
}

function validatePricing() {
  const html = read('pricing.html');
  assert(/<header>[\s\S]*<nav>/i.test(html), 'pricing.html is missing header/nav landmarks');
  assert(/<main id="main">/i.test(html), 'pricing.html is missing <main id="main">');
  assert(/href="#main" class="skip-link"/i.test(html), 'pricing.html skip link is missing');
  assert(/data-pricing-calculator/i.test(html), 'pricing.html is missing pricing calculator markup');
  assert(/id="pricing-story"/i.test(html), 'pricing.html is missing Indonesia-relatable pricing story section');
  assert(/id="pricing-structure"/i.test(html), 'pricing.html is missing modular pricing structure section');
  assert(/Monthly Cost Estimator/i.test(html), 'pricing.html should use modular monthly cost framing');
  assert(/What counts as one agent\?/i.test(html), 'pricing.html should define what one agent means');
  assert(/data-price-result="commitmentTotal"/i.test(html), 'pricing.html should calculate all-in commitment totals');
  assert(/name="commitmentMonths"[^>]+type="range"|type="range"[^>]+name="commitmentMonths"/i.test(html), 'pricing.html should expose a month commitment slider');
  assert(!/admin\/coordinator|Vs one admin\/coordinator/i.test(html), 'pricing.html should not include staff comparison fields');
  assert(!/\bbots?\b/i.test(html), 'pricing.html customer-facing copy should use agents, not bots');
  assert(/Server<\/h4>/i.test(html) && /AI usage<\/h4>/i.test(html), 'pricing.html should keep server and AI usage as modular components');
  assert(!/First Section|Second Section|hours saved per person|hourly/i.test(html), 'pricing.html should not expose placeholder labels or hourly-rate ROI framing');
  assert(/href="pricing\.html" class="nav-link"/i.test(html), 'pricing.html should link to itself in desktop nav');
  assert(/<script src="i18n\.js" defer><\/script>/i.test(html), 'pricing.html should defer i18n.js');
  assert(/<script src="app\.js" defer><\/script>/i.test(html), 'pricing.html should defer app.js');
  assert(!/onclick=/i.test(html), 'pricing.html still contains inline onclick handlers');
  assert(!/style="/i.test(html), 'pricing.html should not rely on inline layout styles');
}

function validateLegal(file) {
  const html = read(file);
  assert(/<main id="main">/i.test(html), `${file} is missing <main id="main">`);
  assert(/href="#main" class="skip-link"/i.test(html), `${file} is missing skip link`);
  assert(!/onclick=/i.test(html), `${file} still contains inline onclick handlers`);
  assert(/<script src="legal.js"><\/script>/i.test(html), `${file} should load legal.js`);
  assert(!/<script src="app.js"><\/script>/i.test(html), `${file} should not load app.js`);
}

try {
  validateIndex();
  validateLearnMore();
  validatePricing();
  validateLegal('privacy.html');
  validateLegal('termsofuse.html');
  console.log('site structure OK');
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
