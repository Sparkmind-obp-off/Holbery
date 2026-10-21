# HOLBERY BRS Launch Kit — Product, Checkout & Faceless Video
Date: 2026-10-21
Status: READY FOR CONTROLLED LAUNCH PREPARATION — NOT PROOF OF A SALE

## 1. Decision

Use the existing canonical HOLBERY Commerce path and the real digital product **Barber Revenue Starter System (BRS-2026-V1)** as the first offer. Do not build a second checkout in HOLBERY Marketplace. The marketplace storefront remains a discovery/demo surface until each listed product has its own verified asset, offer, policy and fulfillment path.

- Canonical product page: https://webapp-4.pages.dev/store/direct/products/barber-revenue-starter-system
- Direct store: https://webapp-4.pages.dev/store/direct
- Production readiness endpoint: https://webapp-4.pages.dev/api/commerce/readiness
- Product price currently recorded: Rp99.000. This is a launch hypothesis, not validated willingness-to-pay evidence.
- Real product package recorded: integrated 9-tab workbook, 9 PDFs, editable SOP/WhatsApp text and manifest; private asset is pinned by version, byte count and SHA-256.
- Payment method: Duitku POP JS **production**. Do not silently fall back to sandbox.

## 2. What is actually selectable today

Only list an item as purchasable if the canonical server catalog reports it published, active, purchasable, and delivery-ready. At this revision, BRS is the one recorded real offer. Do not turn demo cards into purchasable products or invent extra products, stock, discounts, reviews, testimonials, or sales.

For each future product, require: final files; owner-approved offer/price; accurate preview; terms/refund/privacy/support; private delivery asset and hash; tested checkout; and a verified fulfillment path.

## 3. Product page copy

### Headline
**Rapikan operasional barbershop tanpa harus membeli software bulanan.**

### Description
Barber Revenue Starter System adalah toolkit digital untuk membantu barbershop kecil menyusun harga layanan, mencatat penjualan harian, memantau target mingguan, merapikan SOP, dan menindaklanjuti pelanggan melalui template WhatsApp.

### What is included
- Workbook terintegrasi dengan 9 tab untuk angka usaha, harga, catatan operasional, pelanggan, dan dashboard pemilik.
- 9 dokumen PDF pendamping.
- Template SOP dan pesan WhatsApp yang dapat diedit.
- Panduan mulai cepat dan rencana implementasi 30 hari.
- File digital yang dapat diunduh setelah pembayaran benar-benar terverifikasi.

### Honest qualification
Produk ini menyediakan alat bantu pencatatan dan implementasi. Produk ini tidak menjamin omzet meningkat dan belum memiliki bukti hasil pelanggan yang boleh diklaim. Harga Rp99.000 adalah harga peluncuran yang perlu diuji dengan calon pembeli nyata.

### CTA
**Lihat isi paket → Pilih produk → Checkout aman**

## 4. Faceless video storyboard (30–40 seconds)

Format: vertical 9:16, 1080x1920, clean premium dark/cream HOLBERY style, crisp screen recordings of the actual workbook and product page. Use real UI and real files only; blur personal/customer information. No fabricated dashboard metrics, fake reviews, or fake checkout-success screen.

1. 0–3s — Hook. On-screen: “Catatan barbershop masih berantakan?” Show neutral close-up of a blank notebook and a real workbook opening.
2. 3–8s — Problem. Show blank daily-sales and service-price notes. Text: “Harga, omzet harian, dan pelanggan perlu dicatat dengan rapi.”
3. 8–17s — Product reveal. Screen-record the actual 9-tab workbook. Show tabs and blank/sample cells clearly labelled as examples. Text: “Satu workbook terintegrasi + 9 PDF + template SOP/WhatsApp.”
4. 17–24s — Practical use. Demonstrate entering a clearly labelled example value in a copy of the workbook; do not imply it is a customer result. Show target vs actual only as a calculation example.
5. 24–30s — Offer. Show actual product page and price as currently configured. Text: “Barber Revenue Starter System — Rp99.000.” Keep the price synchronized with the live page before publishing.
6. 30–36s — Purchase route. Show the real product page CTA and a neutral checkout overview. Do not show a successful production payment unless a genuine payment occurred. Text: “Pilih produk, checkout melalui Duitku POP JS, lalu akses file setelah pembayaran terverifikasi.”
7. 36–40s — CTA. “Lihat detail paket di HOLBERY.” Show the canonical product URL as a readable caption.

### Voice-over
“Operasional barbershop tidak harus dimulai dari software bulanan yang rumit. Barber Revenue Starter System membantu kamu merapikan harga layanan, catatan penjualan, target mingguan, SOP, dan follow-up pelanggan dalam satu toolkit digital. Paketnya berisi workbook terintegrasi, sembilan PDF, serta template yang bisa diedit. Lihat isi dan ketentuan lengkapnya di halaman produk HOLBERY. Pembayaran diproses melalui Duitku; file diberikan setelah pembayaran terverifikasi.”

## 5. Caption for organic distribution

Barbershop kecil juga perlu sistem yang gampang dijalankan—mulai dari harga layanan, catatan penjualan harian, sampai follow-up pelanggan.

Barber Revenue Starter System adalah toolkit digital berisi workbook terintegrasi, 9 PDF, serta template SOP/WhatsApp yang dapat diedit.

Lihat isi paket, harga, dan ketentuan sebelum membeli:
https://webapp-4.pages.dev/store/direct/products/barber-revenue-starter-system

Catatan: toolkit ini membantu merapikan proses kerja; tidak menjanjikan kenaikan omzet tertentu.

## 6. Duitku POP JS Production acceptance gate

The canonical integration already has a production adapter and POP JS loading documented, but the latest recorded release evidence (2026-10-06) explicitly says a real invoice, genuine payment, verified callback, fulfillment and first sale had NOT started. Readiness = READY is not payment verification.

Before saying “pembayaran live teruji”:
- Refresh current production readiness and deployment identity.
- Confirm checkout creates an order and a production Duitku invoice only when a genuine buyer initiates checkout.
- Confirm POP JS loads from https://app-prod.duitku.com/lib/js/duitku.js.
- Confirm provider reference is persisted against the correct order and amount.
- Confirm server callback signature verification and transaction-status inquiry agree on order/reference/amount/status.
- Confirm browser success/return URL alone cannot mark an order paid.
- Confirm a genuine paid order receives the correct private package and verified download.
- Record redacted evidence; never place secrets, full customer data, or payment details in public GitHub.

Do not create an invoice, charge a card/account, alter production secrets, or publish a public paid campaign as a test without explicit owner approval. Never create a fake customer/payment or forge a production callback.

## 7. Release checklist

- [ ] Refresh production evidence; current release record is dated 2026-10-06.
- [ ] Re-check live product page, exact price, package contents and policies.
- [ ] Re-check readiness endpoint and confirm no unexpected missing gates.
- [ ] Review current code and deployment for checkout, POP JS, callback, inquiry and private delivery.
- [ ] Test all non-financial paths and error states without creating production invoices.
- [ ] Record whether email routing is still inactive; do not claim email automation until verified.
- [ ] Produce video from actual UI/product assets; review price, URL, captions and privacy.
- [ ] Publish one controlled, non-spam distribution test and record reach, clicks, qualified inquiries and paid conversions.
- [ ] Update the release evidence only with observed facts.
- [ ] Call the first sale complete only after a genuine payment and fulfillment are verified end-to-end.

## 8. Immediate next step

Perform a fresh production and source audit of the canonical Commerce route, then fix only the first verified blocker. Do not rebuild the checkout in Marketplace or expand the catalog with demo products. The video is a distribution asset; it does not replace product, payment, fulfillment, or buyer validation.
