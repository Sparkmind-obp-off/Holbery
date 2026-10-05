# HOLBERY

**Master Parent Brand System — v1.0**

Build. Operate. Grow.
Practical systems, products, and ventures.

## Status nyata

- HOLBERY adalah master parent brand, bukan produk tunggal.
- **PHASE 0 — PROJECT INITIALIZATION: COMPLETE**, khusus fondasi dokumentasi; 88/88 pemeriksaan lulus. Bukti: [ROADMAP.md](ROADMAP.md). Phase 1–10 sedang dieksekusi berkelanjutan; lihat tracker terkini.
- Domain strategis utama: `holberry.biz`; kepemilikan, DNS, HTTPS, dan email **belum diverifikasi**.
- Legal/trademark clearance: **belum selesai**.
- Website, sistem komersial, pelanggan nyata, dan revenue belum diimplementasikan atau dibuktikan dalam repository ini.

## Mulai di sini

[Sumber definisi tunggal: HOLBERY-MASTER.md](HOLBERY-MASTER.md).

| Dokumen aktif | Fungsi |
|---|---|
| [HOLBERY-MASTER.md](HOLBERY-MASTER.md) | Identitas, cakupan, otoritas, batas proyek, Definition of Done |
| [ARCHITECTURE.md](ARCHITECTURE.md) | SYSTEMS / PRODUCTS / VENTURES / COMMERCE dan prinsip implementasi |
| [DECISIONS.md](DECISIONS.md) | Keputusan aktif, termasuk penggantian domain/arsitektur historis |
| [BRAND-RULES.md](BRAND-RULES.md) | Guardrails induk, child brands, metadata, privasi, keamanan |
| [ROADMAP.md](ROADMAP.md) | Urutan Phase 0–10, gates, status, laporan bukti |
| README.md | Panduan masuk dan keadaan repository |

## Tujuan dan struktur

HOLBERY membangun dan mengoperasikan bisnis, sistem, produk digital/fisik, commerce, ventures, dan eksperimen masa depan dengan urutan **clarity → structure → execution → proof → revenue → scale**.

```text
HOLBERY
├── SYSTEMS
├── PRODUCTS
├── VENTURES
└── COMMERCE
```

Setiap proyek punya satu kategori primer dan hubungan pendukung bila diperlukan. Nama child/product tidak wajib memakai HOLBERY. Tidak membangun semua vertikal atau shared infrastructure sekaligus.

## Yang telah diterapkan

- Audit repository existing, keputusan domain/arsitektur terdahulu, dan batas proyek.
- Enam dokumen aktif yang diminta untuk fondasi Phase 0.
- Dokumentasi lama dipertahankan di [arsip historis](archive/legacy-parent-house/README.md), bukan sumber aktif.
- Git existing dan branch main dipertahankan; .gitignore ditambahkan untuk secrets/artefak lokal.
- Bozq One System tetap privat/internal Bosku Cukur; tidak mengimpor kode, aset, atau data privat.

## Yang belum diterapkan

- Phase 1: vision/mission/purpose, brand promise, audience dan positioning lengkap.
- Phase 2–3: pengujian klasifikasi proyek dan governance lengkap.
- Phase 4: website MVP, domain live, GitHub organization strategy, email, social, documentation hub, analytics, DNS dan hosting.
- Phase 5–6: asset/legal/IP register terverifikasi dan sistem operasi/registries.
- Phase 7–10: pilot Barber Business System, penawaran berbayar, ekspansi, dan skala ekosistem.

Arah pertama: Barber Business System di SYSTEMS, terpisah dari Bozq. Belum ada produk atau venture berstatus validated/live.

## Repository, URL, dan entry points

- Workspace: `/home/user/webapp/`.
- Remote terkonfigurasi: `https://github.com/Sparkmind-obp-off/Holbery`; permission dan autentikasi belum diuji pada Phase 0.
- Domain tujuan: `https://holberry.biz` — **bukan klaim URL produksi aktif**.
- URL produksi/preview: belum tersedia.
- Route aplikasi/API dan parameter: belum ada.
- Entry dokumentasi: README → HOLBERY-MASTER → dokumen terkait → ROADMAP.

## Data dan penyimpanan

Saat ini hanya file Markdown versioned di git. Belum ada database, customer records, layanan cloud storage, atau runtime persistence. Metadata proyek minimal dicatat di HOLBERY-MASTER; schema registry operasional belum diimplementasikan. Ketika aplikasi memerlukan persistence di Cloudflare, pilih D1/R2 sesuai kebutuhan dan jangan gunakan memory/file runtime.

## Panduan penggunaan

1. Baca HOLBERY-MASTER sebelum menambah proyek atau mengambil keputusan.
2. Cek BRAND-RULES dan tentukan kategori primer lewat ARCHITECTURE.
3. Catat keputusan material di DECISIONS dan selaraskan sumber terdampak.
4. Ikuti ROADMAP secara berurutan; klaim selesai hanya dengan bukti.
5. Jangan gunakan isi archive sebagai instruksi aktif atau bukti kesiapan bisnis.

## Deployment dan pengujian

Repository existing adalah dokumentasi, tanpa package.json, aplikasi, atau konfigurasi Cloudflare. Tidak ada npm build/test, PM2 startup, browser test, deployment, DNS change, atau push GitHub pada Phase 0. Uji yang relevan: keberadaan dokumen, tautan relatif, konsistensi identitas, integritas arsip, pemeriksaan patch, dan hygiene git. Rincian hasil ada di ROADMAP.

Pemilihan jalur hosting dan konfigurasi dilakukan pada Phase 4 sebelum deployment. Gunakan existing repository; jangan membuat repo/organisasi baru tanpa keputusan. Trademark dan legal review berjalan sebagai workstream terpisah, bukan dianggap selesai oleh pemilihan domain.

## Langkah berikutnya

**PHASE 1 — MASTER BRAND FOUNDATION**, setelah laporan penutupan Phase 0. Tidak ada fase yang dilewati atau dinyatakan selesai otomatis oleh dokumentasi fondasi ini.
