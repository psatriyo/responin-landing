#!/usr/bin/env node
/**
 * i18n Validation Script
 * Validates that:
 * 1. All EN keys exist in ID and vice versa (within each namespace)
 * 2. No duplicate keys within any namespace
 * 3. All HTML data-i18n attributes have matching keys
 */

const fs = require('fs');
const path = require('path');

// Load and eval the translations (i18n.js uses `const` which is block-scoped in eval)
const i18nContent = fs.readFileSync(path.join(__dirname, 'i18n.js'), 'utf-8');
// Replace `const translations` with `var translations` so it's accessible after eval
const evalContent = i18nContent
  .replace(/^const translations/, 'var translations')
  .replace(/let currentLang\s*=\s*['"][^'"]*['"];/, '');
eval(evalContent);

// Load legal translations (split into i18n-legal.js for performance)
const i18nLegalPath = path.join(__dirname, 'i18n-legal.js');
if (fs.existsSync(i18nLegalPath)) {
  const legalEvalContent = fs.readFileSync(i18nLegalPath, 'utf-8');
  eval(legalEvalContent);
}

const namespaces = ['ui', 'chat', 'gc', 'legal'];
const langs = ['en', 'id'];
let errors = [];
let warnings = [];

// 1. Check EN ↔ ID parity per namespace
for (const ns of namespaces) {
  const enKeys = Object.keys(translations.en[ns] || {}).sort();
  const idKeys = Object.keys(translations.id[ns] || {}).sort();

  const enOnly = enKeys.filter(k => !idKeys.includes(k));
  const idOnly = idKeys.filter(k => !enKeys.includes(k));

  if (enOnly.length > 0) {
    errors.push(`[${ns}] Keys in EN but missing in ID: ${enOnly.join(', ')}`);
  }
  if (idOnly.length > 0) {
    errors.push(`[${ns}] Keys in ID but missing in EN: ${idOnly.join(', ')}`);
  }

  if (enOnly.length === 0 && idOnly.length === 0) {
    console.log(`✓ [${ns}] EN ↔ ID keys match (${enKeys.length} keys each)`);
  }
}

// 2. Check for duplicate keys within each namespace
for (const ns of namespaces) {
  for (const lang of langs) {
    const obj = translations[lang][ns];
    if (!obj) {
      warnings.push(`[${lang}.${ns}] Namespace not found`);
      continue;
    }
    const keys = Object.keys(obj);
    const seen = {};
    for (const key of keys) {
      if (seen[key]) {
        errors.push(`[${lang}.${ns}] Duplicate key: ${key}`);
      }
      seen[key] = true;
    }
  }
}

// 3. Check HTML data-i18n attributes have matching keys
function resolveKey(obj, dotKey) {
  const parts = dotKey.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return current;
}

function checkHtmlFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const regex = /data-i18n(?:-placeholder)?="([^"]+)"/g;
  let match;
  const htmlKeys = [];
  while ((match = regex.exec(content)) !== null) {
    htmlKeys.push(match[1]);
  }

  const uniqueHtmlKeys = [...new Set(htmlKeys)];

  for (const key of uniqueHtmlKeys) {
    const parts = key.split('.');
    if (parts.length < 2) {
      errors.push(`[${path.basename(filePath)}] Invalid dot-notation key (no namespace): ${key}`);
      continue;
    }
    const ns = parts[0];

    if (!namespaces.includes(ns)) {
      errors.push(`[${path.basename(filePath)}] Unknown namespace "${ns}" for key: ${key}`);
      continue;
    }

    // Check in both languages
    const enVal = resolveKey(translations.en, key);
    const idVal = resolveKey(translations.id, key);

    if (enVal === undefined && idVal === undefined) {
      errors.push(`[${path.basename(filePath)}] Key "${key}" not found in any language`);
    }
  }

  console.log(`  Checked ${uniqueHtmlKeys.length} unique data-i18n keys in ${path.basename(filePath)}`);
}

// Also check data-page-title attributes
function checkPageTitles() {
  const files = {
    'privacy.html': 'legal.priv_page_title',
    'termsofuse.html': 'legal.terms_page_title'
  };
  for (const [file, expectedKey] of Object.entries(files)) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf-8');
    const match = content.match(/data-page-title="([^"]+)"/);
    if (match) {
      const key = match[1];
      if (key !== expectedKey) {
        errors.push(`[${file}] data-page-title="${key}" should be "${expectedKey}"`);
      }
      // Verify the key exists
      const val = resolveKey(translations.en, key);
      if (val === undefined) {
        errors.push(`[${file}] data-page-title key "${key}" not found in translations`);
      }
    }
  }
}

console.log('\n=== i18n Validation ===\n');

const htmlFiles = ['index.html', 'privacy.html', 'termsofuse.html'];
for (const f of htmlFiles) {
  if (fs.existsSync(f)) checkHtmlFile(f);
}

checkPageTitles();

console.log('\n=== Results ===');
if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All validations passed!');
} else {
  if (errors.length > 0) {
    console.log(`\n❌ Errors (${errors.length}):`);
    errors.forEach(e => console.log(`  • ${e}`));
  }
  if (warnings.length > 0) {
    console.log(`\n⚠️  Warnings (${warnings.length}):`);
    warnings.forEach(w => console.log(`  • ${w}`));
  }
}

process.exit(errors.length > 0 ? 1 : 0);