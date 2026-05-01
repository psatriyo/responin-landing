const AppConfig = {
  bookingUrl: document.body?.dataset.bookingUrl || 'https://calendly.com/hi-responin/30min'
};

const AppState = {
  currentScenario: 'invoice',
  currentGcScenario: 'project',
  chatDataLoaded: false,
  statsCounted: false,
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  lastMenuTrigger: null
};

const langChangeCallbacks = [];
const themeChangeCallbacks = [];

function onLangChange(cb) {
  langChangeCallbacks.push(cb);
}

function onThemeChange(cb) {
  themeChangeCallbacks.push(cb);
}

function resolveTranslation(lang, key) {
  const root = translations?.[lang];
  if (!root) return undefined;
  return key.split('.').reduce((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) return acc[part];
    return undefined;
  }, root);
}

function applyTranslations(lang) {
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    const value = resolveTranslation(lang, key);
    if (value === undefined) return;

    if (el.hasAttribute('data-i18n-html')) el.innerHTML = value;
    else el.textContent = value;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    const value = resolveTranslation(lang, key);
    if (value !== undefined) el.setAttribute('placeholder', value);
  });

  const titleKey = document.documentElement.dataset.pageTitle;
  if (titleKey) {
    const title = resolveTranslation(lang, titleKey);
    if (title) document.title = title;
  } else {
    document.title = lang === 'id'
      ? 'Responin — Agen AI Personal untuk Otomasi Bisnis Anda'
      : 'Responin — Your Personal AI Agent for Business Automation';
  }

  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  document.querySelectorAll('.lang-btn-nav').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('responin-lang', lang);
  applyTranslations(lang);
  langChangeCallbacks.forEach((cb) => cb(lang));
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('responin-theme', theme);
  document.querySelectorAll('[data-theme-opt]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.themeOpt === theme);
  });
  themeChangeCallbacks.forEach((cb) => cb(theme));
}

function openSettings() {
  const dropdown = document.getElementById('settingsDropdown');
  const button = document.querySelector('[data-action="toggle-settings"]');
  if (!dropdown || !button) return;
  dropdown.classList.add('open');
  button.setAttribute('aria-expanded', 'true');
}

function closeSettings() {
  const dropdown = document.getElementById('settingsDropdown');
  const button = document.querySelector('[data-action="toggle-settings"]');
  if (!dropdown || !button) return;
  dropdown.classList.remove('open');
  button.setAttribute('aria-expanded', 'false');
}

function toggleSettings() {
  const dropdown = document.getElementById('settingsDropdown');
  if (!dropdown) return;
  if (dropdown.classList.contains('open')) closeSettings();
  else openSettings();
}

function getFocusableElements(container) {
  return Array.from(container.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
}

function openMobileMenu(trigger) {
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileOverlay');
  const hamburger = document.querySelector('[data-action="open-mobile-menu"]');
  if (!menu || !overlay || !hamburger) return;

  AppState.lastMenuTrigger = trigger || document.activeElement;
  menu.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  hamburger.setAttribute('aria-expanded', 'true');

  const focusables = getFocusableElements(menu);
  if (focusables.length) focusables[0].focus();
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileOverlay');
  const hamburger = document.querySelector('[data-action="open-mobile-menu"]');
  if (!menu || !overlay || !hamburger) return;

  menu.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  hamburger.setAttribute('aria-expanded', 'false');
  AppState.lastMenuTrigger?.focus?.();
}

function trapMenuFocus(event) {
  const menu = document.getElementById('mobileMenu');
  if (!menu || !menu.classList.contains('open') || event.key !== 'Tab') return;

  const focusables = getFocusableElements(menu);
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function initRevealAnimations() {
  const fadeEls = document.querySelectorAll('.fade-up');
  if (!fadeEls.length) return;

  if (AppState.reducedMotion || !('IntersectionObserver' in window)) {
    fadeEls.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach((el) => observer.observe(el));

  document.querySelectorAll('.solution-card, .problem-card, .step, .faq-item, .industry-deep').forEach((card, i) => {
    card.style.transitionDelay = `${(i % 4) * 0.08}s`;
  });
}

function initComparisonWrappers() {
  document.querySelectorAll('.comparison-wrapper').forEach((wrapper) => {
    const table = wrapper.querySelector('.comparison-table');
    if (table) {
      const headers = Array.from(table.querySelectorAll('thead th')).map((th) => th.textContent.trim());
      table.querySelectorAll('tbody tr').forEach((row) => {
        const cells = row.querySelectorAll('td');
        if (!cells.length) return;
        cells[0].setAttribute('data-cell-role', 'row-heading');
        if (cells[1]) cells[1].setAttribute('data-label', headers[1] || '');
        if (cells[2]) cells[2].setAttribute('data-label', headers[2] || '');
      });
    }

    const updateState = () => {
      const atEnd = wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth - 4;
      wrapper.classList.toggle('scrolled-end', atEnd);
    };
    wrapper.addEventListener('scroll', updateState, { passive: true });
    updateState();
  });
}

function setBookingLinks() {
  document.querySelectorAll('.booking-link').forEach((link) => {
    link.setAttribute('href', AppConfig.bookingUrl);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
}

function renderChatMessages(container, messages, type) {
  if (!container) return;
  container.innerHTML = '';

  messages.forEach((message, i) => {
    const item = document.createElement('div');
    item.className = `${type === 'group' ? 'gc-msg' : 'chat-msg'} ${message.role}`;
    if (!AppState.reducedMotion) item.style.animationDelay = `${i * 0.3}s`;

    const avatar = document.createElement('div');
    avatar.className = 'chat-msg-avatar';

    if (type === 'group') {
      if (message.role === 'agent') {
        avatar.textContent = 'R';
        avatar.style.background = 'linear-gradient(135deg, var(--gradient-1), var(--gradient-2))';
        avatar.style.color = '#fff';
      } else {
        const senderKey = message.sender;
        const letter = gcSenderAvatars?.[senderKey] || senderKey?.charAt(0)?.toUpperCase() || 'R';
        avatar.textContent = letter;
        avatar.style.background = gcAvatarColors?.[letter] || 'rgba(255,255,255,0.1)';
      }
    } else {
      avatar.textContent = message.role === 'user' ? 'Y' : 'R';
    }

    const bubble = document.createElement('div');
    bubble.className = 'chat-msg-bubble';

    if (type === 'group' && message.role !== 'system') {
      const sender = document.createElement('div');
      sender.className = 'gc-sender';
      sender.textContent = message.role === 'agent'
        ? 'Responin'
        : resolveTranslation(currentLang, `gc.${message.sender}`)
          || resolveTranslation('en', `gc.${message.sender}`)
          || message.sender;
      bubble.appendChild(sender);
    }

    if (message.lines) {
      const mainLine = document.createElement('div');
      mainLine.innerHTML = resolveTranslation(currentLang, `gc.${message.html}`)
        || resolveTranslation('en', `gc.${message.html}`)
        || '';
      bubble.appendChild(mainLine);
      message.lines.forEach((lineKey) => {
        const line = document.createElement('div');
        line.innerHTML = resolveTranslation(currentLang, `gc.${lineKey}`)
          || resolveTranslation('en', `gc.${lineKey}`)
          || '';
        bubble.appendChild(line);
      });
    } else if (message.html) {
      const key = type === 'group' ? `gc.${message.html}` : null;
      bubble.innerHTML += key
        ? (resolveTranslation(currentLang, key) || resolveTranslation('en', key) || '')
        : message.html;
    } else {
      const key = type === 'group' ? `gc.${message.text}` : null;
      bubble.textContent = key
        ? (resolveTranslation(currentLang, key) || resolveTranslation('en', key) || message.text)
        : message.text;
    }

    item.appendChild(avatar);
    item.appendChild(bubble);
    container.appendChild(item);
  });
}

function switchScenario(key) {
  if (typeof chatScenarios === 'undefined') return;
  AppState.currentScenario = key;
  const messages = chatScenarios[key]?.[currentLang] || chatScenarios[key]?.en || [];
  renderChatMessages(document.getElementById('chatMessages'), messages, 'single');

  document.querySelectorAll('[data-chat-tabs="primary"] .chat-tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.scenario === key);
  });
}

function switchGcScenario(key) {
  if (typeof gcScenarios === 'undefined') return;
  AppState.currentGcScenario = key;
  const messages = gcScenarios[key]?.[currentLang] || gcScenarios[key]?.en || [];
  renderChatMessages(document.getElementById('gcMessages'), messages, 'group');

  document.querySelectorAll('[data-chat-tabs="group"] .chat-tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.gcScenario === key);
  });
}

function initChatData() {
  if (AppState.chatDataLoaded) return;
  const script = document.createElement('script');
  script.src = 'chat-data.js';
  script.async = true;
  document.head.appendChild(script);
}

function initChatObserver() {
  const chatSection = document.querySelector('.chat-demo');
  if (!chatSection) return;

  if (AppState.reducedMotion || !('IntersectionObserver' in window)) {
    initChatData();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      initChatData();
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '200px 0px' });

  observer.observe(chatSection);
}

function initFaq() {
  document.querySelectorAll('.faq-item').forEach((item, index) => {
    const button = item.querySelector('[data-faq-trigger]');
    const answer = item.querySelector('.faq-answer');
    if (!button || !answer) return;

    const buttonId = `faq-trigger-${index + 1}`;
    const panelId = `faq-panel-${index + 1}`;
    button.id = buttonId;
    button.setAttribute('aria-controls', panelId);
    answer.id = panelId;
    answer.setAttribute('role', 'region');
    answer.setAttribute('aria-labelledby', buttonId);
    answer.style.maxHeight = '0px';
  });
}

function toggleFaq(button) {
  const item = button.closest('.faq-item');
  if (!item) return;
  const answer = item.querySelector('.faq-answer');
  const isOpen = item.classList.contains('open');

  document.querySelectorAll('.faq-item.open').forEach((openItem) => {
    if (openItem === item) return;
    openItem.classList.remove('open');
    const openButton = openItem.querySelector('[data-faq-trigger]');
    const openAnswer = openItem.querySelector('.faq-answer');
    if (openButton) openButton.setAttribute('aria-expanded', 'false');
    if (openAnswer) openAnswer.style.maxHeight = '0px';
  });

  item.classList.toggle('open', !isOpen);
  button.setAttribute('aria-expanded', String(!isOpen));
  if (answer) answer.style.maxHeight = !isOpen ? `${answer.scrollHeight}px` : '0px';
}

function animateCounter(el, end, suffix, prefix, duration) {
  if (AppState.reducedMotion) {
    el.textContent = `${prefix}${end}${suffix}`;
    return;
  }

  const startTime = performance.now();
  const update = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(end * eased);
    el.textContent = `${prefix}${current}${suffix}`;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function initStatsCounter() {
  const statsBar = document.querySelector('.stats-bar');
  if (!statsBar) return;

  const statsData = [
    { end: 45, suffix: '%', prefix: '', selector: '.stat:nth-child(1) .stat-value' },
    { end: 60, suffix: '%', prefix: '', selector: '.stat:nth-child(2) .stat-value' },
    { end: 24, suffix: '/7', prefix: '', selector: '.stat:nth-child(3) .stat-value' },
    { end: 30, suffix: 's', prefix: '<', selector: '.stat:nth-child(4) .stat-value' }
  ];

  const run = () => {
    if (AppState.statsCounted) return;
    AppState.statsCounted = true;
    statsData.forEach((stat, i) => {
      const el = document.querySelector(stat.selector);
      if (!el) return;
      window.setTimeout(() => animateCounter(el, stat.end, stat.suffix, stat.prefix, 1500), i * 200);
    });
  };

  if (AppState.reducedMotion || !('IntersectionObserver' in window)) {
    run();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      run();
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  observer.observe(statsBar);
}

function initStickyCta() {
  const stickyCta = document.getElementById('stickyCtaMobile');
  const heroSection = document.querySelector('.hero');
  if (!stickyCta || !heroSection) return;

  const onResize = () => {
    if (window.innerWidth > 768) stickyCta.classList.remove('visible');
  };

  if (!('IntersectionObserver' in window)) {
    onResize();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) stickyCta.classList.remove('visible');
      else if (window.innerWidth <= 768) stickyCta.classList.add('visible');
    });
  }, { threshold: 0.1 });

  observer.observe(heroSection);
  window.addEventListener('resize', onResize);
}

function initThemeMessage() {
  onThemeChange((theme) => {
    const container = document.getElementById('chatMessages');
    if (!container) return;

    const key = theme === 'dark' ? 'ui.chat_theme_dark' : 'ui.chat_theme_light';
    const msg = resolveTranslation(currentLang, key) || resolveTranslation('en', key);
    if (!msg) return;

    container.querySelector('.chat-msg.system')?.remove();
    const div = document.createElement('div');
    div.className = 'chat-msg system';
    div.innerHTML = `<div class="chat-msg-bubble">${msg}</div>`;
    container.appendChild(div);

    window.setTimeout(() => {
      div.style.opacity = '0';
      window.setTimeout(() => div.remove(), 400);
    }, 4000);
  });
}

function handleDocumentClick(event) {
  const actionEl = event.target.closest('[data-action]');
  const langEl = event.target.closest('[data-lang]');
  const themeEl = event.target.closest('[data-theme-opt]');
  const scenarioEl = event.target.closest('[data-scenario]');
  const gcScenarioEl = event.target.closest('[data-gc-scenario]');
  const faqEl = event.target.closest('[data-faq-trigger]');
  const mobileCloseEl = event.target.closest('[data-mobile-close]');
  const bookingEl = event.target.closest('.booking-link');

  if (bookingEl) {
    bookingEl.setAttribute('href', AppConfig.bookingUrl);
  }

  if (actionEl) {
    const { action } = actionEl.dataset;
    if (action === 'toggle-settings') toggleSettings();
    if (action === 'open-mobile-menu') openMobileMenu(actionEl);
    if (action === 'close-mobile-menu') closeMobileMenu();
  }

  if (langEl) setLang(langEl.dataset.lang);
  if (themeEl) setTheme(themeEl.dataset.themeOpt);
  if (scenarioEl) switchScenario(scenarioEl.dataset.scenario);
  if (gcScenarioEl) switchGcScenario(gcScenarioEl.dataset.gcScenario);
  if (faqEl) toggleFaq(faqEl);
  if (mobileCloseEl) closeMobileMenu();

  const dropdown = document.getElementById('settingsDropdown');
  const settingsButton = document.querySelector('[data-action="toggle-settings"]');
  if (dropdown && settingsButton) {
    const clickedInsideSettings = dropdown.contains(event.target) || settingsButton.contains(event.target);
    if (!clickedInsideSettings) closeSettings();
  }
}

function handleDocumentKeydown(event) {
  if (event.key === 'Escape') {
    closeSettings();
    closeMobileMenu();
  }
  trapMenuFocus(event);
}

window.addEventListener('chatdataloaded', () => {
  AppState.chatDataLoaded = true;
  if (document.getElementById('chatMessages')) switchScenario(AppState.currentScenario);
  if (document.getElementById('gcMessages')) switchGcScenario(AppState.currentGcScenario);
});

onLangChange(() => {
  if (AppState.chatDataLoaded) {
    switchScenario(AppState.currentScenario);
    switchGcScenario(AppState.currentGcScenario);
  }

  document.querySelectorAll('.faq-item.open .faq-answer').forEach((answer) => {
    answer.style.maxHeight = `${answer.scrollHeight}px`;
  });
});

function initApp() {
  setBookingLinks();
  initRevealAnimations();
  initComparisonWrappers();
  initFaq();
  initChatObserver();
  initStatsCounter();
  initStickyCta();
  initThemeMessage();

  document.addEventListener('click', handleDocumentClick);
  document.addEventListener('keydown', handleDocumentKeydown);

  const savedLang = localStorage.getItem('responin-lang') || document.documentElement.lang || 'id';
  setLang(savedLang);

  const savedTheme = localStorage.getItem('responin-theme') || 'dark';
  setTheme(savedTheme);
}

initApp();
