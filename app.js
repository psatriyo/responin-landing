// === Language Change Event System ===
// Replaces the previous monkey-patching pattern with a clean pub/sub system
const _langChangeCallbacks = [];
function onLangChange(cb) { _langChangeCallbacks.push(cb); }

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('responin-lang', lang);
  document.documentElement.lang = lang;
  const t = translations[lang];

  // Helper to traverse nested keys with dot notation
  function getNestedTranslation(obj, key) {
    const parts = key.split('.');
    let val = obj;
    for (const part of parts) {
      if (val && typeof val === 'object' && part in val) {
        val = val[part];
      } else {
        return undefined;
      }
    }
    return val;
  }

  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = getNestedTranslation(t, key);
    if (val !== undefined) {
      if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = getNestedTranslation(t, key);
    if (val !== undefined) {
      el.placeholder = val;
    }
  });

  // Update title (page-specific)
  const titleKey = document.documentElement.dataset.pageTitle;
  if (titleKey) {
    const val = getNestedTranslation(t, titleKey);
    if (val) {
      document.title = val;
    }
  } else {
    document.title = lang === 'id'
      ? 'Responin — Agen AI Personal untuk Otomasi Bisnis Anda'
      : 'Responin — Your Personal AI Agent for Business Automation';
  }

  // Update lang buttons (main page)
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  // Update lang buttons (legal pages)
  document.querySelectorAll('.lang-btn-nav').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Notify subscribers
  _langChangeCallbacks.forEach(cb => cb(lang));
}

// === Scroll animations ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));

// Stagger cards
document.querySelectorAll('.solution-card, .problem-card, .step, .sector-card, .faq-item').forEach((card, i) => {
  card.style.transitionDelay = `${(i % 4) * 0.08}s`;
});

// Initialize with saved or default language
const savedLang = localStorage.getItem('responin-lang') || 'id';
setLang(savedLang);

// === Comparison Table Scroll Hint ===
document.querySelectorAll('.comparison-wrapper').forEach(wrapper => {
  wrapper.addEventListener('scroll', () => {
    const atEnd = wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth - 4;
    wrapper.classList.toggle('scrolled-end', atEnd);
  });
});

// === Settings Dropdown ===
function toggleSettings() {
  const dd = document.getElementById('settingsDropdown');
  dd.classList.toggle('open');
}

// === Mobile Menu ===
function openMobileMenu() {
  document.getElementById('mobileMenu').classList.add('open');
  document.getElementById('mobileOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('mobileOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const dd = document.getElementById('settingsDropdown');
  const btn = document.querySelector('.settings-btn');
  if (!dd.contains(e.target) && !btn.contains(e.target)) {
    dd.classList.remove('open');
  }
});

// === Theme Switcher ===
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('responin-theme', theme);
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.themeOpt === theme);
  });
  // Update nav background for light mode
  const nav = document.querySelector('nav');
  if (theme === 'light') {
    nav.style.background = 'rgba(247, 247, 250, 0.85)';
  } else {
    nav.style.background = '';
  }
}

// Load saved theme or default to dark
const savedTheme = localStorage.getItem('responin-theme') || 'dark';
setTheme(savedTheme);

// === Chat Demo Scenarios (lazy-loaded) ===
// Chat data (chatScenarios, gcScenarios, gcAvatarColors, gcSenderAvatars)
// is loaded from chat-data.js when the chat section enters the viewport.

let currentScenario = 'invoice';
let chatDataLoaded = false;

function switchScenario(key) {
  if (typeof chatScenarios === 'undefined') return;
  currentScenario = key;
  const lang = currentLang;
  const msgs = chatScenarios[key][lang] || chatScenarios[key]['en'];
  const container = document.getElementById('chatMessages');
  if (!container) return;
  container.innerHTML = '';
  msgs.forEach((m, i) => {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + m.role;
    div.style.animationDelay = (i * 0.3) + 's';
    const avatar = document.createElement('div');
    avatar.className = 'chat-msg-avatar';
    avatar.textContent = m.role === 'user' ? 'Y' : 'R';
    const bubble = document.createElement('div');
    bubble.className = 'chat-msg-bubble';
    if (m.html) bubble.innerHTML = m.html;
    else bubble.textContent = m.text;
    div.appendChild(avatar);
    div.appendChild(bubble);
    container.appendChild(div);
  });
  // Update active tab
  document.querySelectorAll('.chat-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.scenario === key);
  });
}

// Subscribe chat demo to language changes
onLangChange(function(lang) {
  if (chatDataLoaded && currentScenario) switchScenario(currentScenario);
});

// Lazy-load chat data when chat section enters viewport
function initChatDemo() {
  if (chatDataLoaded) return;
  const script = document.createElement('script');
  script.src = 'chat-data.js';
  script.async = true;
  document.head.appendChild(script);
}

// Listen for chat data loaded event
window.addEventListener('chatdataloaded', function() {
  chatDataLoaded = true;
  // Initialize both chat demos
  if (document.getElementById('chatMessages')) switchScenario('invoice');
  if (document.getElementById('gcMessages')) switchGcScenario('project');
});

// Observe chat sections for lazy loading
const chatSection = document.querySelector('.chat-demo') || document.querySelector('.chat');
if (chatSection) {
  const chatObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initChatDemo();
        chatObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px 0px' }); // Start loading 200px before visible
  chatObserver.observe(chatSection);
}

// === FAQ Accordion ===
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  // Close all others
  document.querySelectorAll('.faq-item.open').forEach(el => {
    if (el !== item) {
      el.classList.remove('open');
      el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    }
  });
  item.classList.toggle('open', !wasOpen);
  btn.setAttribute('aria-expanded', !wasOpen);
}

// === Animated Stats Counter ===
const statsData = [
  { end: 45, suffix: '%', prefix: '', selector: '.stat:nth-child(1) .stat-value' },
  { end: 60, suffix: '%', prefix: '', selector: '.stat:nth-child(2) .stat-value' },
  { end: 24, suffix: '/7', prefix: '', selector: '.stat:nth-child(3) .stat-value' },
  { end: 30, suffix: 's', prefix: '<', selector: '.stat:nth-child(4) .stat-value' }
];

let statsCounted = false;
function animateCounter(el, end, suffix, prefix, duration) {
  const start = 0;
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (end - start) * eased);
    el.textContent = prefix + current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsBar = document.querySelector('.stats-bar');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsCounted) {
      statsCounted = true;
      statsData.forEach((s, i) => {
        const el = document.querySelector(s.selector);
        if (el) {
          setTimeout(() => animateCounter(el, s.end, s.suffix, s.prefix, 1500), i * 200);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
if (statsBar) statsObserver.observe(statsBar);

// === Theme Change Chat Message ===
// Use event system instead of monkey-patching
const _themeChangeCallbacks = [];
function onThemeChange(cb) { _themeChangeCallbacks.push(cb); }

const _origSetTheme = setTheme;
setTheme = function(theme) {
  _origSetTheme(theme);
  _themeChangeCallbacks.forEach(cb => cb(theme));
};

// Add chat system message on theme change
onThemeChange(function(theme) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  const key = theme === 'dark' ? 'chat_theme_dark' : 'chat_theme_light';
  const msg = translations[currentLang].ui[key] || translations['en'].ui[key];
  // Remove any existing system message
  const existing = container.querySelector('.chat-msg.system');
  if (existing) existing.remove();
  // Create system message
  const div = document.createElement('div');
  div.className = 'chat-msg system';
  div.innerHTML = '<div class="chat-msg-bubble" style="animation: chatFadeIn 0.35s ease forwards; opacity: 0;">' + msg + '</div>';
  container.appendChild(div);
  // Auto-dismiss after 4s
  setTimeout(() => {
    div.style.transition = 'opacity 0.4s ease';
    div.style.opacity = '0';
    setTimeout(() => div.remove(), 400);
  }, 4000);
});

// === Sticky CTA on Mobile ===
const stickyCta = document.getElementById('stickyCtaMobile');
const heroSection = document.querySelector('.hero');
if (stickyCta && heroSection) {
  const stickyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        stickyCta.classList.remove('visible');
      } else {
        // Only show on mobile
        if (window.innerWidth <= 768) {
          stickyCta.classList.add('visible');
        }
      }
    });
  }, { threshold: 0.1 });
  stickyObserver.observe(heroSection);
  // Also handle resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      stickyCta.classList.remove('visible');
    }
  });
}

// Note: initial theme load does not trigger chat message (only user-initiated switches do)


// === Group Chat Demo Scenarios ===


// === Group Chat Demo Scenarios (lazy-loaded with chat data) ===

let currentGcScenario = 'project';

function switchGcScenario(key) {
  if (typeof gcScenarios === 'undefined') return;
  currentGcScenario = key;
  const lang = currentLang;
  const msgs = gcScenarios[key][lang] || gcScenarios[key]['en'];
  const container = document.getElementById('gcMessages');
  if (!container) return;
  container.innerHTML = '';

  msgs.forEach((m, i) => {
    const div = document.createElement('div');
    div.className = 'gc-msg ' + m.role;
    div.style.animationDelay = (i * 0.3) + 's';

    const avatar = document.createElement('div');
    avatar.className = 'chat-msg-avatar';
    if (m.role === 'agent') {
      avatar.textContent = 'R';
      avatar.style.background = 'linear-gradient(135deg, var(--gradient-1), var(--gradient-2))';
      avatar.style.color = '#fff';
    } else {
      const senderKey = m.sender;
      const letter = gcSenderAvatars[senderKey] || senderKey.charAt(0).toUpperCase();
      avatar.textContent = letter;
      avatar.style.background = gcAvatarColors[letter] || 'rgba(255,255,255,0.1)';
    }

    const bubble = document.createElement('div');
    bubble.className = 'chat-msg-bubble';

    if (m.role !== 'system') {
      const senderName = document.createElement('div');
      senderName.className = 'gc-sender';
      senderName.textContent = m.role === 'agent' ? 'Responin' : (translations[lang].gc[m.sender] || translations['en'].gc[m.sender] || m.sender);
      bubble.appendChild(senderName);
    }

    if (m.lines) {
      const mainLine = document.createElement('div');
      mainLine.innerHTML = translations[lang].gc[m.html] || translations['en'].gc[m.html];
      bubble.appendChild(mainLine);
      m.lines.forEach(lineKey => {
        const line = document.createElement('div');
        line.innerHTML = translations[lang].gc[lineKey] || translations['en'].gc[lineKey];
        bubble.appendChild(line);
      });
    } else if (m.html) {
      bubble.innerHTML += translations[lang].gc[m.html] || translations['en'].gc[m.html];
    } else {
      bubble.textContent = translations[lang].gc[m.text] || translations['en'].gc[m.text] || m.text;
    }

    div.appendChild(avatar);
    div.appendChild(bubble);
    container.appendChild(div);

    // Fallback: ensure message is visible even if animation doesn't trigger (mobile)
    setTimeout(() => {
      if (div.style.opacity === '0' || getComputedStyle(div).opacity === '0') {
        div.style.opacity = '1';
        div.style.transform = 'none';
      }
    }, (i * 300) + 500);
  });

  document.querySelectorAll('[data-gc-scenario]').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.gcScenario === key);
  });
}

// Subscribe group chat demo to language changes
onLangChange(function(lang) {
  if (chatDataLoaded && currentGcScenario) switchGcScenario(currentGcScenario);
});
