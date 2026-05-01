function resolveLegalTranslation(lang, key) {
  const root = translations?.[lang];
  if (!root) return undefined;
  return key.split('.').reduce((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) return acc[part];
    return undefined;
  }, root);
}

function applyLegalTranslations(lang) {
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    const value = resolveLegalTranslation(lang, key);
    if (value === undefined) return;

    if (el.hasAttribute('data-i18n-html')) el.innerHTML = value;
    else el.textContent = value;
  });

  const titleKey = document.documentElement.dataset.pageTitle;
  if (titleKey) {
    const title = resolveLegalTranslation(lang, titleKey);
    if (title) document.title = title;
  }

  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function setLegalTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('responin-lang', lang);
  applyLegalTranslations(lang);
}

document.addEventListener('click', (event) => {
  const langButton = event.target.closest('[data-lang]');
  if (langButton) setLang(langButton.dataset.lang);
});

const savedLang = localStorage.getItem('responin-lang') || document.documentElement.lang || 'id';
setLang(savedLang);
setLegalTheme(localStorage.getItem('responin-theme') || 'dark');
