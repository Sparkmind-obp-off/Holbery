# HOLBERY — Project Lifecycle

Phase 2 | Canonical lifecycle. Category != lifecycle != legal status != deployment status.
[Master architecture](MASTER-ARCHITECTURE.md).

```text
IDEA → EXPERIMENT → VALIDATED → PRODUCT → VENTURE → SCALE → RETIRE / EXIT
```

Ini jalur kemungkinan, bukan kewajiban menjadikan setiap produk venture. PRODUCT dapat tetap PRODUCT; proyek dapat RETIRE dari tahap mana pun. EXIT berarti perpindahan hak/operasi, bukan sekadar menghentikan fitur.

| Tahap | Evidence untuk masuk | Deliverable / owner | Gate berikutnya |
|---|---|---|---|
| IDEA | Customer/problem hypothesis dan satu owner | Brief, primary category, risiko hak | Budget/timebox dan metode eksperimen disetujui |
| EXPERIMENT | Test plan, consent/data boundary, budget cap | Experiment log dan hasil penggunaan oleh operator | Threshold outcome/willingness-to-pay tercapai, bukan fake/demo metrics |
| VALIDATED | Bukti operator independen, baseline, outcome, sample/limitations; commercial test | Validasi diberi tanggal, applicability, decision authority | Delivery repeatable, offer/pricing/support siap |
| PRODUCT | Paket versioned, jelas customer/problem/outcome/price/delivery/support | Product owner, quality check, delivery log | Owner/P&L/operating cadence terpisah jika hendak jadi venture |
| VENTURE | Business owner, contracts/IP clarity, P&L dan repeatable demand | Venture lead, review bulanan, risk register | Contribution margin positif, runway/capacity, distribution repeatable |
| SCALE | Bukti capacity, unit economics dan retention stabil | Scale owner dengan rollback/budget | Expand incrementally; pantau support dan quality |
| RETIRE | Gagal gate, kehilangan demand, risiko, atau opportunity cost | Decision dan shutdown checklist | Close obligations, export/delete data sah, revoke keys, archive |
| EXIT | Persetujuan legal/destructive, buyer/recipient dan asset map | Transfer contract, license, domains, data basis | Handover diverifikasi dan parent endorsement disesuaikan |

## Aturan transisi

Tidak boleh melompat IDEA → VALIDATED hanya karena dokumen/code selesai. Live deployment bukan validasi bisnis. Synthetic data tidak dihitung sebagai feedback operator. Evidence harus mencatat sumber, rentang waktu, sample, biaya dan limitations. Jika validation kadaluarsa atau asumsi berubah, kembali EXPERIMENT dengan keputusan; jangan hapus sejarah.

Status eksekusi laporan: COMPLETE (deliverable memenuhi acceptance), IMPLEMENTED (dibuat), VERIFIED (hasil test/eksternal yang spesifik), BLOCKED (komponen gagal/tidak tersedia), REQUIRES USER ACTION (izin/asset/operator dibutuhkan). Status ini tidak mengganti lifecycle proyek.

## Validasi minimum awal barber

Lima discovery conversations; dua operator pilot; 14 hari pencatatan; completeness >=90%, reconciliation dua sesi berturut-turut tanpa discrepancy, feedback bahwa workflow bisa dijalankan; setidaknya satu bukti paid commitment untuk graduation komersial. Semua threshold adalah desain eksperimen, belum tercapai. Pilot manual tanpa SaaS dapat membuktikan value.

## Project record

Sembilan field wajib: PROJECT NAME, CATEGORY, OWNER, STATUS, PARENT, REPOSITORY, DOMAIN, CUSTOMER TYPE, REVENUE MODEL. Tambahkan ID, visibility, lifecycle, evidence references, dependencies, legal owner/status, next review, budget dan exit conditions. Placeholder UNASSIGNED/UNVERIFIED menghalangi operasi komersial yang membutuhkan owner.

## Review dan retirement

Decision authority menilai evidence sebelum graduation. Approval legal/destructive tidak otomatis diberikan oleh instruksi membangun sistem. Retire tidak menghapus kewajiban refund/support/license. Catat data retention, customer communication, asset ownership, akses akun, biaya berulang, dan final P&L sebelum penutupan.
