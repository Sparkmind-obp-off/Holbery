# HOLBERY — Architecture

Versi: 1.0 | 2026-10-05 | Fondasi Phase 0
Sumber identitas: [HOLBERY-MASTER.md](HOLBERY-MASTER.md).
Domain strategis induk: `holberry.biz`; kepemilikan dan konfigurasi belum diverifikasi, implementasi digital pada Phase 4.

## Empat pilar, satu induk

```text
HOLBERY
├── SYSTEMS
├── PRODUCTS
├── VENTURES
└── COMMERCE
```

| Pilar | Cakupan | Batas |
|---|---|---|
| SYSTEMS | Infrastruktur bisnis, software, sistem operasional, automasi, tools | Bukan semua produk harus menjadi SaaS |
| PRODUCTS | Produk digital/fisik, kits, templates, resources, solusi terkemas | Tidak membutuhkan bisnis vertikal baru untuk tiap produk |
| VENTURES | Bisnis/vertikal yang diinkubasi, dioperasikan, atau dimiliki HOLBERY | Kandidat tidak sama dengan bisnis aktif atau dimiliki secara hukum |
| COMMERCE | Distribusi, marketplace, affiliate, partner, infrastruktur perdagangan | Kanal distribusi tidak otomatis menjadi master brand baru |

Setiap proyek mempunyai satu kategori primer berdasarkan fungsi utamanya. Ketergantungan lintas pilar dicatat sebagai hubungan, bukan duplikat proyek. Contoh: Barber Business System berada di SYSTEMS; kit turunannya dapat berada di PRODUCTS dengan referensi proyek asal; sebuah operator barber baru di VENTURES hanya jika di-onboard terpisah. Penjualan melalui COMMERCE tidak mengubah kategori primer.

Governance dan kapabilitas bersama mendukung empat pilar; bukan pilar kelima. Independent, endorsed, dan parent-native adalah mode hubungan merek, bukan hierarki induk tandingan. Katalog proyek dan pengujian klasifikasi dituntaskan pada Phase 2–3.

## Struktur repository aktual

```text
/
├── HOLBERY-MASTER.md          # Identitas dan otoritas tunggal
├── README.md                 # Pintu masuk dan panduan
├── ARCHITECTURE.md           # Pilar dan prinsip
├── DECISIONS.md              # Keputusan aktif
├── BRAND-RULES.md            # Guardrails dasar
├── ROADMAP.md                # Tracker fase dan bukti
├── .gitignore               # Batas secrets dan artefak lokal
└── archive/
    └── legacy-parent-house/ # NON-KANONIS; isi historis dipertahankan
        ├── README.md
        └── docs/            # 18 dokumen terdahulu
```

Tidak membuat `apps`, `packages`, layanan auth, registry database, commerce engine, atau dashboard sebelum dibutuhkan. Repository saat ini hanya dokumentasi; tidak ada package.json, aplikasi berjalan, atau konfigurasi deployment. Jangan menambahkan scaffold aplikasi hanya untuk memenuhi asumsi template.

## Prinsip arsitektur

1. Lightweight first; penyelesaian masalah operator lebih penting dari banyaknya komponen.
2. Reuse setelah pola berulang terbukti; jangan bangun shared platform spekulatif.
3. Pisahkan induk, identitas child, produk, dan entitas hukum.
4. Satu sumber keputusan dan status; arsip tidak berlaku sebagai instruksi aktif.
5. Gunakan kontrak/interface kecil ketika reuse benar-benar diperlukan.
6. Isolasi aset, izin, dan data privat. Tidak ada data pelanggan atau secrets di git.
7. Pilih persistence hanya saat data nyata dibutuhkan; untuk aplikasi Cloudflare gunakan D1 atau R2 sesuai kebutuhan, bukan memory/file runtime.
8. Website MVP Phase 4 cukup satu landing page induk. Pilihan hosting ditetapkan sebelum deployment; Phase 0 tidak memilih atau menjalankan deployment.
9. Tidak ada migrasi, redirect domain, penggantian aplikasi, atau klaim ownership tanpa bukti dan keputusan.
10. Penambahan perusahaan anak, licensing, investasi, dan multi-tenant infrastructure mengikuti aktivitas bisnis nyata, bukan diagram.

## Batas implementasi

Perubahan Phase 0 adalah dokumentasi dan pengarsipan, bukan pemenuhan Phase 2 atau Phase 4. Pengarsipan mengubah path dokumen lama; referensi dari luar repository ke path lama perlu diperbarui bila digunakan. Tautan antar dokumen historis tetap dipertahankan dalam subtree yang sama.
