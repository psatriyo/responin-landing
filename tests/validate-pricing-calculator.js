const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const appSource = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const i18nSource = fs.readFileSync(path.join(root, 'i18n.js'), 'utf8')
  .replace(/^const translations/, 'var translations')
  .replace(/let currentLang\s*=\s*['"][^'"]*['"];?/, 'var currentLang = "en";');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const noop = () => {};
const context = {
  console,
  module: { exports: {} },
  localStorage: { getItem: () => null, setItem: noop },
  window: {
    matchMedia: () => ({ matches: false }),
    addEventListener: noop,
    setTimeout: noop,
  },
  document: {
    body: { dataset: {} },
    documentElement: {
      lang: 'en',
      dataset: {},
      classList: { toggle: noop },
      setAttribute: noop,
    },
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    addEventListener: noop,
  },
  IntersectionObserver: function IntersectionObserver() {
    return { observe: noop, unobserve: noop };
  },
};
context.window.document = context.document;
context.globalThis = context;

vm.createContext(context);
vm.runInContext(i18nSource, context);
vm.runInContext(
  appSource.replace(/\ninitApp\(\);\s*$/, `\nmodule.exports = {\n    PricingConfig,\n    calculateTieredMonthly,\n    calculateSharedUsageCount,\n    calculateCommitmentDiscountRate,\n    formatMonthCount,\n    formatDiscount,\n  };`),
  context,
);

const {
  PricingConfig,
  calculateTieredMonthly,
  calculateSharedUsageCount,
  calculateCommitmentDiscountRate,
  formatMonthCount,
  formatDiscount,
} = context.module.exports;

assert(PricingConfig.support.monitoring.firstAgent === 1699000, 'monitoring first-agent monthly support should be Rp1.699.000');
assert(PricingConfig.support.maintenance.firstAgent === 799000, 'maintenance first-agent monthly support should be Rp799.000');
assert(PricingConfig.aiUsageMonthly.smart === 1899000, 'smart AI usage should be Rp1.899.000');

assert(PricingConfig.commitmentDiscounts.sixMonths.threshold === 6, '6-month discount threshold should be centralized at 6 months');
assert(PricingConfig.commitmentDiscounts.sixMonths.rate === 0.1, '6-month commitment should apply 10% discount');
assert(PricingConfig.commitmentDiscounts.twelveMonths.threshold === 12, '12-month discount threshold should be centralized at 12 months');
assert(PricingConfig.commitmentDiscounts.twelveMonths.rate === 0.2, '12-month commitment should apply 20% discount');

assert(calculateCommitmentDiscountRate(1) === 0, '1 month should have no commitment discount');
assert(calculateCommitmentDiscountRate(5) === 0, '5 months should have no commitment discount');
assert(calculateCommitmentDiscountRate(6) === 0.1, '6 months should receive 10% discount');
assert(calculateCommitmentDiscountRate(11) === 0.1, '11 months should keep 10% discount');
assert(calculateCommitmentDiscountRate(12) === 0.2, '12 months should receive 20% discount');

assert(calculateTieredMonthly(1, PricingConfig.setup) === 1999000, 'first agent setup should be Rp1.999.000');
assert(calculateTieredMonthly(3, PricingConfig.setup) === 4997000, 'third agent setup should include two additional-agent fees');
assert(calculateSharedUsageCount(1) === 1, '1 agent should need 1 shared usage');
assert(calculateSharedUsageCount(2) === 1, '2 agents should need 1 shared usage');
assert(calculateSharedUsageCount(3) === 2, '3 agents should need 2 shared usages');
assert(formatMonthCount(1) === '1 month', 'singular month label should be localized');
assert(formatMonthCount(6) === '6 months', 'plural month label should be localized');
assert(formatDiscount(0.1, 479600) === '10% · Rp479.600 saved', 'discount label should include localized savings amount');

console.log('pricing calculator OK');
