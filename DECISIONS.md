# HOLBERY — Decision Log

Log aktif v1.0 | 2026-10-05
Identitas kanonis: [HOLBERY-MASTER.md](HOLBERY-MASTER.md).

## Format keputusan

ID | tanggal | status | keputusan | alasan | sumber/bukti | dampak | yang digantikan.
Status keputusan berbeda dari status implementasi. Perubahan identitas harus memperbarui seluruh dokumen aktif dalam commit yang sama. Keputusan berikutnya ditambahkan, bukan menghapus riwayat.

## H-001 — Satu induk, satu sumber kebenaran

- Tanggal/status: 2026-10-05 / ACCEPTED; dokumentasi diimplementasikan pada Phase 0.
- Keputusan: HOLBERY tetap MASTER PARENT BRAND. HOLBERY-MASTER.md adalah sumber definisi; README hanya indeks.
- Alasan/sumber: MASTER EXECUTION PROMPT v1.0 dari pemilik proyek, instruksi terbaru dalam sesi ini.
- Dampak: tidak kembali ke eksplorasi nama tanpa konflik material; domain strategis dan empat pilar harus konsisten.
- Riwayat: mempertahankan pilihan HOLBERY dari keputusan historis D-001, tanpa mengadopsi seluruh roadmap lama.

## H-002 — Domain utama baru ditetapkan, bukan diklaim secured

- Tanggal/status: 2026-10-05 / ACCEPTED secara strategis; konfigurasi belum diimplementasikan.
- Keputusan: `holberry.biz` adalah domain utama sesuai instruksi terbaru; ejaan ini berbeda dari `holbery.biz.id`.
- Alasan/sumber: Phase 0 dan Phase 4 pada master execution prompt terbaru.
- Dampak: menggantikan primary domain dalam D-003 dan dokumen historis 17. Tidak melakukan DNS, pembelian, redirect, transfer, email, atau deployment pada Phase 0.
- Bukti/batas: repository lama menyatakan `holbery.biz.id` user-confirmed secured. Pernyataan itu dipertahankan sebagai sejarah, bukan bukti kepemilikan domain baru. Kepemilikan/live DNS/HTTPS kedua domain tidak diverifikasi dalam fase ini.
- Tindak lanjut Phase 4: verifikasi kendali domain baru dan tentukan hubungan domain lama bila memang masih dimiliki. Jangan membuat redirect tanpa izin/kendali yang sah.

## H-003 — Hierarki empat pilar

- Tanggal/status: 2026-10-05 / ACCEPTED; diagram dasar diimplementasikan.
- Keputusan: HOLBERY → SYSTEMS / PRODUCTS / VENTURES / COMMERCE.
- Alasan/sumber: Phase 2 dalam master execution prompt.
- Dampak: menggantikan hierarki aktif Parent-led Hybrid House lama. Mode independent/endorsed/parent-native tetap dapat dipakai sebagai hubungan merek; tidak menjadi hierarki alternatif. Detail klasifikasi dan acceptance Phase 2 masih pending.

## H-004 — Pelestarian aset tanpa otoritas ganda

- Tanggal/status: 2026-10-05 / ACCEPTED; pengarsipan diimplementasikan.
- Keputusan: simpan byte asli README lama dan 18 dokumen lama di `archive/legacy-parent-house/`; NON-KANONIS.
- Alasan: pekerjaan valid harus dipertahankan, tetapi domain, arsitektur, dan fase lama tidak boleh bersaing dengan definisi terbaru.
- Bukti: baseline repository commit `9babed0`, main, 19 file terlacak, working tree awal bersih. Remote: `https://github.com/Sparkmind-obp-off/Holbery.git`.
- Dampak: path docs lama berubah; pengguna link eksternal perlu mengarah ke sumber aktif/arsip yang sesuai. Isi historis dan tautan relatif dalam subtree docs dipertahankan.

## H-005 — Batas Bozq dan proyek lain dipertahankan

- Tanggal/status: 2026-10-05 / ACCEPTED; guardrails tertulis.
- Keputusan: Bozq One System tetap privat/internal Bosku Cukur. Barber Business System adalah arah penawaran terpisah di SYSTEMS, belum dibangun atau divalidasi.
- Alasan/sumber: Rule 4 dan Phase 7 pada prompt; sesuai pemisahan historis D-006.
- Dampak: tidak ada impor kode/data/aset privat. Tolvey/Tolva tetap terpisah dan Kestora belum di-onboard, mempertahankan D-007/D-008 sampai ada keputusan eksplisit.

## H-006 — Repository yang ada digunakan ulang

- Tanggal/status: 2026-10-05 / ACCEPTED; struktur dokumentasi diterapkan lokal.
- Keputusan: gunakan repository existing `Sparkmind-obp-off/Holbery`, branch main, workspace `/home/user/webapp/`; tidak membuat repository/organisasi baru.
- Alasan: audit menemukan repository dokumentasi, bukan aplikasi Hono. Tidak ada package.json atau runtime untuk dibuild.
- Dampak: npm build, browser test, service startup, dan deploy tidak berlaku pada Phase 0. Remote authentication/permission belum diuji; tidak melakukan push tanpa setup GitHub yang berhasil.

## H-007 — Eksekusi bertahap dan legal honesty

- Tanggal/status: 2026-10-05 / ACCEPTED.
- Keputusan: jalankan Phase 0 lalu stop/report. Phase 1–10 tetap pending meskipun arah dasarnya tercatat.
- Alasan/sumber: execution protocol; clarity → structure → execution → proof → revenue → scale.
- Dampak: tidak mengklaim website live, legal/trademark clearance, asset ownership, customer validation, atau revenue. Pemilik administratif dan entitas hukum harus diverifikasi; tidak menebak dari nama GitHub.
