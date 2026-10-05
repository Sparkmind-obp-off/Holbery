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

## H-008 — Continuous execution / BYOK / GitHub

2026-10-05 / ACCEPTED. Instruksi FULL MASTER EXECUTION mencabut stop per fase dari H-007. Phase 0 tidak diulang. Setiap fase diuji, diberi evidence, dan dilanjutkan otomatis. Blocker komponen dicatat tanpa menghentikan pekerjaan independen. Pengguna meminta push existing GitHub dan deployment Cloudflare BYOK; kedua credential setup berhasil, fetch origin main berhasil. Tidak membuat organisasi baru, tidak force-push, tidak mempublikasikan IP internal.

## H-009 — Empat pilar dan lifecycle independen

2026-10-05 / IMPLEMENTED. MASTER-ARCHITECTURE dan PROJECT-LIFECYCLE menyelesaikan detail H-003. Satu kategori primer; lifecycle bukan kategori. PRODUK tidak wajib menjadi VENTURE. Proyek privat EXCLUDED; ambiguous HOLD.

## H-010 — Naming tanpa child brand spekulatif

2026-10-05 / IMPLEMENTED. Parent-native/descriptive/child-review ditentukan audience, independence, rights, dan equity. Child review bukan approval otomatis. Tidak mengubah nama internal. Legal ownership endorsement butuh bukti. Unit tests mencakup decision gate.

## H-011 — Delivery acceptance versus operational proof

2026-10-05 / ACCEPTED. FULL MASTER EXECUTION merevisi acceptance Phase 4 menjadi production-ready implementation, Phase 5 checklist, Phase 7 definition/validation path, Phase 8 offer ready for validation, Phase 9 evaluation engine, dan Phase 10 model/gates. COMPLETE pada deliverable tidak sama dengan seluruh external proof atau Definition of Done induk operasional. External components tetap BLOCKED/REQUIRES USER ACTION jika belum terbukti.

## H-012 — Cloudflare BYOK production and domain boundary

2026-10-05 / VERIFIED. Akun BYOK authenticated; new Pages project webapp-4 dibuat setelah collisions webapp/webapp-2 dan existing webapp-3 tidak disentuh. Stable host https://webapp-4.pages.dev lulus HTTP/browser test; transient asset/TLS propagation awal dicatat. Token tidak melihat zone holberry.biz; tidak ada DNS mutation. SEO canonical memakai host live, strategic domain tetap holberry.biz. Original SVG dibuat tanpa gambar stock/dependency CDN.

## H-013 — Barber research MVP, not real operator proof

2026-10-05 / IMPLEMENTED + ENGINEERING VERIFIED. Browser-only daily-close calculator, blank CSVs and printable instructions built independently. No persistent customer data, network transmission of calculator inputs, payment collection or private Bozq IP. Synthetic tests do not count as real operators. SYS-BARBER-001 remains EXPERIMENT with owner UNASSIGNED and actual sample0.

## H-014 — Wrap-up pause requested by user

2026-10-05 / ACCEPTED. Latest instruction requests wrapping up accomplishments/remaining work and no new subtasks. Close existing Phase7 work, verify/commit/push/redeploy and deliver current report. Phase8–10 remain PENDING, explicitly not completed or represented as externally blocked. Resume at Phase8 when execution is resumed; no Phase0 redo. H-008 continuous protocol is paused for this run by newer user instruction.

## H-015 — Verified source release, existing GitHub and BYOK

2026-10-05 / VERIFIED. Source commit 02202ca6617ea139ef2db6bd810676e58188efac pushed non-destructively to Sparkmind-obp-off/Holbery main; remote SHA matched. Same built app deployed Cloudflare BYOK project webapp-4: https://e0e8c8b2.webapp-4.pages.dev, stable https://webapp-4.pages.dev. Production HTTP/browser/calculator tests passed. release.json records proof; final documentation-only evidence commit is pushed separately, with no source/runtime change. Phase8–10 remain pending per H-014.
