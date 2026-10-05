# HOLBERY — Barber MVP Specification

Phase 7 | HOLBERY / SYSTEMS. Scope: Daily Close Toolkit v0.1, experimental.

## Inputs

services: completed integer count 0–10,000. price: effective average net service price in whole IDR. openingCash, cashReceipts, digitalReceipts, cashExpenses, actualCash: whole nonnegative IDR 0–1,000,000,000,000. All required; reject empty, NaN, infinity, negative, fractional currency and unsafe integer/calculation. Blank is not zero; zero-day is supported without division by zero.

## Calculations

expectedRevenue = services × price.
recordedReceipts = cashReceipts + digitalReceipts.
receiptGap = recordedReceipts − expectedRevenue.
expectedCash = openingCash + cashReceipts − cashExpenses.
cashDiscrepancy = actualCash − expectedCash.
receiptsLessCashExpenses = recordedReceipts − cashExpenses (explicitly NOT PROFIT).

Cash expenses exceeding available cash are rejected in this simple workflow. Digital receipts do not change cash drawer. Refunds/tips/discounts/owner withdrawals/commissions/credit sales excluded; use operational context/adjusted separate records, not silently classify differences as theft or profit. No automatic accounting conclusions.

## UI / security

Labelled required inputs, explicit IDR units, min/step constraints plus JS validation; submit triggers pure calculateDailyClose; errors role=alert, results aria-live=polite. Clear error/result state on failure; never render user input as HTML. Browser-only script, no fetch/storage for inputs, no customer identifiers. Download paths are static whitelisted toolkit files. Minimal server routes remain informational, /api/health does not collect data.

## Acceptance tests

Balanced synthetic 10×30,000; cash200,000 + digital100,000; opening100,000 − expenses50,000 → expected revenue300,000, expected cash250,000, discrepancies0. Digital-only day changes no cash except expenses. Negative, missing, fractions, excess service count/currency, infinity/overflow rejected. An unexplained receipt/cash gap yields Investigate, not a false balanced label. Zero values work. Browser checks mobile rendering, valid submit and required-field error; HTTP checks CSV/HTML downloads and CSP.

## Delivery artifacts

public/static/calculations.js, barber.js; /systems/barber; /downloads/daily-close.csv; /downloads/weekly-review.csv; /downloads/barber-onboarding.html. CSV headers are blank templates, not customer records. Printable instructions include formulas, boundaries and next-day review. Actual pilot metrics stay separate from synthetic tests.
