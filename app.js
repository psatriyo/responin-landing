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
      ? 'Responin — Masa Depan Operasi Bisnis Otonom'
      : 'Responin — The Future of Autonomous Business Operations';
  }

  // Update lang buttons (main page)
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  // Update lang buttons (legal pages)
  document.querySelectorAll('.lang-btn-nav').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

// === Scroll animations ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));

// Stagger cards
document.querySelectorAll('.solution-card, .problem-card, .step, .sector-card, .faq-item').forEach((card, i) => {
  card.style.transitionDelay = `${(i % 4) * 0.08}s`;
});

// Initialize with saved or default language
const savedLang = localStorage.getItem('responin-lang') || 'id';
setLang(savedLang);

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

// === Chat Demo Scenarios ===
const chatScenarios = {
  invoice: {
    en: [
      { role: 'user', text: 'Hi, has John paid invoice #1042 yet?' },
      { role: 'agent', html: 'Yes — John paid invoice #1042 on <span class="highlight">April 18</span> via bank transfer. The payment of <span class="highlight">Rp 12,500,000</span> has been reconciled in your accounting system.' },
      { role: 'user', text: "What's Mary's total orders with us this quarter?" },
      { role: 'agent', html: 'Mary has placed <span class="highlight">7 orders</span> this quarter totaling <span class="highlight">Rp 48,200,000</span>. Her most recent order was on April 22. She also has one pending delivery scheduled for April 29.' },
      { role: 'user', text: 'Send her a reminder about that delivery.' },
      { role: 'agent', html: 'Done! I\'ve sent Mary a delivery reminder for <span class="highlight">April 29</span>. She\'ll receive it via email and WhatsApp. Want me to follow up if she doesn\'t confirm by tomorrow?' }
    ],
    id: [
      { role: 'user', text: 'Hai, apakah John sudah membayar invoice #1042?' },
      { role: 'agent', html: 'Ya — John membayar invoice #1042 pada <span class="highlight">18 April</span> melalui transfer bank. Pembayaran sebesar <span class="highlight">Rp 12.500.000</span> sudah direkonsiliasi di sistem akuntansi Anda.' },
      { role: 'user', text: 'Berapa total pesanan Mary dengan kami kuartal ini?' },
      { role: 'agent', html: 'Mary telah melakukan <span class="highlight">7 pesanan</span> kuartal ini dengan total <span class="highlight">Rp 48.200.000</span>. Pesanan terakhirnya pada 22 April. Dia juga memiliki satu pengiriman tertunda yang dijadwalkan pada 29 April.' },
      { role: 'user', text: 'Kirimkan pengingat tentang pengiriman itu.' },
      { role: 'agent', html: 'Selesai! Saya sudah mengirim pengingat pengiriman untuk <span class="highlight">29 April</span> ke Mary melalui email dan WhatsApp. Mau saya follow up kalau belum konfirmasi besok?' }
    ]
  },
  delivery: {
    en: [
      { role: 'user', text: 'Where is order #8834 right now?' },
      { role: 'agent', html: 'Order #8834 is currently <span class="highlight">in transit</span> — last scanned at the Jakarta sorting hub at <span class="highlight">2:45 PM</span>. Estimated delivery: tomorrow by 5 PM.' },
      { role: 'user', text: 'Can you notify the customer?' },
      { role: 'agent', html: 'Done! I\'ve sent a tracking update to <span class="highlight">Budi Santoso</span> via WhatsApp and email. He\'ll get a confirmation once it\'s delivered.' }
    ],
    id: [
      { role: 'user', text: 'Di mana pesanan #8834 sekarang?' },
      { role: 'agent', html: 'Pesanan #8834 saat ini <span class="highlight">dalam perjalanan</span> — terakhir dipindai di hub penyortiran Jakarta pukul <span class="highlight">14:45</span>. Estimasi pengiriman: besok pukul 17:00.' },
      { role: 'user', text: 'Bisa beri tahu pelanggannya?' },
      { role: 'agent', html: 'Selesai! Saya sudah mengirim pembaruan pelacakan ke <span class="highlight">Budi Santoso</span> melalui WhatsApp dan email. Dia akan menerima konfirmasi setelah pesanan diterima.' }
    ]
  },
  sales: {
    en: [
      { role: 'user', text: 'Give me a sales summary for this month.' },
      { role: 'agent', html: 'This month: <span class="highlight">Rp 2.4B</span> in revenue across <span class="highlight">342 transactions</span>. Top category is Electronics at 38%. Revenue is up <span class="highlight">12%</span> vs. last month. Top customer: PT Mitra Abadi at Rp 310M.' },
      { role: 'user', text: 'How does that compare to the same period last year?' },
      { role: 'agent', html: 'April last year was <span class="highlight">Rp 1.9B</span> — so you\'re up <span class="highlight">26% YoY</span>. The growth is mostly driven by Electronics (+34%) and Home & Living (+18%). Want a detailed breakdown by product line?' }
    ],
    id: [
      { role: 'user', text: 'Kasih ringkasan penjualan bulan ini.' },
      { role: 'agent', html: 'Bulan ini: pendapatan <span class="highlight">Rp 2,4 miliar</span> dari <span class="highlight">342 transaksi</span>. Kategori teratas adalah Elektronik sebesar 38%. Pendapatan naik <span class="highlight">12%</span> dibanding bulan lalu. Pelanggan teratas: PT Mitra Abadi sebesar Rp 310 juta.' },
      { role: 'user', text: 'Bagaimana perbandingannya dengan periode yang sama tahun lalu?' },
      { role: 'agent', html: 'April tahun lalu <span class="highlight">Rp 1,9 miliar</span> — jadi naik <span class="highlight">26% YoY</span>. Pertumbuhan terutama didorong oleh Elektronik (+34%) dan Rumah & Hunian (+18%). Mau rincian lengkap per lini produk?' }
    ]
  },
  email: {
    en: [
      { role: 'user', text: 'Draft a follow-up email to PT Sentosa about the pending proposal.' },
      { role: 'agent', html: 'Here\'s the draft:<br><br>Subject: <span class="highlight">Following Up: Responin Partnership Proposal</span><br><br>Hi Pak Hendri,<br><br>I wanted to follow up on the proposal we sent last week regarding the Responin partnership. We\'d love to discuss any questions or adjustments. Would this Thursday work for a quick call?<br><br>Best regards' },
      { role: 'user', text: 'Send it, and CC the sales team.' },
      { role: 'agent', html: 'Sent! The email has been delivered to <span class="highlight">hendri@sentsa.co.id</span> with the sales team CC\'d. I\'ll flag it if there\'s no reply within <span class="highlight">48 hours</span>.' }
    ],
    id: [
      { role: 'user', text: 'Buat email tindak lanjut ke PT Sentosa tentang proposal yang tertunda.' },
      { role: 'agent', html: 'Ini draft-nya:<br><br>Subjek: <span class="highlight">Tindak Lanjut: Proposal Kemitraan Responin</span><br><br>Halo Pak Hendri,<br><br>Saya ingin menindaklanjuti proposal yang kami kirim minggu lalu terkait kemitraan Responin. Kami senang bisa mendiskusikan pertanyaan atau penyesuaian. Apakah Kamis ini bisa untuk telepon singkat?<br><br>Salam hormat' },
      { role: 'user', text: 'Kirim, dan CC tim sales.' },
      { role: 'agent', html: 'Terkirim! Email telah dikirim ke <span class="highlight">hendri@sentsa.co.id</span> dengan CC ke tim sales. Saya akan menandai jika tidak ada balasan dalam <span class="highlight">48 jam</span>.' }
    ]
  },
  customer: {
    en: [
      { role: 'user', text: 'Pull up the full profile for PT Karya Mandiri.' },
      { role: 'agent', html: 'PT Karya Mandiri — active since <span class="highlight">March 2023</span>. Lifetime value: <span class="highlight">Rp 1.2B</span>. 42 orders total, last order on April 15. Primary contact: Ibu Rina (Procurement). Payment terms: Net 30. No overdue invoices.' },
      { role: 'user', text: 'Any issues or complaints from them recently?' },
      { role: 'agent', html: 'One ticket from <span class="highlight">April 10</span> about a delayed shipment — resolved within 24 hours. They gave <span class="highlight">4.8/5</span> on the last satisfaction survey. Overall, a healthy account with no red flags.' }
    ],
    id: [
      { role: 'user', text: 'Tampilkan profil lengkap PT Karya Mandiri.' },
      { role: 'agent', html: 'PT Karya Mandiri — aktif sejak <span class="highlight">Maret 2023</span>. Nilai seumur hidup: <span class="highlight">Rp 1,2 miliar</span>. Total 42 pesanan, pesanan terakhir pada 15 April. Kontak utama: Ibu Rina (Pengadaan). Syarat pembayaran: Net 30. Tidak ada invoice yang tertunggak.' },
      { role: 'user', text: 'Ada masalah atau keluhan dari mereka belakangan ini?' },
      { role: 'agent', html: 'Satu tiket dari <span class="highlight">10 April</span> tentang pengiriman yang tertunda — diselesaikan dalam 24 jam. Mereka memberi skor <span class="highlight">4,8/5</span> pada survei kepuasan terakhir. Secara keseluruhan, akun sehat tanpa tanda bahaya.' }
    ]
  }
};

let currentScenario = 'invoice';

function switchScenario(key) {
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

// Also re-render chat when language changes
const _origSetLang = setLang;
setLang = function(lang) {
  _origSetLang(lang);
  if (currentScenario) switchScenario(currentScenario);
};

// Initialize default scenario (only on main page with chat demo)
if (document.getElementById('chatMessages')) {
  switchScenario('invoice');
}

// === FAQ Accordion ===
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  // Close all others
  document.querySelectorAll('.faq-item.open').forEach(el => {
    if (el !== item) el.classList.remove('open');
  });
  item.classList.toggle('open', !wasOpen);
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
const _origSetTheme = setTheme;
setTheme = function(theme) {
  _origSetTheme(theme);
  // Add system message to chat demo
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
};

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

// Re-apply saved theme (to trigger chat message if needed on init)
// Don't show theme message on initial load, only on user switch
// So we just keep setTheme as is without initial message


// === Group Chat Demo Scenarios ===
const gcScenarios = {
  project: {
    en: [
      { role: 'member', sender: 'gc_project_1_sender', text: 'gc_project_1_1' },
      { role: 'agent', html: 'gc_project_1_2', lines: ['gc_project_1_2b', 'gc_project_1_2c', 'gc_project_1_2d', 'gc_project_1_2e'] },
      { role: 'member', sender: 'gc_project_1_3_sender', text: 'gc_project_1_3' },
      { role: 'agent', html: 'gc_project_1_4' }
    ],
    id: [
      { role: 'member', sender: 'gc_project_1_sender', text: 'gc_project_1_1' },
      { role: 'agent', html: 'gc_project_1_2', lines: ['gc_project_1_2b', 'gc_project_1_2c', 'gc_project_1_2d', 'gc_project_1_2e'] },
      { role: 'member', sender: 'gc_project_1_3_sender', text: 'gc_project_1_3' },
      { role: 'agent', html: 'gc_project_1_4' }
    ]
  },
  escalation: {
    en: [
      { role: 'agent', html: 'gc_esc_1' },
      { role: 'member', sender: 'gc_esc_2_sender', text: 'gc_esc_2' },
      { role: 'agent', html: 'gc_esc_3', lines: ['gc_esc_3b'] },
      { role: 'member', sender: 'gc_esc_4_sender', text: 'gc_esc_4' },
      { role: 'agent', html: 'gc_esc_5' }
    ],
    id: [
      { role: 'agent', html: 'gc_esc_1' },
      { role: 'member', sender: 'gc_esc_2_sender', text: 'gc_esc_2' },
      { role: 'agent', html: 'gc_esc_3', lines: ['gc_esc_3b'] },
      { role: 'member', sender: 'gc_esc_4_sender', text: 'gc_esc_4' },
      { role: 'agent', html: 'gc_esc_5' }
    ]
  },
  briefing: {
    en: [
      { role: 'agent', html: 'gc_brief_1', lines: ['gc_brief_1b', 'gc_brief_1c', 'gc_brief_1d', 'gc_brief_1e'] },
      { role: 'member', sender: 'gc_brief_2_sender', text: 'gc_brief_2' },
      { role: 'agent', html: 'gc_brief_3', lines: ['gc_brief_3b'] },
      { role: 'member', sender: 'gc_brief_4_sender', text: 'gc_brief_4' }
    ],
    id: [
      { role: 'agent', html: 'gc_brief_1', lines: ['gc_brief_1b', 'gc_brief_1c', 'gc_brief_1d', 'gc_brief_1e'] },
      { role: 'member', sender: 'gc_brief_2_sender', text: 'gc_brief_2' },
      { role: 'agent', html: 'gc_brief_3', lines: ['gc_brief_3b'] },
      { role: 'member', sender: 'gc_brief_4_sender', text: 'gc_brief_4' }
    ]
  }
};

const gcAvatarColors = {
  'R': 'rgba(108,92,231,0.2)',
  'A': 'rgba(85,239,196,0.2)',
  'S': 'rgba(116,185,255,0.2)',
};

const gcSenderAvatars = {
  'gc_project_1_sender': 'R', 'gc_project_1_3_sender': 'A',
  'gc_esc_2_sender': 'S', 'gc_esc_4_sender': 'S',
  'gc_brief_2_sender': 'R', 'gc_brief_4_sender': 'A'
};

let currentGcScenario = 'project';

function switchGcScenario(key) {
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

if (document.getElementById('gcMessages')) {
  switchGcScenario('project');
}

const _origSetLangGc = setLang;
setLang = function(lang) {
  _origSetLangGc(lang);
  if (currentGcScenario) switchGcScenario(currentGcScenario);
};
