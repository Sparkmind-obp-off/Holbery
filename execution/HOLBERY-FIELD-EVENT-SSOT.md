# HOLBERY FIELD EVIDENCE & EVENT SSOT

**Status:** CANONICAL  
**Date:** 2026-10-06  
**Strategy:** BRAND-FIRST, PROOF-DRIVEN, COMMERCE-BACKED

## 1. Purpose

This is the canonical contract for events used to understand whether HOLBERY free tools, products, commerce and brand surfaces are actually being used.

The purpose is not to build a large analytics platform. It is to answer:
1. Did a real person reach the utility?
2. Did they actually use it?
3. Did the utility produce a useful result?
4. Did they show deeper product intent?
5. Did intent become a real transaction?
6. Was the transaction genuinely verified?
7. Was the product delivered and acknowledged?
8. What was learned afterward?

## 2. Canonical principle

**Event data is evidence, not truth by default.**

| Event class | Canonical source of truth |
|---|---|
| Anonymous tool interaction | First-party field-event ledger, when implemented |
| Product/catalog state | Commerce database / canonical product records |
| Cart/checkout state | Commerce database |
| Payment state | Verified provider callback + server inquiry, persisted in commerce DB |
| Fulfillment state | Commerce database / delivery records |
| Customer feedback | Structured evidence record |
| Strategic interpretation | Evidence ledger + decision documents |
| Social metrics | Platform-native analytics; secondary evidence only |

Client-side events may describe behavior, but **never establish payment, order, customer identity, fulfillment, revenue, or commercial success**.

## 3. SSOT hierarchy

When sources disagree, resolve them in this order:

1. Server-side transactional records
2. Verified payment/provider evidence
3. Server-generated fulfillment/delivery evidence
4. First-party field-event ledger
5. Structured customer evidence
6. Platform analytics
7. Client/browser observations
8. Human interpretation

No marketing dashboard, browser callback, URL parameter, or social metric may override transactional truth.

## 4. Canonical event naming

Use lowercase snake_case.

Event names describe an observed fact, not an interpretation.

Good:
- tool_started
- tool_completed
- result_viewed
- product_cta_clicked
- checkout_started
- payment_verified

Bad:
- high_intent_user
- great_customer
- successful_campaign
- likely_to_buy

Interpretations belong in analysis, not event names.

## 5. Minimum canonical field-event set

### Acquisition / surface

| Event | Meaning | Required |
|---|---|---|
| surface_viewed | A public HOLBERY surface was viewed | Yes |
| tool_opened | A free tool was opened | Yes |
| tool_started | Meaningful interaction with a tool began | Yes |
| tool_completed | Required tool inputs were completed and calculation/diagnostic ran | Yes |
| result_viewed | Tool result was rendered | Yes |
| product_cta_viewed | Paid-product CTA became visible | Yes |
| product_cta_clicked | User clicked toward the paid product | Yes |

### Commerce intent

| Event | Meaning | Authority |
|---|---|---|
| product_viewed | Canonical product page viewed | Supporting event |
| cart_created | Server created a cart | Existing commerce truth |
| cart_item_added | Item was added server-side | Existing commerce truth |
| checkout_started | Server accepted checkout creation | Existing commerce truth |
| order_created | Server created an order | Existing commerce truth |

### Payment

| Event | Meaning | Authority |
|---|---|---|
| payment_initiated | Invoice/payment flow was initiated | Server |
| payment_provider_reference_received | Provider returned a reference | Server |
| payment_notification_received | Provider notification reached server | Server |
| payment_verified | Server verified provider status, identity and amount | Canonical commercial evidence |
| payment_failed | Verified payment failure | Server |
| payment_unknown | Provider outcome cannot safely be classified | Server |

### Delivery / completion

| Event | Meaning |
|---|---|
| fulfillment_started | Paid order entered fulfillment |
| fulfillment_completed | Product/package was made available under entitlement rules |
| delivery_acknowledged | Customer acknowledged receipt of the matching package |
| order_completed | Commerce lifecycle reached completion |

### Learning

These are recorded only when meaningful evidence exists:
- feedback_received
- outcome_reported
- repeat_use_observed
- product_iteration_decided

## 6. Event envelope

Every first-party field event should use a minimal envelope:

event_id
event_name
occurred_at
surface
tool_id / product_id when applicable
session_id, anonymous and non-PII
source
schema_version

Optional contextual fields:
- referrer_class
- campaign_id
- experiment_id
- result_class
- funnel_step

Do not put email, phone number, payment credentials, Duitku secrets, raw customer conversations, unnecessary IP addresses, sensitive business data, or free-form PII into field-event payloads.

## 7. Identity rule

The first free-tool implementation should be **anonymous by default**.

A random session identifier may connect events within a short-lived session, but it is not a customer identity.

Customer identity begins only where the commerce system legitimately requires it.

Do not force account creation merely to measure a free tool.

## 8. What we actually need to measure

### Reach
How many people opened the tool?

### Activation
How many actually completed it?

### Utility
How many viewed a meaningful result?

### Intent
How many reached or clicked the relevant product?

### Commercial
How many started checkout?

### Proof
How many became a genuinely verified paid customer?

### Learning
What did those users tell us or what outcome did they report?

The most important metric is **not traffic**.

The first commercial proof is:

> real external person → real use → real value → real payment → verified delivery → evidence.

## 9. Derived metrics

Dashboards must derive metrics from canonical events. They must not become a second source of truth.

Examples:
- Tool activation rate = tool_completed / tool_opened
- Result rate = result_viewed / tool_started
- Product intent rate = product_cta_clicked / tool_completed
- Checkout intent rate = checkout_started / product_cta_clicked
- Paid conversion = payment_verified / checkout_started
- Verified revenue = sum of server-verified paid orders only

No metric may be labeled revenue when it is based only on client events.

## 10. Free-tool architecture rule

A free tool is a **utility + discovery sensor + acquisition surface**.

It is not:
- a fake lead magnet;
- an excuse to collect PII;
- a full analytics product;
- a replacement for customer discovery;
- the HOLBERY product itself.

The free tool should solve a small real problem first.

For the first implementation:

**FREE TOOL → RESULT → RELEVANT PRODUCT → REAL TRANSACTION**

## 11. Discovery rule

HOLBERY does not need to interview every user.

Behavioral evidence should identify where deeper discovery is worth the effort.

Thus:

**behavioral discovery first, human discovery second.**

Human interviews remain valid, but become targeted rather than mandatory for every prospect.

## 12. Social media rule

Social channels are **distribution and trust surfaces**, not the commercial SSOT.

Metrics such as impressions, followers, likes and views are secondary evidence.

They do not prove product-market fit, demand, revenue, or customer value.

## 13. Event implementation phases

### E0 — Documentation
Complete now:
- canonical event vocabulary;
- SSOT hierarchy;
- privacy boundaries;
- evidence rules.

### E1 — First free tool
Implement one useful tool only.

Recommended first candidate:

**HOLBERY Barber Revenue Calculator**

Required events:
- tool_opened
- tool_started
- tool_completed
- result_viewed
- product_cta_viewed
- product_cta_clicked

### E2 — Commerce linkage

Reuse existing server-side commerce truth:
- product_viewed
- cart_created
- cart_item_added
- checkout_started
- order_created
- payment_verified
- fulfillment_completed
- delivery_acknowledged
- order_completed

Do not duplicate payment truth in a marketing event system.

### E3 — Learning

Add structured feedback/outcome capture only after real usage exists.

### E4 — Optimization

Only after meaningful evidence:
- compare tools;
- improve CTA;
- improve product;
- add another utility;
- add channel attribution;
- build dashboards if necessary.

## 14. What we explicitly will NOT build now

Do not build:
- a large analytics warehouse;
- complex attribution;
- user accounts for free tools;
- invasive tracking;
- a social-media automation empire;
- ten free tools at once;
- a marketplace;
- a multi-vendor system;
- a new paid product before the first proof;
- speculative AI features.

## 15. Canonical decision rule

Every new event must answer:

> **What business uncertainty does this event reduce?**

If it does not reduce a real uncertainty, do not collect it.

Every new metric must answer:

> **What decision will this metric change?**

If the answer is none, do not build the metric.

## 16. Relationship to existing HOLBERY evidence framework

This event system supports, but does not replace, the existing evidence hierarchy:

**E0 Intention → E1 Artifact → E2 Verification → E3 External Use → E4 Transaction → E5 Outcome → E6 Repeatability → E7 Durable Asset**

Events primarily help establish **E3 External Use** and provide evidence around the path toward **E4 Transaction**.

A high event count is never equivalent to a high evidence level.

## 17. First implementation decision

The immediate execution target is intentionally small:

> **Document the canonical event contract first. Then implement one free tool and only the minimum events required to learn whether real people use it and move toward the first paid product.**

The first tool should be judged by usefulness and evidence, not by feature count.

---

**Canonical status:** This document is the source of truth for HOLBERY field-event vocabulary and event/analytics boundaries unless superseded by a formally versioned architecture decision.
