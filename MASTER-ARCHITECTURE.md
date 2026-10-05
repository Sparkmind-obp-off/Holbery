# HOLBERY — Master Architecture

> Canonical Library layer: [HOLBERY-LIBRARY.md](HOLBERY-LIBRARY.md). The Library is the parent registry and reusable capability layer; the four operating pillars remain the primary business categories.

Phase 2 | COMPLETE: klasifikasi dan governance struktur.
Induk: [HOLBERY-MASTER.md](HOLBERY-MASTER.md). Lifecycle: [PROJECT-LIFECYCLE.md](PROJECT-LIFECYCLE.md).

```text
HOLBERY
├── LIBRARY
│   ├── SYSTEMS
│   ├── PRODUCTS
│   ├── VENTURES
│   ├── COMMERCE
│   ├── KNOWLEDGE
│   ├── CAPABILITIES
│   └── ASSETS
└── BRAND PORTFOLIO
    └── CHILD BRANDS (only when justified)
```

## Pilar dan entry criteria

| Pilar | Purpose / entry | Ownership operasional | Nama / parent relationship | Graduation | Retirement |
|---|---|---|---|---|---|
| SYSTEMS | Workflow/tool/infrastructure yang menyelesaikan pekerjaan berulang; problem dan user jelas | System owner accountable atas reliability, support, dan data; legal owner diverifikasi terpisah | HOLBERY langsung jika trust parent berguna; independen hanya dengan gate | Penggunaan nyata, repeatability, dokumentasi/support dan economics cukup untuk PRODUCT | Tidak digunakan, outcome gagal, biaya/support tidak layak, risiko keamanan |
| PRODUCTS | Unit penawaran yang terkemas, delivery berulang, customer/outcome/format jelas | Product owner atas kualitas, harga, delivery, feedback | Nama deskriptif lebih dulu; parent opsional | Demand berbayar repeatable; dapat tetap PRODUCT tanpa menjadi VENTURE | Refund/defect berulang, margin negatif, IP tak dapat digunakan |
| VENTURES | Bisnis yang dioperasikan/diinkubasi dengan customer, owner, P&L, dan operating responsibilities sendiri | Venture lead; legal asset/contracts tidak otomatis milik merek | Child independent jika market separation justified; endorsement sesuai hak nyata | Cash discipline, unit economics dan kapasitas layak menuju SCALE | Shutdown/exit dengan kontrak, data, domain dan IP diselesaikan |
| COMMERCE | Kanal atau capability distribution/partner/affiliate yang membantu akuisisi atau delivery | Channel/partner owner atas attribution, margin, fulfillment | Nama kanal bukan master brand; hubungan dicatat | Orders/delivery repeatable dan contribution positif | CAC/margin/support atau legal/channel risk tidak layak |

## Keputusan kategori

1. Apakah obyek adalah bisnis yang dioperasikan dengan economics sendiri? VENTURES.
2. Jika tidak, apakah fungsi utamanya distribusi/channel/partner commerce? COMMERCE.
3. Jika tidak, apakah fungsi utamanya workflow, tool atau infrastructure? SYSTEMS.
4. Jika tidak, apakah ia paket barang/resource/solusi yang dapat dikirim sebagai unit? PRODUCTS.
5. Jika belum jelas: HOLD; tulis fungsi primer dan user sebelum onboarding.

Satu ID, satu kategori primer. Hubungan secondary tidak menduplikasi record. Produk yang dijual tidak otomatis berganti dari SYSTEMS ke PRODUCTS: business system tetap SYSTEMS dengan offer di product catalog. Lifecycle dan category adalah dimensi terpisah.

## Uji contoh

Barber Business System → SYSTEMS; template penutupan kas → PRODUCTS; cafe yang benar-benar dioperasikan → VENTURES; affiliate channel → COMMERCE. Produk fisik sabun → PRODUCTS, software otomasi barber → SYSTEMS. Website induk adalah asset HOLBERY, bukan venture baru. Proyek privat Bozq → EXCLUDED, bukan onboarding otomatis. Ide kabur → HOLD.

## Ownership dan boundaries

Pemilik proyek bertindak sebagai decision authority sementara; identitas legal belum diverifikasi. Tidak semua software/shared IP harus dilisensikan ke setiap child. Record hubungan, hak penggunaan, legal entity, dan operator terpisah. Jangan mencampur customer data lintas brand tanpa dasar hukum/consent.

## Lifecycle penggunaan

Setiap pilar mengikuti IDEA → EXPERIMENT → VALIDATED → PRODUCT; transisi VENTURE/SCALE hanya jika sesuai tujuan dan evidence. Tahap bukan gelar marketing. [PROJECT-LIFECYCLE.md](PROJECT-LIFECYCLE.md) mengatur gates dan pengecualian. Review status bulanan atau setelah eksperimen; keputusan irreversible dicatat.
