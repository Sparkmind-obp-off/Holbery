# HOLBERY — Master Roadmap

Versi: 1.0 | 2026-10-05
Sumber identitas: [HOLBERY-MASTER.md](HOLBERY-MASTER.md).
Roadmap historis di archive tidak menjadi tracker aktif.

## Urutan wajib

| Fase | Objective dan output minimum | Acceptance gate | Status |
|---|---|---|---|
| PHASE 0 — PROJECT INITIALIZATION | Audit; identitas; enam dokumen; decision log; prinsip; aturan awal; batas privat | Satu definisi kanonis tanpa sumber aktif yang bertentangan | COMPLETE — dokumentasi Phase 0 terverifikasi |
| PHASE 1 — MASTER BRAND FOUNDATION | Vision, mission, purpose, positioning, promise, personality, audience, territory, IS/IS NOT | Proyek baru dapat dinilai terhadap definisi tanpa ambiguitas | COMPLETE |
| PHASE 2 — MASTER BRAND ARCHITECTURE | Definisi/pemetaan SYSTEMS, PRODUCTS, VENTURES, COMMERCE; contoh dan aturan lintas pilar | Setiap proyek punya kategori primer yang jelas | PENDING |
| PHASE 3 — NAMING & BRAND GOVERNANCE | Aturan child/product/system/venture/internal/experiment/campaign/domain/social; metadata wajib | Proyek baru tidak mendilusi induk; approval dan ownership jelas | PENDING |
| PHASE 4 — DIGITAL FOUNDATION | holberry.biz; landing page; GitHub structure; email; social; doc hub; analytics; hosting; DNS | Digital headquarters publik terbukti live, HTTPS dan kendali aset terverifikasi | PENDING |
| PHASE 5 — LEGAL, IP & ASSET FOUNDATION | Register domain, trademark/classes, entity, IP/code/repo/product/brand, licensing, dependencies | Aset kritis punya owner teridentifikasi dan status legal beserta bukti/gap | PENDING |
| PHASE 6 — OPERATING SYSTEM | Loop operasional; opportunity/project/product registries; feedback, metrics, experiments, decisions, revenue, runbooks | Satu workflow proyek bisa dijalankan ulang dengan owner dan bukti | PENDING |
| PHASE 7 — FIRST REAL VENTURE / PROOF | Barber Business System terpisah; pilot masalah operator nyata | Masalah nyata terselesaikan dan diuji oleh operator nyata | PENDING |
| PHASE 8 — PRODUCTIZATION | Satu offer reusable: customer, problem, outcome, delivery, price, acquisition, support, success metric | Produk dapat dijual tanpa custom development untuk setiap pelanggan | PENDING |
| PHASE 9 — VERTICAL EXPANSION | Demand → problem → repeatability → unit economics → operational fit → product fit | Vertikal baru terbukti memakai arsitektur reusable | PENDING |
| PHASE 10 — ECOSYSTEM & SCALE | Governance berbasis bukti; evaluate licensing/partners/distribution/recurring/acquisition/investment/international | Kompleksitas baru didukung aktivitas, ekonomi, dan kapasitas nyata | PENDING |

## Discipline gates

- Jangan membangun semua modul barber atau seluruh product ladder sekaligus.
- Ladder kemungkinan: FREE → ENTRY PRODUCT → STARTER KIT → OPERATIONS KIT → BUSINESS SYSTEM → ADVANCED SYSTEM → SERVICES / IMPLEMENTATION. Pilih level setelah validasi demand.
- Ekspansi berurutan bila layak: BARBER → CAFE → LAUNDRY → SALON → OTHER LOCAL SERVICES → UMKM. Ini kandidat, bukan komitmen membangun semuanya.
- Loop Phase 6: DISCOVER → VALIDATE → DESIGN → BUILD → LAUNCH → OPERATE → MEASURE → IMPROVE → SCALE.
- Customer → value → price → acquisition → delivery → retention harus terbukti untuk offer komersial.
- Legal clearance bukan hasil pemilihan nama/domain. Klaim dan kontrak legal memerlukan bukti serta review yang sesuai.
- Setiap fase audit ulang, preserve valid work, implement seperlunya, test, document, evidence, update tracker, lalu lanjut otomatis; stop hanya pada blocker nyata.

## Laporan PHASE 0

### STATUS

COMPLETE — acceptance Phase 0 terpenuhi: sumber definisi aktif tunggal, enam dokumen tersedia, sejarah terjaga, dan guardrails dasar tertulis. Ini bukan klaim HOLBERY telah operasional secara komersial. Phase 1–10 tidak dimulai.

### CHANGES

- Menetapkan HOLBERY sebagai master parent dan HOLBERY-MASTER sebagai sumber utama.
- Menerapkan empat pilar dan aturan dasar tanpa membangun platform spekulatif.
- Mengganti domain strategis aktif menjadi holberry.biz sesuai instruksi terbaru; tidak mengubah DNS atau mengklaim secured.
- Memindahkan 18 dokumen lama dan mempertahankan README lama di archive/legacy-parent-house; isi historis tidak diubah.
- Mempertahankan repository/main dan pemisahan Bozq; menambahkan .gitignore.

### FILES

HOLBERY-MASTER.md, README.md, ARCHITECTURE.md, DECISIONS.md, BRAND-RULES.md, ROADMAP.md, .gitignore; archive/legacy-parent-house/README.md dan archive/legacy-parent-house/docs/*.md.

### TESTS

PASS — 88/88 pemeriksaan otomatis melalui Python stdlib dan git, exit code 0 pada 2026-10-05:

- Enam dokumen wajib tersedia dan tidak kosong.
- Semua tautan relatif Markdown dalam enam dokumen aktif menemukan target.
- Domain strategis ada di setiap dokumen aktif; tidak ditemukan pola klaim domain secured/live yang diuji.
- Empat pilar konsisten; Phase 1–10 tetap PENDING.
- Batas Bozq dan status arsip NON-KANONIS terjaga; branch main dipertahankan.
- Seluruh 19 file historis identik byte-for-byte dengan baseline 9babed0.
- Delapan contoh path sensitif/generatif diabaikan git.
- git diff --check dan --cached --check lulus.
- Tidak ditemukan pola token/private-key yang diuji pada enam dokumen aktif; bukan audit seluruh history.

Run pertama 87/88: domain belum disebut eksplisit di ARCHITECTURE. Ditambahkan rujukan domain dengan status unverified, lalu suite yang sama lulus 88/88. Build/runtime/browser tests: N/A karena repository hanya dokumentasi.

### EVIDENCE

- Baseline: commit 9babed0; main; working tree awal bersih; 19 file Markdown terlacak.
- Audit: membaca README dan 18 dokumen existing; tidak menemukan aplikasi/package.json.
- Remote existing: https://github.com/Sparkmind-obp-off/Holbery.git, belum autentikasi atau push pada fase ini.
- Lokasi kerja: /home/user/webapp/. Output verifikasi: `RESULT: 88 / 88 PASS`.
- Commit penutupan lokal: `docs: initialize canonical HOLBERY master system phase 0`. Cari hash melalui `git log -1 --oneline`; hash juga dilaporkan pada laporan sesi. Tidak melakukan push.
- Metode integritas: bandingkan bytes tiap file arsip dengan `git show 9babed0:<path-asli>`; semua 19 cocok. Source aktif diperiksa terpisah dari klaim historis.

### RISKS

- Nama owner administratif/entitas hukum dan ownership aset belum diverifikasi.
- holberry.biz belum terbukti dimiliki atau live; domain lama tidak otomatis redirect.
- Trademark belum legally cleared; tidak ada bukti revenue/customer validation.
- Pemindahan docs mengubah path untuk link eksternal; arsip jelas NON-KANONIS hanya melalui indeks aktif, isi historis tetap asli.
- Repository belum diaudit secara forensik terhadap secrets dalam seluruh riwayat; .gitignore tidak menjamin tidak ada kebocoran.
- Local commit bukan remote backup; push belum dilakukan.

### NEXT PHASE

PHASE 1 — MASTER BRAND FOUNDATION. Mulai setelah laporan penutupan Phase 0, bukan otomatis menandai fase berikutnya selesai. Instruksi ini historis Phase 0; dicabut oleh H-008 pada eksekusi lanjutan.

## Phase 1 — COMPLETE (2026-10-05)

STATUS COMPLETE: brand foundation lengkap. CHANGES vision/mission/positioning/promise/audience/territory/differentiation/fit test ditetapkan; protokol berkelanjutan H-008 berlaku. FILES BRAND-FOUNDATION.md, HOLBERY-MASTER.md, README.md, DECISIONS.md, ROADMAP.md dan scripts. TESTS heading wajib, scope, link, token-pattern lulus. RISKS diferensiasi adalah hipotesis, bukan bukti pasar. NEXT Phase 2.

Evidence: [phase-01.json](evidence/phase-01.json). Test: `node scripts/check-phase.mjs 1`. Dokumen diverifikasi, bukan klaim sukses legal/pelanggan. Lanjut otomatis sesuai H-008.
