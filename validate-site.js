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
  validateLegal('privacy.html');
  validateLegal('termsofuse.html');
  console.log('site structure OK');
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
