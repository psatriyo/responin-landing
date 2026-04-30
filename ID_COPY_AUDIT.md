# Responin Indonesian (id) Copy Audit

**Date:** 2026-05-01
**Auditor:** Nalacipta
**Scope:** Full `id` localization in `i18n.js` and `i18n-legal.js` (PR #23 + `nangani` fix)
**Objective:** Identify tone inconsistencies, unnatural phrasing, CRO weaknesses, and trust-signal gaps for Indonesian business professionals.

---

## Executive Summary

The Indonesian localization is **solid but uneven**. It nails the conversational tone in some sections (hero, problem cards, chat demo) but drifts into awkward hybrid-register in others (solutions descriptions, how-it-works, legal). The core issue: **tone whiplash** between casual Jakartan slang (`nggak`, `ngirim`, `bikin`) and formal business register (`disesuaikan`, `didukung`, `diarsitek`) — sometimes within the same paragraph.

| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 Critical | 2 | Trust-undermining errors; legal compliance risk |
| 🟠 High | 7 | CTA weakness, tone mismatch, clarity issues |
| 🟡 Medium | 12 | Register inconsistency, unnatural phrasing |
| 🟢 Low | 8 | Minor polish, consistency nits |

**Top priority fixes:**
1. Legal terms use archaic/formal Indonesian that signals "translated by machine"
2. Several solution descriptions bury the value prop under feature-dumps
3. FAQ answers are strong but one (`faq_a5`) is confusing about "routed to you for approval"
4. Industry section uses inconsistent tone (formal vs casual mix)

---

## 🔴 CRITICAL (Fix Before Launch)

### C1: `terms_s9_li4` — Liability Waiver Is Mistranslated
**Current:**
```
terms_s9_li4: "Kami tidak bertanggung jawab atas keputusan yang dibuat berdasarkan output yang dihasilkan AI. Anda bertanggung jawab untuk meninjau dan menyetujui semua tindakan agen."
```
**Issue:** "meninjau dan menyetujui semua tindakan agen" (review and approve all agent actions) contradicts the product's core value prop of autonomous action. This creates legal exposure AND kills the sale.
**Fix:**
```
terms_s9_li4: "Anda tetap bertanggung jawab atas keputusan bisnis yang diambil berdasarkan rekomendasi agen. Kami menyarankan verifikasi untuk keputusan kritis sebelum eksekusi."
```

### C2: `hero_desc` — Missing Value Prop Anchor
**Current:**
```
hero_desc: "Bayangkan punya anggota tim yang tidak pernah lupa, tidak pernah tidur, dan mengenal bisnis Anda sebaik Anda sendiri..."
```
**Issue:** Strong emotional hook, but never explicitly states **what Responin does** (automation). Indonesian business buyers (especially SMEs) need concrete outcomes fast.
**Fix:**
```
hero_desc: "Otomasi bisnis tanpa kode: agen AI pribadi yang mengenal setiap proses, tim, dan preferensi Anda. Tidak pernah lupa, tidak pernah tidur, dan bekerja 24/7 — bukan cuma chatbot, tapi eksekutor."
```

---

## 🟠 HIGH (Strongly Recommended)

### H1: `cta_title` — Weak Commitment Trigger
**Current:** `Siap Mengotomasi Bisnis Anda?`
**Issue:** Too passive. "Siap?" invites "belum" (not yet). Indonesian business culture values decisiveness in CTAs.
**Fix:** `Otomasi Bisnis Anda Dimulai Sekarang` or `Waktunya Bisnis Anda Berjalan Otomatis`

### H2: `cta_desc` — Vague Outcome
**Current:** `Gabung waitlist buat konsultasi kesiapan AI gratis...`
**Issue:** "Kesiapan AI" is jargon. Indonesian SMEs don't think in "AI readiness" frameworks.
**Fix:** `Daftar sekarang untuk konsultasi gratis. Kami akan analisis proses bisnis Anda dan tunjukkan area otomasi dengan penghematan waktu terbesar.`

### H3: `solutions_title` — Lacks Urgency/Specificity
**Current:** `Otomasi yang beneran jalan untuk bisnis Anda.`
**Issue:** "Beneran jalan" is good slang, but the title needs to promise a transformation, not just functionality.
**Fix:** `9 Cara Agen AI Menghemat 10+ Jam per Minggu untuk Bisnis Anda`

### H4: `sol_3_desc` — Confusing "Naikkan Eskalasi"
**Current:** `...ngirim update terjadwal dan naikkan eskalasi thread...`
**Issue:** "Naikkan eskalasi" is not standard Indonesian. Should be "eskalasi thread yang belum ditanggapi" or "naikkan prioritas thread."
**Fix:** `...mengirim update terjadwal dan menangani eskalasi pada thread yang belum mendapat respons...`

### H5: `how_title` — Timeline Feels Arbitrary
**Current:** `Dari kekacauan ke otonomi dalam empat minggu.`
**Issue:** "Kekacauan" is dramatic; "otonomi" is abstract. Indonesian buyers prefer concrete timelines with clear phases.
**Fix:** `Dari Manual ke Otomatis dalam 4 Minggu — Tanpa Gangguan Operasi`

### H6: `roi_title` — Question Format Weakens Claim
**Current:** `45% lebih sedikit pekerjaan rutin, seperti apa buat tim Anda?`
**Issue:** The question format softens a strong stat. Indonesian business copy performs better with direct statements.
**Fix:** `45% Lebih Sedikit Pekerjaan Rutin — Tim Anda Bisa Fokus ke Pertumbuhan`

### H7: `faq_a5` — Human-in-the-Loop Explanation Is Confusing
**Current:** `...keputusan yang ragu dirutekan ke Anda buat approval.`
**Issue:** "Dirutekan ke Anda buat approval" is awkward. "Ragu" is an emotion, not a business condition.
**Fix:** `Tugas dengan tingkat keyakinan tinggi dijalankan otomatis. Tugas kompleks atau sensitif akan menunggu persetujuan Anda terlebih dahulu.`

---

## 🟡 MEDIUM (Polish for Conversion)

### M1: `problem_card_1_desc` — Typo
**Current:** `nggak nghasilin`
**Fix:** `nggak menghasilkan`

### M2: `problem_card_4_title` — Colloquialism
**Current:** `Skala = Lebih Banyak Orang`
**Issue:** "Rental orang" in the description is very casual. Title itself is fine, but the `=` symbol feels informal.
**Fix (title):** `Skalakan Tanpa Menambah Kepala`

### M3: `problem_card_4_desc` — "Nggak" at End of Sentence
**Current:** `...output per orang nggak.`
**Issue:** Sentence-ending "nggak" is extremely informal, almost childish in a business context.
**Fix:** `...output per orang tidak meningkat.`

### M4: `problem_card_5_title` — English Loanword
**Current:** `Kelelahan Keputusan & Overload Informasi`
**Fix:** `Kelelahan Keputusan & Banjir Informasi`

### M5: `sol_2_desc` — "Ngomong atau Ngetik"
**Current:** `...cuma dengan ngomong atau ngetik...`
**Issue:** Too casual for a feature that needs to signal enterprise-grade capability.
**Fix:** `...cukup dengan perintah suara atau teks...`

### M6: `sol_4_desc` — "Arsitek" as Verb
**Current:** `Kami arsitek instance otomasi kustom...`
**Issue:** "Arsitek" is a noun. Using it as a verb is creative but confusing.
**Fix:** `Kami merancang arsitektur otomasi kustom...`

### M7: `step_2_desc` — "Skill-nya"
**Current:** `...skill-nya, memori, pemicu...`
**Issue:** "Skill-nya" is too casual. Also "pemicu" for "triggers" is not wrong but "pemicu" usually means "catalyst" in business Indonesian.
**Fix:** `...kemampuan, memori, pemicu otomatis...`

### M8: `industries_title` — Awkward Construction
**Current:** `Dibuat buat semua bisnis. Dikhususkan buat milik Anda.`
**Issue:** "Buat buat" is repetitive and clunky.
**Fix:** `Untuk Semua Bisnis, Disesuaikan untuk Anda.`

### M9: `sec_finance_after` — "Generate" Instead of "Buat"
**Current:** `...generate laporan kepatuhan...`
**Issue:** "Generate" is English loanword in a section that otherwise uses Indonesian.
**Fix:** `...membuat laporan kepatuhan...`

### M10: `sec_legal_desc` — "Organisir"
**Current:** `...organisir dokumen kasus otomatis.`
**Issue:** "Organisir" is not standard Indonesian; should be "mengorganisir" or "mengatur."
**Fix:** `...mengatur dokumen kasus secara otomatis.`

### M11: `sec_realestate_desc` — "Auto-kualifikasi"
**Current:** `Auto-kualifikasi leads...`
**Fix:** `Kualifikasi otomatis untuk leads...`

### M12: `cmp_r7_c2` — "Debugging Aturan"
**Current:** `Minggu pemetaan, pengujian, dan debugging aturan`
**Fix:** `Minggu pemetaan, pengujian, dan perbaikan aturan`

---

## 🟢 LOW (Nice to Have)

### L1: `nav_cta` — Could Be Stronger
**Current:** `Coba Sekarang`
**Suggestion:** `Mulai Gratis` (stronger commitment)

### L2: `hero_cta_primary` — Consistency with CTA
**Current:** `Daftar Waitlist · Konsultasi AI Gratis`
**Note:** Fine, but if nav changes to `Mulai Gratis`, this should align.

### L3: `chat_desc` — "Kasih" Is Colloquial
**Current:** `...langsung kasih jawabannya.`
**Suggestion:** `...langsung memberikan jawabannya.`

### L4: `gc_desc` — "Dia" for AI Agent
**Current:** `Dia memantau, merangkum...`
**Note:** Personifying the agent as "dia" is charming but some enterprises may prefer "agen ini" or "Responin." Optional fix.

### L5: `why_p2_desc` — Quote Formatting
**Current:** `Bukan cuma "ini yang sebaiknya kamu lakukan."`
**Suggestion:** `Bukan sekadar saran seperti "sebaiknya Anda melakukan ini."`

### L6: `faq_q3` — "[Alat]" Placeholder
**Current:** `Bagaimana kalau saya udah pakai [alat] lain?`
**Note:** This is a code placeholder. Ensure it's replaced dynamically or use generic phrasing: `...sudah menggunakan software lain?`

### L7: `foot_comp_4` — Too Long for Footer
**Current:** `Melampaui Otomasi Dasar`
**Note:** This is the compare page title. In a footer, `Perbandingan` is cleaner.

### L8: `sticky_cta_text` — Missing "AI"
**Current:** `Daftar Waitlist · Konsultasi Gratis`
**Suggestion:** `Daftar Waitlist · Konsultasi AI Gratis` (matches hero CTA)

---

## Legal Copy (i18n-legal.js) — Separate Concerns

The legal translations require different standards than marketing copy. Current issues:

| Key | Issue | Severity |
|-----|-------|----------|
| `terms_s1_p1` | "Ketentuan Penggunaan" is used, but `terms_page_title` is "Terms of Use" (English) | 🟠 High |
| `terms_s7_title` | "Kekayaan Intelektual" — correct but very formal; acceptable for legal | 🟡 Medium |
| `terms_s9_title` | "Batasan Tanggung Jawab" — fine | 🟢 Low |
| `priv_s3_note` | "🛡️ Arsitektur Privasi-Pertama" — "Privasi-Pertama" is hyphenated English construction; should be "Arsitektur Berbasis Privasi" | 🟡 Medium |

**Note:** Legal copy was not fully audited in this pass. Recommend separate legal review by Indonesian counsel.

---

## Recommendations by Section

| Section | Priority | Key Fix |
|---------|----------|---------|
| Hero | 🔴 Critical | Add concrete value prop to `hero_desc` |
| CTA | 🟠 High | Strengthen `cta_title` + `cta_desc` |
| Solutions | 🟠 High | Rewrite `sol_3_desc`, `sol_4_desc` |
| How It Works | 🟠 High | Concrete-ify `how_title` |
| ROI | 🟠 High | Remove question format |
| FAQ | 🟠 High | Clarify `faq_a5` |
| Problem Cards | 🟡 Medium | Fix typo M1, register M2-M5 |
| Industries | 🟡 Medium | Tone consistency |
| Compare | 🟡 Medium | Remove English loanwords |
| Legal | 🔴 Critical | Fix `terms_s9_li4` liability wording |

---

## Tone Register Guidelines (For Future Edits)

To prevent tone whiplash, establish these rules:

1. **Hero/CTA/Problem:** Conversational but authoritative (Jakartan professional — `nggak` okay, `nggak nghasilin` not okay)
2. **Solutions/How It Works:** Direct benefit-driven (avoid slang, use active verbs)
3. **Compare/ROI:** Data-driven, confident (no questions, no colloquialisms)
4. **FAQ:** Friendly expert (explain like you're talking to a smart colleague)
5. **Legal:** Formal standard Indonesian (no slang, no hyphens, no loanwords)
6. **Chat/GC Demo:** Fully conversational (this is where slang shines)

---

*End of audit. Ready for rewrite phase when you are.*
